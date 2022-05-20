FROM node:17-alpine as base

WORKDIR /app

FROM base AS pruner

ARG SCOPE

RUN yarn global add turbo

COPY ./*.json yarn.lock ./
COPY ./apps ./apps
COPY ./packages ./packages

RUN turbo prune --scope=${SCOPE} --docker


FROM base as all-deps

COPY --from=pruner /app/out/json/ ./
COPY --from=pruner /app/out/yarn.lock ./yarn.lock

RUN yarn --pure-lockfile


FROM base as prod-deps

COPY --from=pruner /app/out/json/ ./
COPY --from=pruner /app/out/yarn.lock ./yarn.lock

RUN yarn --prod --pure-lockfile


FROM base as builder

ARG SCOPE

COPY --from=all-deps /app/ ./
COPY --from=pruner /app/out/full/ ./

RUN ls
RUN yarn turbo run build
RUN rm -rf apps/**/src
RUN rm -rf packages/**/src

RUN rm -rf apps/**/node_modules
RUN rm -rf packages/**/node_modules


FROM base as runner 

COPY --from=builder /app/ .
COPY --from=prod-deps /app/ .

CMD [ "yarn", "turbo", "run", "start" ]