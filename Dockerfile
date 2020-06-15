FROM node:14

EXPOSE 8080

ENV NODE_ENV=production PORT=8080

WORKDIR /app

RUN groupadd app && useradd -d /app -g app app && chown app:app /app

USER app

COPY package.json package-lock.json ./

ARG npm_registry=https://registry.npmjs.org

RUN npm ci --no-fund --registry $npm_registry

COPY . ./

CMD ["node", "./lib/serve.js"]
