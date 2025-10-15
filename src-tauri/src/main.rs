// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod db;
mod commands;

use db::Database;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .setup(|app| {
            // 初始化数据库
            let app_dir = app.path().app_data_dir().expect("Failed to get app data dir");
            std::fs::create_dir_all(&app_dir).expect("Failed to create app data directory");
            
            let db_path = app_dir.join("baby_growth.db");
            let db = Database::new(db_path.to_str().unwrap())?;
            app.manage(db);
            
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::scan_folder,
            commands::generate_thumbnail,
            commands::get_file_info,
            commands::save_settings,
            commands::get_settings,
            commands::save_note,
            commands::get_note,
            commands::get_all_files,
            commands::update_file_age_group,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
