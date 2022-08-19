FROM denoland/deno:alpine as base

WORKDIR /app

COPY ./importMap.json ./importMap.json
COPY ./deno.json ./deno.json
COPY ./twind.config.ts ./twind.config.ts

COPY ./src ./src

RUN deno cache ./src/main.ts

CMD deno run -A ./src/main.ts