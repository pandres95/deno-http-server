# MiniServer: Minimal HTTP Server for Deno

## Install
Import the module from `https://raw.githubusercontent.com/pandres95/deno-http-server/master/server.js`.

## Usage

```javascript
import { MiniServer } from 'https://raw.githubusercontent.com/pandres95/deno-http-server/master/server.js';

const server = new MiniServer({
    port: 8000
});

server
    .get('/', async request => {
        request.json({
            body: {
                hello: 'deno 🦕'
            }
        });
    })
    .listen();

```
