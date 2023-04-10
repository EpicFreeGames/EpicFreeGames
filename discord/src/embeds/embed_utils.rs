use chrono::NaiveDateTime;

pub fn bold(text: String) -> String {
    return format!("**{}**", text);
}

pub fn relatime_timestamp(date: &NaiveDateTime) -> String {
    return format!("<t:{}:R>", date.timestamp());
}

pub const EMBED_SEPARATOR: &str = "   •   ";
