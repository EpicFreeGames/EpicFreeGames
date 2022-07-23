FROM denoland/deno:alpine as base

WORKDIR /app

ARG SCOPE
ENV FOLDER ./src/${SCOPE}

COPY ${FOLDER} ${FOLDER}

COPY ./importMap.json ./importMap.json
COPY ./deno.json ./deno.json

COPY ./src/*.ts ./src/
COPY ./src/embeds ./src/embeds
COPY ./src/i18n ./src/i18n
COPY ./src/utils ./src/utils

RUN deno cache ${FOLDER}/mod.ts

CMD deno run -A ${FOLDER}/mod.ts