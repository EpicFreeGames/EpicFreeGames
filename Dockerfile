FROM node:17-alpine

USER root

WORKDIR /app

COPY . .

RUN yarn

EXPOSE 5000