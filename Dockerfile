FROM node:19-bullseye

WORKDIR /usr/src/app

COPY package.json .
COPY pnpm-lock.yaml .

RUN npm install -g pnpm
RUN pnpm install

COPY . .

RUN pnpm build

ENV NODE_ENV=production
ENV HOST=0.0.0.0
EXPOSE 3000

CMD [ "pnpm", "start" ]