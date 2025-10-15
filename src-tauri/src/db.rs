use rusqlite::{Connection, Result};
use serde::{Deserialize, Serialize};
use std::sync::Mutex;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FileInfo {
    pub id: Option<i64>,
    pub file_path: String,
    pub file_name: String,
    pub file_type: String, // "image" or "video"
    pub created_at: i64,   // timestamp
    pub modified_at: i64,
    pub age_group: String, // e.g., "0岁3月"
    pub thumbnail_path: Option<String>,
    pub note: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Settings {
    pub baby_birth_date: Option<String>, // ISO 8601 date format
    pub folder_path: Option<String>,
}

pub struct Database {
    conn: Mutex<Connection>,
}

impl Database {
    pub fn new(path: &str) -> Result<Self> {
        let conn = Connection::open(path)?;
        
        // 创建表
        conn.execute(
            "CREATE TABLE IF NOT EXISTS files (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                file_path TEXT UNIQUE NOT NULL,
                file_name TEXT NOT NULL,
                file_type TEXT NOT NULL,
                created_at INTEGER NOT NULL,
                modified_at INTEGER NOT NULL,
                age_group TEXT NOT NULL,
                thumbnail_path TEXT,
                note TEXT
            )",
            [],
        )?;

        conn.execute(
            "CREATE TABLE IF NOT EXISTS settings (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL
            )",
            [],
        )?;

        Ok(Database {
            conn: Mutex::new(conn),
        })
    }

    pub fn save_file(&self, file: &FileInfo) -> Result<i64> {
        let conn = self.conn.lock().unwrap();
        conn.execute(
            "INSERT OR REPLACE INTO files (file_path, file_name, file_type, created_at, modified_at, age_group, thumbnail_path, note)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)",
            (
                &file.file_path,
                &file.file_name,
                &file.file_type,
                file.created_at,
                file.modified_at,
                &file.age_group,
                &file.thumbnail_path,
                &file.note,
            ),
        )?;
        Ok(conn.last_insert_rowid())
    }

    pub fn get_file(&self, file_path: &str) -> Result<Option<FileInfo>> {
        let conn = self.conn.lock().unwrap();
        let mut stmt = conn.prepare(
            "SELECT id, file_path, file_name, file_type, created_at, modified_at, age_group, thumbnail_path, note
             FROM files WHERE file_path = ?1"
        )?;

        let file = stmt.query_row([file_path], |row| {
            Ok(FileInfo {
                id: Some(row.get(0)?),
                file_path: row.get(1)?,
                file_name: row.get(2)?,
                file_type: row.get(3)?,
                created_at: row.get(4)?,
                modified_at: row.get(5)?,
                age_group: row.get(6)?,
                thumbnail_path: row.get(7)?,
                note: row.get(8)?,
            })
        }).optional()?;

        Ok(file)
    }

    pub fn get_all_files(&self) -> Result<Vec<FileInfo>> {
        let conn = self.conn.lock().unwrap();
        let mut stmt = conn.prepare(
            "SELECT id, file_path, file_name, file_type, created_at, modified_at, age_group, thumbnail_path, note
             FROM files ORDER BY created_at DESC"
        )?;

        let files = stmt.query_map([], |row| {
            Ok(FileInfo {
                id: Some(row.get(0)?),
                file_path: row.get(1)?,
                file_name: row.get(2)?,
                file_type: row.get(3)?,
                created_at: row.get(4)?,
                modified_at: row.get(5)?,
                age_group: row.get(6)?,
                thumbnail_path: row.get(7)?,
                note: row.get(8)?,
            })
        })?.collect::<Result<Vec<_>>>()?;

        Ok(files)
    }

    pub fn update_file_age_group(&self, file_path: &str, age_group: &str) -> Result<()> {
        let conn = self.conn.lock().unwrap();
        conn.execute(
            "UPDATE files SET age_group = ?1 WHERE file_path = ?2",
            (age_group, file_path),
        )?;
        Ok(())
    }

    pub fn save_note(&self, file_path: &str, note: &str) -> Result<()> {
        let conn = self.conn.lock().unwrap();
        conn.execute(
            "UPDATE files SET note = ?1 WHERE file_path = ?2",
            (note, file_path),
        )?;
        Ok(())
    }

    pub fn save_setting(&self, key: &str, value: &str) -> Result<()> {
        let conn = self.conn.lock().unwrap();
        conn.execute(
            "INSERT OR REPLACE INTO settings (key, value) VALUES (?1, ?2)",
            (key, value),
        )?;
        Ok(())
    }

    pub fn get_setting(&self, key: &str) -> Result<Option<String>> {
        let conn = self.conn.lock().unwrap();
        let mut stmt = conn.prepare("SELECT value FROM settings WHERE key = ?1")?;
        let value = stmt.query_row([key], |row| row.get(0)).optional()?;
        Ok(value)
    }

    pub fn get_all_settings(&self) -> Result<Settings> {
        Ok(Settings {
            baby_birth_date: self.get_setting("baby_birth_date")?,
            folder_path: self.get_setting("folder_path")?,
        })
    }
}
