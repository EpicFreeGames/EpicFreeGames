FROM rust:slim AS base
WORKDIR /app

FROM base as planner
RUN cargo install cargo-chef 
COPY . .
RUN cargo chef prepare --recipe-path recipe.json

FROM base as cacher
RUN cargo install cargo-chef
COPY --from=planner /app/recipe.json recipe.json
RUN cargo chef cook --release --recipe-path recipe.json

FROM base as pre
COPY . .
COPY --from=cacher /app/target target
RUN cargo build --release

FROM debian:bullseye-slim as final
WORKDIR /app
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*
COPY --from=pre /app/target/release/api .
COPY --from=pre /app/i18n/t10s ./t10s
CMD ["./api"]