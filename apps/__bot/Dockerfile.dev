FROM denoland/deno:alpine as base

WORKDIR /app

RUN apk update && apk add wget
RUN wget -q -O ./wait-for.sh https://raw.githubusercontent.com/eficode/wait-for/4df3f9262d84cab0039c07bf861045fbb3c20ab7/wait-for && chmod +x ./wait-for.sh

ARG SCOPE
ENV FOLDER ./src/${SCOPE}

COPY ${FOLDER} ${FOLDER}

COPY ./importMap.json ./importMap.json
COPY ./deno.json ./deno.json

COPY ./src/_shared ./src/_shared

RUN deno cache ${FOLDER}/mod.ts

CMD deno run -A ${FOLDER}/mod.ts