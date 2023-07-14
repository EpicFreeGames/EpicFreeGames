FROM node:18-bullseye-slim as base

WORKDIR /app

RUN npm i -g pnpm

COPY ./src ./src
COPY ./prisma ./prisma
COPY ./tsconfig.json ./
COPY ./package.json ./pnpm-lock.yaml ./

RUN pnpm i --frozen-lockfile

RUN pnpm prisma generate

RUN pnpm build

CMD node dist/index.js