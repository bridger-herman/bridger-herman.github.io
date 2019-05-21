#[macro_use]
extern crate log;

use wasm_bindgen::prelude::*;

#[wasm_bindgen(start)]
pub fn main() {
    wasm_logger::init_with_level(log::Level::Trace)
        .expect("Failed to initialize logger");

    info!("Hello, world!");
}
