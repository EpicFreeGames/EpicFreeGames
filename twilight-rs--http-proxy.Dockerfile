FROM rust as builder
WORKDIR /usr/src/app

RUN git clone https://github.com/twilight-rs/http-proxy.git
WORKDIR /usr/src/app/http-proxy

RUN cargo install --path .

FROM debian:bullseye-slim
RUN apt-get update && rm -rf /var/lib/apt/lists/*
COPY --from=builder /usr/local/cargo/bin/twilight-http-proxy /usr/local/bin/twilight-http-proxy
CMD ["twilight-http-proxy"]