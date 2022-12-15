FROM node:18-alpine as base

WORKDIR /app

RUN apk update && apk --no-cache add curl libc6-compat openssl

FROM base AS pruner

ARG APP
ARG APP_FOLDER

RUN yarn global add turbo@1.4.4

COPY ./*.json yarn.lock ./
COPY ./apps ./apps
COPY ./packages ./packages

RUN turbo prune --scope=${APP} --docker


FROM base as deps

COPY --from=pruner /app/out/json/ ./
COPY --from=pruner /app/out/yarn.lock ./yarn.lock

RUN yarn --pure-lockfile


FROM base as runner

ARG APP_FOLDER
ENV APP_FOLDER=${APP_FOLDER}

ARG VERSION
ENV VERSION=${VERSION}

COPY --from=deps /app/ ./
COPY --from=pruner /app/out/full/ ./

RUN yarn build

CMD cd ./apps/${APP_FOLDER} && yarn start