# Note Machina

📝 Note Machina 🤖 is an in-chat note app.

## Preparation

### Install dependencies

```
$ npm install
```

### Setup

Create an `.env` file from `.env.example` and fill up settings.

```
$ cp .env.example .env
```

## Development

### Create assets

```
$ npm run migrate:dev
```

### Start dev server

```
$ npm run dev
```

## Production

### Build

```
$ npm run build
```

### Create assets

```
$ npm run migrate
```

### Start server

```
$ NODE_ENV=production npm start
```

### Build docker image

```
$ docker build -t note-machina:vX.X.X .
```
