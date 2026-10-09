fn main() {
    #[cfg(feature = "desktop")]
    tauri_build::build();
    if std::env::var("CARGO_CFG_TARGET_OS").as_deref() == Ok("macos")
        && std::env::var_os("CARGO_FEATURE_DESKTOP").is_some()
    {
        let prefix = std::env::var("ATELIER_MPV_PREFIX").unwrap_or_else(|_| {
            if std::env::var("CARGO_CFG_TARGET_ARCH").as_deref() == Ok("x86_64") {
                "/usr/local".into()
            } else {
                "/opt/homebrew".into()
            }
        });
        cc::Build::new()
            .file("native/mpv_view.m")
            .include(format!("{prefix}/include"))
            .flag("-fobjc-arc")
            .flag("-Wno-deprecated-declarations")
            .compile("atelier_mpv_view");
        println!("cargo:rustc-link-search=native={prefix}/lib");
        println!("cargo:rustc-link-lib=mpv");
        println!("cargo:rustc-link-lib=framework=AppKit");
        println!("cargo:rustc-link-lib=framework=CoreGraphics");
        println!("cargo:rerun-if-changed=native/mpv_view.m");
        println!("cargo:rerun-if-env-changed=ATELIER_MPV_PREFIX");
    }
}
