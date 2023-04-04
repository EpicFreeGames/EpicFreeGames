pub enum EmbedColor {
    Green = 0x008000,
    Red = 0xce3e3e,
    Blue = 0x3f3fff,
    White = 0xffffff,
    Gray = 0x302c34,
}

pub fn embed_color(color: EmbedColor) -> u32 {
    return color as u32;
}
