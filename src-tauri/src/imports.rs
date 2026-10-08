//! Bounded previews plus unmodified managed originals for native Finder imports.
use base64::Engine;
use serde_json::{json, Value};
use std::path::Path;

pub fn import_paths(paths: &[String], directory: &Path) -> Result<Value, String> {
    if paths.is_empty() || paths.len() > 100 {
        return Err("Drop between 1 and 100 files at a time.".into());
    }
    std::fs::create_dir_all(directory).map_err(|e| e.to_string())?;
    let mut files = Vec::new();
    let mut errors = Vec::new();
    let mut preview_bytes = 0u64;
    for path in paths {
        let original = Path::new(path);
        let name = original
            .file_name()
            .and_then(|n| n.to_str())
            .unwrap_or("attachment");
        let result = (|| -> Result<Value, String> {
            if !original.is_absolute() || !original.is_file() {
                return Err("Drop regular files; folders are not imported.".into());
            }
            let extension = original
                .extension()
                .and_then(|n| n.to_str())
                .unwrap_or("")
                .to_ascii_lowercase();
            let (kind, mime, limit) = match extension.as_str() {
                "mov" | "mp4" | "m4v" | "avi" | "mkv" | "webm" | "mxf" => {
                    ("video", "application/octet-stream", 0)
                }
                "png" => ("image", "image/png", 15),
                "jpg" | "jpeg" => ("image", "image/jpeg", 15),
                "gif" => ("image", "image/gif", 15),
                "webp" => ("image", "image/webp", 15),
                "fbx" | "obj" | "usd" | "usda" | "usdt" | "usdc" | "usdz" | "gltf" | "glb"
                | "stl" | "ply" => ("model", "application/octet-stream", 50),
                "pdf" => ("file", "application/pdf", 15),
                "txt" | "md" => ("file", "text/plain", 15),
                _ => ("file", "application/octet-stream", 15),
            };
            let id = format!(
                "asset-{}-{}",
                std::time::SystemTime::now()
                    .duration_since(std::time::UNIX_EPOCH)
                    .map_err(|e| e.to_string())?
                    .as_nanos(),
                files.len()
            );
            let destination = directory.join(&id);
            // Copy first, then preview that stable copy so later source edits cannot change it.
            let size = std::fs::copy(original, &destination).map_err(|e| e.to_string())?;
            let data = if size <= limit * 1024 * 1024 && preview_bytes + size <= 60 * 1024 * 1024 {
                let bytes = std::fs::read(&destination).map_err(|e| e.to_string())?;
                preview_bytes += size;
                Some(format!(
                    "data:{mime};base64,{}",
                    base64::engine::general_purpose::STANDARD.encode(bytes)
                ))
            } else {
                None
            };
            Ok(json!({"id":id,"filename":name,"size":size,"kind":kind,"data":data}))
        })();
        match result {
            Ok(file) => files.push(file),
            Err(error) => errors.push(format!("{name}: {error}")),
        }
    }
    Ok(json!({"files":files,"errors":errors}))
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn preserves_originals_and_limits_previews_without_rejecting_large_media() {
        let temp = tempfile::tempdir().unwrap();
        let managed = temp.path().join("managed");
        let image = temp.path().join("reference.png");
        std::fs::write(&image, b"source-bytes").unwrap();
        let video = temp.path().join("large.mov");
        std::fs::File::create(&video)
            .unwrap()
            .set_len(16 * 1024 * 1024)
            .unwrap();
        let result = import_paths(
            &[
                image.to_string_lossy().into(),
                video.to_string_lossy().into(),
                temp.path().to_string_lossy().into(),
            ],
            &managed,
        )
        .unwrap();
        assert_eq!(result["files"].as_array().unwrap().len(), 2);
        assert_eq!(result["errors"].as_array().unwrap().len(), 1);
        assert_eq!(result["files"][0]["kind"], "image");
        assert!(result["files"][0]["data"]
            .as_str()
            .unwrap()
            .starts_with("data:image/png;base64,"));
        let id = result["files"][0]["id"].as_str().unwrap();
        std::fs::write(image, b"changed-source").unwrap();
        assert_eq!(std::fs::read(managed.join(id)).unwrap(), b"source-bytes");
        assert_eq!(result["files"][1]["kind"], "video");
        assert!(result["files"][1]["data"].is_null());
        assert_eq!(
            std::fs::metadata(managed.join(result["files"][1]["id"].as_str().unwrap()))
                .unwrap()
                .len(),
            16 * 1024 * 1024
        );
    }
    #[test]
    fn rejects_oversized_batches_and_relative_paths() {
        let temp = tempfile::tempdir().unwrap();
        assert!(import_paths(&vec!["x".into(); 101], temp.path()).is_err());
        let result = import_paths(&["../private".into()], temp.path()).unwrap();
        assert_eq!(result["files"].as_array().unwrap().len(), 0);
    }
}
