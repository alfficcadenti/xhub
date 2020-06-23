const Vision = require('vision');
const Handlebars = require('handlebars');
const Path = require('path');

async function error(server) {
    await server.register(Vision);
    server.views({
        relativeTo: Path.join(__dirname, 'templates'),
        engines: {
            hbs: Handlebars
        }
    });
    server.ext({
        type: 'onPreResponse',
        method: async (request, h) => {
            if (request.response.isBoom) {
                const err = request.response;
                request.log(['error'], {
                    error: request.response.output.payload.error,
                    payload: request.response.output.payload,
                    stack: request.response.stack,
                    path: request.path
                });
                const message = err.output.payload.message;
                const statusCode = err.output.payload.statusCode;
                // eslint-disable-next-line no-undefined
                const stack = process.env.NODE_ENV !== 'production' ? request.response.stack : undefined;
                return h.view('error', {statusCode, message, title: `${statusCode} Error`, color: 'grey', stack}).code(statusCode);
            }
            return h.continue;
        }
    });
}

module.exports = error;
