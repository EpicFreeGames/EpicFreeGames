use chrono::NaiveDateTime;

pub fn bold(text: &str) -> String {
    return format!("**{}**", text);
}

pub fn relatime_timestamp(date: &NaiveDateTime) -> String {
    return format!("<t:{}:R>", date.timestamp());
}

pub fn link(text: &str, url: &str) -> String {
    return format!("[{}]({})", text, url);
}

pub const EMBED_SEPARATOR: &str = "   •   ";
