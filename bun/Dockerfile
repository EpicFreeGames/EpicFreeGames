FROM oven/bun:latest as runtime

WORKDIR /app

COPY --from=installer ~/.bun/bin/bun /usr/local/bin/bun
COPY ./src ./src
COPY ./package.json ./package.json
COPY ./bun.lockb ./bun.lockb
COPY ./tsconfig.json ./tsconfig.json

RUN bun install

CMD ["bun", "src/index.ts"]
