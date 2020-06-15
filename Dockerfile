FROM node:14

EXPOSE 80

ENV NODE_ENV=production PORT=80

WORKDIR /app

RUN groupadd app && useradd -d /app -g app app && chown app:app /app

USER app

VOLUME ["/app/.env", "/app/.migrated.json"]

COPY package.json package-lock.json ./

ARG npm_registry=https://registry.npmjs.org

RUN npm ci --no-fund --registry $npm_registry

COPY . ./

CMD ["npm", "start"]
