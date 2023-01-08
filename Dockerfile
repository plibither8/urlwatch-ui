FROM node:19-alpine AS BUILD_IMAGE

WORKDIR /usr/src/app

COPY package.json .
COPY pnpm-lock.yaml .

RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

RUN pnpm prune --prod

FROM node:19-alpine

WORKDIR /usr/src/app

COPY --from=BUILD_IMAGE /usr/src/app/build ./build
COPY --from=BUILD_IMAGE /usr/src/app/node_modules ./node_modules
COPY --from=BUILD_IMAGE /usr/src/app/package.json ./package.json

ENV NODE_ENV=production
ENV HOST=0.0.0.0
EXPOSE 3000

CMD [ "npm", "start" ]