use rusqlite::{params, Connection};
use serde::{Deserialize, Serialize};
use std::collections::HashSet;
use std::path::Path;

pub const MAX_BYTES: usize = 100 * 1024 * 1024;

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Workspace {
    pub version: u32,
    pub active: String,
    pub boards: Vec<Board>,
}
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Board {
    pub id: String,
    pub name: String,
    pub parent: Option<String>,
    pub description: String,
    pub color: String,
    pub cards: Vec<serde_json::Value>,
    pub edges: Vec<Edge>,
    pub view: serde_json::Value,
    pub updated: f64,
}
#[derive(Debug, Serialize, Deserialize)]
pub struct Edge {
    pub id: String,
    pub from: String,
    pub to: String,
    pub label: String,
}

fn safe_id(id: &str) -> bool {
    !id.is_empty()
        && id.len() <= 100
        && id
            .bytes()
            .all(|b| b.is_ascii_alphanumeric() || b == b'-' || b == b'_')
}

pub fn validate(raw: &str) -> Result<Workspace, String> {
    if raw.len() > MAX_BYTES {
        return Err("Workspace exceeds the 100 MB limit. Export media separately.".into());
    }
    let workspace: Workspace =
        serde_json::from_str(raw).map_err(|e| format!("Invalid workspace: {e}"))?;
    if workspace.version != 1 || workspace.boards.is_empty() || workspace.boards.len() > 1000 {
        return Err("Unsupported version or invalid board count".into());
    }
    let ids: HashSet<_> = workspace.boards.iter().map(|b| b.id.as_str()).collect();
    if ids.len() != workspace.boards.len() || !ids.contains(workspace.active.as_str()) {
        return Err("Duplicate board IDs or missing active board".into());
    }
    let mut all_cards = HashSet::new();
    for board in &workspace.boards {
        if !safe_id(&board.id)
            || !board.updated.is_finite()
            || !["x", "y", "zoom"]
                .iter()
                .all(|k| board.view[k].as_f64().is_some_and(f64::is_finite))
            || !(0.2..=2.0).contains(&board.view["zoom"].as_f64().unwrap_or(0.0))
        {
            return Err("Invalid board metadata".into());
        }
        if board.name.len() > 1000 {
            return Err("Board title is too long".into());
        }
        if let Some(parent) = &board.parent {
            if !ids.contains(parent.as_str()) {
                return Err("Missing parent board".into());
            }
        }
        let mut ancestors = HashSet::new();
        let mut current = Some(board.id.as_str());
        while let Some(id) = current {
            if !ancestors.insert(id) {
                return Err("Board hierarchy contains a cycle".into());
            }
            current = workspace
                .boards
                .iter()
                .find(|b| b.id == id)
                .and_then(|b| b.parent.as_deref());
        }
        let mut cards = HashSet::new();
        for card in &board.cards {
            let id = card["id"].as_str().ok_or("Card has no ID")?;
            if !safe_id(id) || !cards.insert(id) || !all_cards.insert(id) {
                return Err("Duplicate card ID".into());
            }
            for key in ["title", "body", "color", "url", "media", "filename"] {
                if !card[key].is_string() {
                    return Err(format!("Invalid card field: {key}"));
                }
            }
            if !card["tags"]
                .as_array()
                .is_some_and(|a| a.iter().all(|v| v.is_string()))
                || !card["items"].as_array().is_some_and(|a| {
                    a.iter().all(|v| {
                        v["id"].as_str().is_some_and(safe_id)
                            && v["text"].is_string()
                            && v["done"].is_boolean()
                    })
                })
                || !card["comments"].as_array().is_some_and(|a| {
                    a.iter().all(|v| {
                        v["text"].is_string()
                            && v["author"].is_string()
                            && v["date"].as_f64().is_some_and(f64::is_finite)
                    })
                })
            {
                return Err("Invalid card tags, tasks, or annotations".into());
            }
            let media = card["media"].as_str().unwrap_or("");
            if !media.is_empty() {
                let (prefix, bytes) = media
                    .split_once(";base64,")
                    .ok_or("Invalid media encoding")?;
                if ![
                    "data:image/png",
                    "data:image/jpeg",
                    "data:image/webp",
                    "data:image/gif",
                    "data:video/mp4",
                    "data:video/webm",
                    "data:video/ogg",
                    "data:application/octet-stream",
                    "data:application/pdf",
                    "data:text/plain",
                ]
                .contains(&prefix)
                    || !bytes
                        .bytes()
                        .all(|b| b.is_ascii_alphanumeric() || b == b'+' || b == b'/' || b == b'=')
                {
                    return Err("Unsupported embedded media".into());
                }
            }
            if let Some(assets) = card.get("assets") {
                let assets = assets.as_array().ok_or("Invalid model resources")?;
                if assets.len() > 100 {
                    return Err("Too many model resources".into());
                }
                for asset in assets {
                    let name = asset["name"].as_str().ok_or("Invalid resource name")?;
                    let data = asset["data"].as_str().ok_or("Invalid resource data")?;
                    let (prefix, encoded) = data
                        .split_once(";base64,")
                        .ok_or("Invalid resource encoding")?;
                    if name.len() > 1024
                        || ![
                            "data:application/octet-stream",
                            "data:text/plain",
                            "data:image/png",
                            "data:image/jpeg",
                            "data:image/webp",
                            "data:image/gif",
                        ]
                        .contains(&prefix)
                        || !encoded.bytes().all(|b| {
                            b.is_ascii_alphanumeric() || b == b'+' || b == b'/' || b == b'='
                        })
                    {
                        return Err("Invalid model resource".into());
                    }
                }
            }
            if let Some(view) = card.get("modelView") {
                for (key, value) in view.as_object().ok_or("Invalid model view")? {
                    if !["position", "rotation", "scale", "camera", "target"]
                        .contains(&key.as_str())
                        || !value.as_array().is_some_and(|v| {
                            v.len() == 3
                                && v.iter().all(|n| {
                                    n.as_f64()
                                        .is_some_and(|n| n.is_finite() && n.abs() <= 100_000_000.0)
                                })
                        })
                    {
                        return Err("Invalid model view".into());
                    }
                }
            }
            if let Some(preview) = card.get("preview") {
                let preview = preview.as_str().ok_or("Invalid model preview")?;
                if !preview.starts_with("data:image/png;base64,")
                    || !preview[22..]
                        .bytes()
                        .all(|b| b.is_ascii_alphanumeric() || b == b'+' || b == b'/' || b == b'=')
                {
                    return Err("Invalid model preview".into());
                }
            }
            let kind = card["type"].as_str().ok_or("Card has no type")?;
            if ![
                "note", "task", "image", "video", "file", "link", "heading", "column", "board",
                "sketch", "model",
            ]
            .contains(&kind)
            {
                return Err("Unknown card type".into());
            }
            for field in ["x", "y", "w", "h"] {
                let n = card[field].as_f64().ok_or("Invalid card geometry")?;
                if !n.is_finite()
                    || n.abs() > 100_000.0
                    || ((field == "w" || field == "h") && n < 20.0)
                {
                    return Err("Card geometry is out of range".into());
                }
            }
            if kind == "board" && !ids.contains(card["boardId"].as_str().unwrap_or("")) {
                return Err("Board card points to a missing board".into());
            }
        }
        let mut edges = HashSet::new();
        for edge in &board.edges {
            if !safe_id(&edge.id)
                || !cards.contains(edge.from.as_str())
                || !cards.contains(edge.to.as_str())
                || edge.from == edge.to
                || !edges.insert(&edge.id)
            {
                return Err("Invalid connection".into());
            }
        }
    }
    Ok(workspace)
}

pub struct Store {
    connection: Connection,
}
impl Store {
    pub fn open(path: &Path) -> Result<Self, String> {
        let connection = Connection::open(path).map_err(|e| e.to_string())?;
        connection.execute_batch("PRAGMA journal_mode=WAL; PRAGMA synchronous=FULL; CREATE TABLE IF NOT EXISTS workspace (id INTEGER PRIMARY KEY CHECK(id=1), data TEXT NOT NULL); CREATE TABLE IF NOT EXISTS revisions (id INTEGER PRIMARY KEY AUTOINCREMENT, created TEXT DEFAULT CURRENT_TIMESTAMP, data TEXT NOT NULL);").map_err(|e| e.to_string())?;
        Ok(Self { connection })
    }
    pub fn load(&self) -> Result<Option<String>, String> {
        use rusqlite::OptionalExtension;
        self.connection
            .query_row("SELECT data FROM workspace WHERE id=1", [], |r| r.get(0))
            .optional()
            .map_err(|e| e.to_string())
    }
    pub fn save(&mut self, data: &str) -> Result<(), String> {
        validate(data)?;
        let tx = self.connection.transaction().map_err(|e| e.to_string())?;
        // Keep recovery snapshots at most once every five minutes, not every keystroke.
        tx.execute("INSERT INTO revisions(data) SELECT data FROM workspace WHERE id=1 AND NOT EXISTS (SELECT 1 FROM revisions WHERE created > datetime('now','-5 minutes'))", []).map_err(|e| e.to_string())?;
        tx.execute("INSERT INTO workspace(id,data) VALUES(1,?1) ON CONFLICT(id) DO UPDATE SET data=excluded.data", params![data]).map_err(|e| e.to_string())?;
        tx.execute("DELETE FROM revisions WHERE id NOT IN (SELECT id FROM revisions ORDER BY id DESC LIMIT 10)", []).map_err(|e| e.to_string())?;
        tx.commit().map_err(|e| e.to_string())
    }
    pub fn revisions(&self) -> Result<Vec<serde_json::Value>, String> {
        let mut stmt = self
            .connection
            .prepare("SELECT id,created FROM revisions ORDER BY id DESC")
            .map_err(|e| e.to_string())?;
        let rows = stmt
            .query_map([], |r| {
                Ok(serde_json::json!({"id":r.get::<_,i64>(0)?,"created":r.get::<_,String>(1)?}))
            })
            .map_err(|e| e.to_string())?;
        rows.collect::<Result<Vec<_>, _>>()
            .map_err(|e| e.to_string())
    }
    pub fn revision(&self, id: i64) -> Result<String, String> {
        self.connection
            .query_row("SELECT data FROM revisions WHERE id=?1", [id], |r| r.get(0))
            .map_err(|e| e.to_string())
    }
}

#[cfg(feature = "desktop")]
mod desktop {
    use super::*;
    use std::sync::Mutex;
    use tauri::Manager;
    struct State(Mutex<Store>);
    #[tauri::command]
    fn load_workspace(state: tauri::State<State>) -> Result<Option<String>, String> {
        state.0.lock().map_err(|e| e.to_string())?.load()
    }
    #[tauri::command]
    fn save_workspace(data: String, state: tauri::State<State>) -> Result<(), String> {
        state.0.lock().map_err(|e| e.to_string())?.save(&data)
    }
    #[tauri::command]
    fn list_revisions(state: tauri::State<State>) -> Result<Vec<serde_json::Value>, String> {
        state.0.lock().map_err(|e| e.to_string())?.revisions()
    }
    #[tauri::command]
    fn restore_revision(id: i64, state: tauri::State<State>) -> Result<String, String> {
        state.0.lock().map_err(|e| e.to_string())?.revision(id)
    }
    #[tauri::command]
    async fn export_file(name: String, content: String) -> Result<bool, String> {
        if content.len() > MAX_BYTES {
            return Err("Export exceeds 100 MB".into());
        }
        let name = Path::new(&name)
            .file_name()
            .and_then(|n| n.to_str())
            .unwrap_or("atelier-export.json");
        let file = rfd::AsyncFileDialog::new()
            .set_file_name(name)
            .save_file()
            .await;
        if let Some(file) = file {
            file.write(content.as_bytes())
                .await
                .map_err(|e| e.to_string())?;
            return Ok(true);
        }
        Ok(false)
    }
    #[tauri::command]
    async fn save_attachment(name: String, data: String) -> Result<bool, String> {
        use base64::Engine;
        if data.len() > 70 * 1024 * 1024 {
            return Err("Attachment exceeds the export limit".into());
        }
        let (_, encoded) = data.split_once(";base64,").ok_or("Invalid attachment")?;
        let bytes = base64::engine::general_purpose::STANDARD
            .decode(encoded)
            .map_err(|e| e.to_string())?;
        let name = Path::new(&name)
            .file_name()
            .and_then(|n| n.to_str())
            .unwrap_or("attachment");
        if let Some(file) = rfd::AsyncFileDialog::new()
            .set_file_name(name)
            .save_file()
            .await
        {
            file.write(&bytes).await.map_err(|e| e.to_string())?;
            return Ok(true);
        }
        Ok(false)
    }
    #[tauri::command]
    fn open_link(address: String) -> Result<(), String> {
        let parsed = url::Url::parse(&address).map_err(|e| e.to_string())?;
        if !["https", "http"].contains(&parsed.scheme()) {
            return Err("Only http and https links can be opened".into());
        }
        open::that(parsed.as_str()).map_err(|e| e.to_string())
    }
    pub fn run() {
        tauri::Builder::default()
            .plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| {
                if let Some(window) = app.get_webview_window("main") {
                    let _ = window.set_focus();
                }
            }))
            .setup(|app| {
                let dir = app.path().app_data_dir()?;
                std::fs::create_dir_all(&dir)?;
                let store =
                    Store::open(&dir.join("atelier.sqlite3")).map_err(std::io::Error::other)?;
                app.manage(State(Mutex::new(store)));
                Ok(())
            })
            .invoke_handler(tauri::generate_handler![
                load_workspace,
                save_workspace,
                list_revisions,
                restore_revision,
                export_file,
                open_link,
                save_attachment
            ])
            .run(tauri::generate_context!())
            .expect("Atelier failed to start");
    }
}
#[cfg(feature = "desktop")]
pub use desktop::run;

#[cfg(test)]
mod tests {
    use super::*;
    fn sample() -> String {
        serde_json::json!({"version":1,"active":"a","boards":[{"id":"a","name":"Test","parent":null,"description":"","color":"sage","cards":[],"edges":[],"view":{"x":0,"y":0,"zoom":1},"updated":0}]}).to_string()
    }
    #[test]
    fn frontend_fixture_matches_backend_contract() {
        let fixture = include_str!("../../tests/fixtures/starter.json");
        validate(fixture).unwrap();
        let mut store = Store::open(Path::new(":memory:")).unwrap();
        store.save(fixture).unwrap();
        assert_eq!(store.load().unwrap().unwrap(), fixture);
    }
    #[test]
    fn save_survives_reopen() {
        let dir = tempfile::tempdir().unwrap();
        let path = dir.path().join("test.db");
        {
            let mut s = Store::open(&path).unwrap();
            s.save(&sample()).unwrap();
        }
        assert_eq!(Store::open(&path).unwrap().load().unwrap(), Some(sample()));
    }
    #[test]
    fn invalid_save_preserves_previous_data() {
        let mut s = Store::open(Path::new(":memory:")).unwrap();
        s.save(&sample()).unwrap();
        assert!(s.save("{}").is_err());
        assert_eq!(s.load().unwrap(), Some(sample()));
    }
    #[test]
    fn snapshots_restore_previous_state() {
        let mut s = Store::open(Path::new(":memory:")).unwrap();
        s.save(&sample()).unwrap();
        let next = sample().replace("Test", "Revised");
        s.save(&next).unwrap();
        let r = s.revisions().unwrap();
        assert_eq!(r.len(), 1);
        assert_eq!(s.revision(r[0]["id"].as_i64().unwrap()).unwrap(), sample());
    }
    #[test]
    fn rejects_cycles_and_unknown_versions() {
        let mut w: serde_json::Value = serde_json::from_str(&sample()).unwrap();
        w["boards"][0]["parent"] = "a".into();
        assert!(validate(&w.to_string()).is_err());
        w["boards"][0]["parent"] = serde_json::Value::Null;
        w["version"] = 2.into();
        assert!(validate(&w.to_string()).is_err());
    }
    #[test]
    fn rejects_dangling_edges() {
        let mut w: serde_json::Value = serde_json::from_str(&sample()).unwrap();
        w["boards"][0]["edges"] =
            serde_json::json!([{"id":"e","from":"missing","to":"other","label":""}]);
        assert!(validate(&w.to_string()).is_err());
    }
}
