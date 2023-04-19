FROM rust AS base
WORKDIR /app

FROM base as pre
COPY . .
RUN cargo build --release

FROM debian:bullseye-slim as final
WORKDIR /app
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*
COPY --from=pre /app/target/release/api .
COPY --from=pre /app/i18n/t10s ./t10s
CMD ["./api"]