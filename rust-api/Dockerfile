FROM rust:slim AS pre

WORKDIR /app

COPY ./Cargo.toml ./Cargo.lock ./
COPY ./api ./api
COPY ./config ./config
COPY ./data ./data
COPY ./database ./database
COPY ./discord ./discord
COPY ./entity ./entity
COPY ./handlers ./handlers
COPY ./i18n ./i18n

RUN cargo build --release


FROM debian:bullseye-slim as final

WORKDIR /app

COPY --from=pre /app/target/release/api .
COPY --from=pre /app/i18n/t10s ./t10s

CMD ["./api"]