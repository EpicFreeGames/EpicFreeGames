pub struct Language {
    pub name: String,
    pub code: String,
}

impl Default for Language {
    fn default() -> Self {
        return Self {
            name: "English".to_string(),
            code: "en".to_string(),
        };
    }
}

pub struct Currency {
    pub name: String,
    pub code: String,
}
