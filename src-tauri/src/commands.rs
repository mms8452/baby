use crate::db::{Database, FileInfo, Settings};
use chrono::{DateTime, Datelike, NaiveDate, Utc};
use image::imageops::FilterType;
use rayon::prelude::*;
use std::fs;
use std::path::{Path, PathBuf};
use std::time::UNIX_EPOCH;
use tauri::State;
use walkdir::WalkDir;

// 支持的图片格式
const IMAGE_EXTENSIONS: &[&str] = &["jpg", "jpeg", "png", "gif", "bmp", "webp", "heic"];
// 支持的视频格式
const VIDEO_EXTENSIONS: &[&str] = &["mp4", "mov", "avi", "mkv", "wmv", "flv", "webm"];

/// 计算文件年龄组（例如 "0岁3月"）
fn calculate_age_group(birth_date: &str, file_timestamp: i64) -> String {
    let birth = match NaiveDate::parse_from_str(birth_date, "%Y-%m-%d") {
        Ok(date) => date,
        Err(_) => return "未知".to_string(),
    };

    let file_date = match DateTime::from_timestamp(file_timestamp, 0) {
        Some(dt) => dt.naive_utc().date(),
        None => return "未知".to_string(),
    };

    if file_date < birth {
        return "出生前".to_string();
    }

    let years = file_date.year() - birth.year();
    let months = file_date.month() as i32 - birth.month() as i32;
    let days = file_date.day() as i32 - birth.day() as i32;

    let mut total_months = years * 12 + months;
    if days < 0 {
        total_months -= 1;
    }

    let age_years = total_months / 12;
    let age_months = total_months % 12;

    if age_years == 0 {
        format!("{}月", age_months)
    } else if age_months == 0 {
        format!("{}岁", age_years)
    } else {
        format!("{}岁{}月", age_years, age_months)
    }
}

/// 获取文件创建时间戳
fn get_file_timestamp(path: &Path) -> Result<i64, String> {
    let metadata = fs::metadata(path).map_err(|e| e.to_string())?;
    let created = metadata
        .created()
        .or_else(|_| metadata.modified())
        .map_err(|e| e.to_string())?;
    
    let duration = created
        .duration_since(UNIX_EPOCH)
        .map_err(|e| e.to_string())?;
    
    Ok(duration.as_secs() as i64)
}

/// 扫描文件夹
#[tauri::command]
pub async fn scan_folder(
    folder_path: String,
    birth_date: Option<String>,
    db: State<'_, Database>,
    app_handle: tauri::AppHandle,
) -> Result<Vec<FileInfo>, String> {
    let path = PathBuf::from(&folder_path);
    if !path.exists() {
        return Err("文件夹不存在".to_string());
    }

    // 获取缩略图缓存目录
    let cache_dir = app_handle
        .path()
        .app_cache_dir()
        .map_err(|e| e.to_string())?
        .join("thumbnails");
    fs::create_dir_all(&cache_dir).map_err(|e| e.to_string())?;

    // 遍历文件夹
    let entries: Vec<_> = WalkDir::new(&path)
        .follow_links(true)
        .into_iter()
        .filter_map(|e| e.ok())
        .filter(|e| e.file_type().is_file())
        .collect();

    let files: Vec<FileInfo> = entries
        .par_iter()
        .filter_map(|entry| {
            let file_path = entry.path();
            let extension = file_path
                .extension()?
                .to_str()?
                .to_lowercase();

            let file_type = if IMAGE_EXTENSIONS.contains(&extension.as_str()) {
                "image"
            } else if VIDEO_EXTENSIONS.contains(&extension.as_str()) {
                "video"
            } else {
                return None;
            };

            let file_name = file_path.file_name()?.to_str()?.to_string();
            let created_at = get_file_timestamp(file_path).ok()?;
            let modified_at = created_at; // 简化处理

            let age_group = if let Some(ref bd) = birth_date {
                calculate_age_group(bd, created_at)
            } else {
                "未设置出生日期".to_string()
            };

            Some(FileInfo {
                id: None,
                file_path: file_path.to_str()?.to_string(),
                file_name,
                file_type: file_type.to_string(),
                created_at,
                modified_at,
                age_group,
                thumbnail_path: None,
                note: None,
            })
        })
        .collect();

    // 保存到数据库
    for file in &files {
        db.save_file(file).map_err(|e| e.to_string())?;
    }

    Ok(files)
}

/// 生成缩略图
#[tauri::command]
pub async fn generate_thumbnail(
    file_path: String,
    app_handle: tauri::AppHandle,
    db: State<'_, Database>,
) -> Result<String, String> {
    let source_path = PathBuf::from(&file_path);
    if !source_path.exists() {
        return Err("文件不存在".to_string());
    }

    // 缩略图缓存目录
    let cache_dir = app_handle
        .path()
        .app_cache_dir()
        .map_err(|e| e.to_string())?
        .join("thumbnails");
    fs::create_dir_all(&cache_dir).map_err(|e| e.to_string())?;

    // 生成缩略图文件名
    let hash = format!("{:x}", md5::compute(file_path.as_bytes()));
    let thumbnail_path = cache_dir.join(format!("{}.jpg", hash));

    // 如果缩略图已存在，直接返回
    if thumbnail_path.exists() {
        return Ok(thumbnail_path.to_str().unwrap().to_string());
    }

    // 生成缩略图
    let img = image::open(&source_path).map_err(|e| e.to_string())?;
    let thumbnail = img.resize(300, 300, FilterType::Lanczos3);
    thumbnail
        .save(&thumbnail_path)
        .map_err(|e| e.to_string())?;

    let thumbnail_str = thumbnail_path.to_str().unwrap().to_string();

    // 更新数据库
    let mut file = db
        .get_file(&file_path)
        .map_err(|e| e.to_string())?
        .ok_or("文件不在数据库中")?;
    file.thumbnail_path = Some(thumbnail_str.clone());
    db.save_file(&file).map_err(|e| e.to_string())?;

    Ok(thumbnail_str)
}

/// 获取文件信息
#[tauri::command]
pub async fn get_file_info(file_path: String, db: State<'_, Database>) -> Result<FileInfo, String> {
    db.get_file(&file_path)
        .map_err(|e| e.to_string())?
        .ok_or_else(|| "文件不存在".to_string())
}

/// 保存设置
#[tauri::command]
pub async fn save_settings(
    baby_birth_date: Option<String>,
    folder_path: Option<String>,
    db: State<'_, Database>,
) -> Result<(), String> {
    if let Some(date) = baby_birth_date {
        db.save_setting("baby_birth_date", &date)
            .map_err(|e| e.to_string())?;
    }
    if let Some(path) = folder_path {
        db.save_setting("folder_path", &path)
            .map_err(|e| e.to_string())?;
    }
    Ok(())
}

/// 获取设置
#[tauri::command]
pub async fn get_settings(db: State<'_, Database>) -> Result<Settings, String> {
    db.get_all_settings().map_err(|e| e.to_string())
}

/// 保存笔记
#[tauri::command]
pub async fn save_note(
    file_path: String,
    note: String,
    db: State<'_, Database>,
) -> Result<(), String> {
    db.save_note(&file_path, &note)
        .map_err(|e| e.to_string())
}

/// 获取笔记
#[tauri::command]
pub async fn get_note(file_path: String, db: State<'_, Database>) -> Result<Option<String>, String> {
    let file = db
        .get_file(&file_path)
        .map_err(|e| e.to_string())?
        .ok_or("文件不存在")?;
    Ok(file.note)
}

/// 获取所有文件
#[tauri::command]
pub async fn get_all_files(db: State<'_, Database>) -> Result<Vec<FileInfo>, String> {
    db.get_all_files().map_err(|e| e.to_string())
}

/// 更新文件年龄组
#[tauri::command]
pub async fn update_file_age_group(
    file_path: String,
    age_group: String,
    db: State<'_, Database>,
) -> Result<(), String> {
    db.update_file_age_group(&file_path, &age_group)
        .map_err(|e| e.to_string())
}
