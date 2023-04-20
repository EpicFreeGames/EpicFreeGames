pub fn create_session_token(user_id: &str, session_id: &str) -> String {
    return format!("{}.{}", user_id, session_id);
}

pub fn parse_session_token(token: &str) -> Option<(String, String)> {
    token
        .split_once(".")
        .map(|(user_id, session_id)| (user_id.to_string(), session_id.to_string()))
}
