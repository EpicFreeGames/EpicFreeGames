FROM oven/bun

WORKDIR /app

COPY ./src ./src
COPY ./package.json ./package.json
COPY ./bun.lockb ./bun.lockb
COPY ./tsconfig.json ./tsconfig.json

RUN bun install

CMD ["bun", "src/index.ts"]