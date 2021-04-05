# rubik-micro
Telegram's Bot API kubik for the Rubik

## Install

### npm
```bash
npm i rubik-telegram
```

### yarn
```bash
yarn add rubik-telegram
```

## Use
```js
const { App, Kubiks } = require('rubik-main');
const Telegram = require('rubik-telegram');
const path = require('path');

// create rubik app
const app = new App();
// config need for most modules
const config = new Kubiks.Config(path.join(__dirname, './config/'));

const telegram = new Telegram();

app.add([ config, telegram ]);

app.up().
then(() => console.info('App started')).
catch(err => console.error(err));
```

## Config
`telegram.js` config in configs volume may contain the host and token.

If you do not specify a host, then `https://api.telegram.org/` will be used by default.

If you don't specify a token, you will need to pass it.
```js
...
const response = await app.get('telegram').sendMessage(message, token);
...
```

You may need the host option if for some reason Telegram host is not available from your server
and you want to configure a proxy server.


For example:
`config/telegram.js`
```js
module.exports = {
  host: 'https://my.telegram.proxy.example.com/'
};
```

## Extensions
Telegram kubik doesn't has any extension.
