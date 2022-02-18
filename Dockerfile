FROM node:16-alpine

USER root

WORKDIR /app

COPY . .

RUN yarn

EXPOSE 5000