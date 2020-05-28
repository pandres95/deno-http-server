import { serve } from 'https://deno.land/std@0.53.0/http/server.ts';

/**
 * Example of usage:
 *
 * const server = new Server({
 *     port: 8000
 * });
 *
 * server
 *      .get('/', async request => {
 *          request.json({
 *              body: {
 *                  hello: 'deno 🦕'
 *              }
 *          });
 *      })
 *      .listen();
 */
export class MiniServer {
    #httpServer
    #requestsMap = {}
    #listenOpts

    constructor (listenOpts) {
        this.#listenOpts = listenOpts;
    }

    listen (listenOpts) {
        const uri = {
            protocol: this.#listenOpts?.certFile !== undefined ? 'https' : 'http',
            hostname: this.#listenOpts?.hostname ?? '0.0.0.0',
            port: this.#listenOpts?.port ?? 8000
        };

        console.log(`Listening ${uri.protocol}://${uri.hostname}:${uri.port}`);
        this.#httpServer = serve(listenOpts ?? this.#listenOpts);

        this.handleRequests();
        return this;
    }

    async handleRequests () {
        for await (const request of this.#httpServer) {
            await this.handler(request);
        }
    }

    async handler (request) {
        request.json = async function ({
            body,
            headers,
            status = 200
        }) {
            this.respond({
                headers: new Headers({
                    'Content-Type': 'application/json; charset=utf-8',
                    ...headers
                }),
                body: JSON.stringify(body),
                status
            });
        };

        const fallback = () => request.respond({
            status: 404,
            body: `Cannot ${request.method} ${request.url}`
        });

        const doRequest = this.#requestsMap[request.method.toLowerCase()]?.[request.url] ?? fallback;
        await doRequest(request);
    }

    use (method, uri, handler) {
        if (this.#requestsMap[method] === undefined) {
            this.#requestsMap[method] = {};
        }

        this.#requestsMap[method][uri] = handler;
        return this;
    }

    get (uri, handler) {
        return this.use('get', uri, handler);
    }

    post (uri, handler) {
        return this.use('post', uri, handler);
    }

    put (uri, handler) {
        return this.use('put', uri, handler);
    }

    patch (uri, handler) {
        return this.use('patch', uri, handler);
    }

    options (uri, handler) {
        return this.use('options', uri, handler);
    }

    head (uri, handler) {
        return this.use('head', uri, handler);
    }

    delete (uri, handler) {
        return this.use('delete', uri, handler);
    }
}
