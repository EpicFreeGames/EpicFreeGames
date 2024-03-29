FROM node:lts-alpine AS build
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm
RUN pnpm i
COPY . .

ENV PROD=true
ENV PUBLIC_BOT_NAME=EpicFreeGames
ENV PUBLIC_BACKEND_URL=https://api.epicfreegames.net
ENV PUBLIC_BASE_URL=https://epicfreegames.net

RUN pnpm build

FROM nginx:alpine AS runtime
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
