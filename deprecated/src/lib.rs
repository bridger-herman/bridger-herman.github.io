#[macro_use]
extern crate log;
#[macro_use]
extern crate sl_rs;

use sl_rs::c51::C51;
use sl_rs::common::smoke;
use sl_rs::term_buf;
use sl_rs::train::{Config, Train};
use wasm_bindgen::prelude::*;

#[wasm_bindgen(start)]
pub fn main() {
    wasm_logger::init_with_level(log::Level::Trace)
        .expect("Failed to initialize logger");
}

#[wasm_bindgen]
pub fn num_cols() -> i32 {
    term_buf::num_cols()
}

#[wasm_bindgen]
pub fn num_lines() -> i32 {
    term_buf::num_lines()
}

#[wasm_bindgen]
pub fn display_one_sl(x: i32) -> String {
    let conf = Config {
        accident: false,
        fly: false,
        smoke: false,
        smoke_state: smoke::SmokeState::new(),
    };

    let mut logo = C51::new(conf);
    logo.update(x);

    scr_buf!()
        .iter()
        .map(|l| l.join(""))
        .collect::<Vec<String>>()
        .join("\n")
}
