use serde_json::{json, Value};
#[cfg(target_os = "macos")]
use std::ffi::{c_char, c_void, CStr, CString};
use std::path::PathBuf;
use tauri::{AppHandle, Manager, WebviewWindow};
#[cfg(target_os = "macos")]
extern "C" {
    fn atelier_mpv_open(
        window: *mut c_void,
        path: *const c_char,
        x: f64,
        y: f64,
        w: f64,
        h: f64,
    ) -> i32;
    fn atelier_mpv_rect(x: f64, y: f64, w: f64, h: f64) -> i32;
    fn atelier_mpv_control(command: *const c_char, value: f64) -> i32;
    fn atelier_mpv_close();
    fn atelier_mpv_status() -> *mut c_char;
    fn atelier_mpv_free(ptr: *mut c_char);
}
fn media_dir(app: &AppHandle) -> Result<PathBuf, String> {
    let dir = app
        .path()
        .app_data_dir()
        .map_err(|e| e.to_string())?
        .join("video-media");
    std::fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    Ok(dir)
}
fn media_path(app: &AppHandle, id: &str) -> Result<PathBuf, String> {
    if !super::safe_id(id) {
        return Err("Invalid media identifier".into());
    }
    Ok(media_dir(app)?.join(id))
}
#[tauri::command]
pub async fn import_dropped_files(app: AppHandle, paths: Vec<String>) -> Result<Value, String> {
    let directory = media_dir(&app)?;
    tauri::async_runtime::spawn_blocking(move || super::imports::import_paths(&paths, &directory))
        .await
        .map_err(|e| e.to_string())?
}
#[tauri::command]
pub async fn save_managed_attachment(
    app: AppHandle,
    id: String,
    name: String,
) -> Result<bool, String> {
    let source = media_path(&app, &id)?;
    if !source.is_file() {
        return Err("The original file is missing. Re-import it on this Mac.".into());
    }
    let name = std::path::Path::new(&name)
        .file_name()
        .and_then(|n| n.to_str())
        .unwrap_or("attachment");
    let Some(destination) = rfd::AsyncFileDialog::new()
        .set_file_name(name)
        .save_file()
        .await
    else {
        return Ok(false);
    };
    let destination = destination.path().to_path_buf();
    tauri::async_runtime::spawn_blocking(move || {
        std::fs::copy(source, destination)
            .map(|_| true)
            .map_err(|e| e.to_string())
    })
    .await
    .map_err(|e| e.to_string())?
}
#[tauri::command]
pub async fn import_video(app: AppHandle) -> Result<Option<Value>, String> {
    let Some(file) = rfd::AsyncFileDialog::new()
        .add_filter("Video", &["mov", "mp4", "m4v", "avi", "mkv", "webm", "mxf"])
        .pick_file()
        .await
    else {
        return Ok(None);
    };
    let name = file.file_name();
    let id = format!(
        "video-{}",
        std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .map_err(|e| e.to_string())?
            .as_nanos()
    );
    let destination = media_path(&app, &id)?;
    std::fs::copy(file.path(), &destination).map_err(|e| e.to_string())?;
    Ok(Some(
        json!({"id":id,"filename":name,"size":std::fs::metadata(destination).map_err(|e|e.to_string())?.len()}),
    ))
}
#[tauri::command]
pub async fn video_open(
    app: AppHandle,
    window: WebviewWindow,
    id: Option<String>,
    media: Option<String>,
    rect: [f64; 4],
) -> Result<(), String> {
    let path = if let Some(id) = id {
        media_path(&app, &id)?
    } else {
        use base64::Engine;
        let media = media.ok_or("Missing video")?;
        if media.len() > 70 * 1024 * 1024 {
            return Err("Embedded video exceeds 50 MB".into());
        }
        let (prefix, data) = media.split_once(";base64,").ok_or("Invalid video")?;
        if !prefix.starts_with("data:video/") {
            return Err("Not video data".into());
        }
        let bytes = base64::engine::general_purpose::STANDARD
            .decode(data)
            .map_err(|e| e.to_string())?;
        let path = media_dir(&app)?.join("embedded-preview");
        std::fs::write(&path, bytes).map_err(|e| e.to_string())?;
        path
    };
    if !path.is_file() {
        return Err("The managed video file is missing. Re-import the original video.".into());
    }
    open_native(app, window, path, rect).await
}
fn valid_rect(rect: [f64; 4]) -> Result<(), String> {
    if rect.iter().any(|n| !n.is_finite() || n.abs() > 100000.) || rect[2] < 1. || rect[3] < 1. {
        return Err("Invalid video viewport".into());
    }
    Ok(())
}
#[cfg(target_os = "macos")]
async fn main_thread<T: Send + 'static>(
    app: AppHandle,
    func: impl FnOnce() -> Result<T, String> + Send + 'static,
) -> Result<T, String> {
    let (tx, rx) = std::sync::mpsc::channel();
    app.run_on_main_thread(move || {
        let _ = tx.send(func());
    })
    .map_err(|e| e.to_string())?;
    rx.recv().map_err(|e| e.to_string())?
}
#[cfg(target_os = "macos")]
async fn open_native(
    app: AppHandle,
    window: WebviewWindow,
    path: PathBuf,
    rect: [f64; 4],
) -> Result<(), String> {
    valid_rect(rect)?;
    let path = CString::new(path.to_string_lossy().as_bytes()).map_err(|e| e.to_string())?;
    main_thread(app, move || {
        let ptr = window.ns_window().map_err(|e| e.to_string())?;
        let code =
            unsafe { atelier_mpv_open(ptr, path.as_ptr(), rect[0], rect[1], rect[2], rect[3]) };
        if code < 0 {
            Err(format!("libmpv initialization failed ({code})"))
        } else {
            Ok(())
        }
    })
    .await
}
#[cfg(not(target_os = "macos"))]
async fn open_native(
    _: AppHandle,
    _: WebviewWindow,
    _: PathBuf,
    _: [f64; 4],
) -> Result<(), String> {
    Err("The native libmpv viewer is available in the macOS edition".into())
}
#[tauri::command]
pub async fn video_rect(app: AppHandle, rect: [f64; 4]) -> Result<(), String> {
    valid_rect(rect)?;
    #[cfg(target_os = "macos")]
    return main_thread(app, move || {
        unsafe {
            atelier_mpv_rect(rect[0], rect[1], rect[2], rect[3]);
        }
        Ok(())
    })
    .await;
    #[cfg(not(target_os = "macos"))]
    {
        let _ = app;
        Ok(())
    }
}
#[tauri::command]
pub async fn video_control(app: AppHandle, command: String, value: f64) -> Result<(), String> {
    if !value.is_finite()
        || !match command.as_str() {
            "pause" => value == 0. || value == 1.,
            "seek" => value >= 0. && value <= 864000.,
            "frame" => value == -1. || value == 1.,
            "volume" => (0.0..=100.0).contains(&value),
            "speed" => (0.25..=4.0).contains(&value),
            _ => false,
        }
    {
        return Err("Invalid playback control".into());
    }
    #[cfg(target_os = "macos")]
    return main_thread(app, move || {
        let cmd = CString::new(command).unwrap();
        let code = unsafe { atelier_mpv_control(cmd.as_ptr(), value) };
        if code < 0 {
            Err(format!("Playback control failed ({code})"))
        } else {
            Ok(())
        }
    })
    .await;
    #[cfg(not(target_os = "macos"))]
    {
        let _ = app;
        Err("Native player requires macOS".into())
    }
}
#[tauri::command]
pub async fn video_status(app: AppHandle) -> Result<Value, String> {
    #[cfg(target_os = "macos")]
    return main_thread(app, move || unsafe {
        let ptr = atelier_mpv_status();
        if ptr.is_null() {
            return Err("No playback status".into());
        }
        let data = serde_json::from_str(CStr::from_ptr(ptr).to_str().map_err(|e| e.to_string())?)
            .map_err(|e| e.to_string());
        atelier_mpv_free(ptr);
        data
    })
    .await;
    #[cfg(not(target_os = "macos"))]
    {
        let _ = app;
        Ok(json!({}))
    }
}
#[tauri::command]
pub async fn video_close(app: AppHandle) -> Result<(), String> {
    #[cfg(target_os = "macos")]
    return main_thread(app, move || {
        unsafe {
            atelier_mpv_close();
        }
        Ok(())
    })
    .await;
    #[cfg(not(target_os = "macos"))]
    {
        let _ = app;
        Ok(())
    }
}
#[cfg(target_os = "macos")]
pub fn smoke(app: &AppHandle) {
    if let Ok(path) = std::env::var("ATELIER_MPV_SMOKE_FILE") {
        if let Some(window) = app.get_webview_window("main") {
            let app = app.clone();
            tauri::async_runtime::spawn(async move {
                if let Err(e) =
                    open_native(app, window, PathBuf::from(path), [80., 100., 640., 360.]).await
                {
                    eprintln!("MPV smoke failed: {e}");
                }
            });
        }
    }
}
