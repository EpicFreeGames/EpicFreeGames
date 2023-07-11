FROM node:18-bullseye-slim as base

WORKDIR /app


FROM base as builder

RUN npm i -g pnpm

COPY ./src ./src
COPY ./tsconfig.json ./
COPY ./package.json ./pnpm-lock.yaml ./

RUN pnpm i --frozen-lockfile

RUN pnpm build


FROM base as prod-deps

RUN npm i -g pnpm

COPY ./package.json ./pnpm-lock.yaml ./

RUN pnpm i --frozen-lockfile --prod


FROM base as runner

COPY --from=builder /app/dist ./dist
COPY --from=prod-deps /app/node_modules ./node_modules

CMD node ./dist/index.js