# Machinat Note Example

Taking notes in chatting.
> This is an example app built with [Machinat](https://machinat.com) framework.

## Demo

Try the bot on these chat platforms:

- [Telegram](https://t.me/MachinatNoteBot)
- [LINE](https://line.me/ti/p/@309qnwde)
- [Messenger](https://www.messenger.com/t/109776814755256)

> ⚠ There is [a Facebook bug](https://developers.facebook.com/support/bugs/294949372549147)
> that breaks webviews on the **Messenger website** client.
> Please use the **Messenger mobile app** intead.

## Getting Started

> You have to finish the [Environments Setup](#environments-setup)
> before you start developing.

Run the app in development mode with:

```bash
npm run dev
```

The command does two things:

1. Start a dev server up. It'll refresh automatically when codes are changed.
2. Connect a HTTP tunnel to a _https://xxx.t.machinat.dev_ endpoint.
  It's used to receive webhook requests from the chat platforms.

### Environments Setup

#### Chat Platform Settings

You need to configure the platforms and fill the settings in the `.env` file.
Check `.env.example` file for guides and usage examples.

#### Run Dev Server

Start the server with `npm run dev` command.
It should work if all the required environments are filled at the last step.

#### Initiate Platform Bindings

Keep the dev server running and execute this command in a _new command line tab_:

```bash
npm run migrate
```

This register webhooks and other settings on the chat platforms.
If you want to cancel these changes,
use `npm run migrate -- --down` to revert.

#### Start Developing

Now you can go to the chat platforms and try your bot.
Keep the dev server running while developing.
The changes in codes will immediately reflect on the bot.

## Learn More

Here are some resources to learn Machinat framework:

- [Documents](https://machinat.com/doc) - complete guides by topics
- [Tutorial](https://machinat.com/docs/learn) - a step-by-step tutorial to make an app
- [API references](https://machinat.com/api) - detailed framework API
