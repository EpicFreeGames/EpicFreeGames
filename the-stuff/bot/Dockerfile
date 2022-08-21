FROM denoland/deno:alpine as base

WORKDIR /app

ARG SCOPE
ENV FOLDER ./src/${SCOPE}

COPY ${FOLDER} ${FOLDER}

COPY ./importMap.json ./importMap.json
COPY ./deno.json ./deno.json

COPY ./src/_shared ./src/_shared

RUN deno cache ${FOLDER}/mod.ts

CMD deno run -A ${FOLDER}/mod.ts