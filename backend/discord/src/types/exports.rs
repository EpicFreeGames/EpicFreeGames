use twilight_model::id::{marker::ApplicationMarker, Id};

pub type InteractionResponse = twilight_model::http::interaction::InteractionResponse;
pub type Interaction = twilight_model::application::interaction::Interaction;

pub type HttpClient = twilight_http::Client;
pub type InteractionClient<'a> = twilight_http::client::InteractionClient<'a>;

pub type ClientId = Id<ApplicationMarker>;
