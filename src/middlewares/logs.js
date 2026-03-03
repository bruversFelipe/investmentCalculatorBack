import morgan from 'morgan';
import config from '../config/index.js';

export default function (app) {
  const originalSend = app.response.send;
  app.response.send = function sendOverWrite(body) {
    if (this.statusCode >= 400) this.responseBody = body;
    originalSend.call(this, body);
  };
  morgan.token('response-body-on-error', function (_req, res) {
    return res.statusCode >= 400 ? res.responseBody : null;
  });
  app.use(
    morgan(
      ':method :url \x1b[31m:status\x1b[0m body: :response-body-on-error :response-time ms',
      {
        skip: function (_req, res) {
          return res.statusCode < 400;
        },
      },
    ),
  );
  app.use(
    morgan(config.morganLogFormat, {
      skip: function (_req, res) {
        return res.statusCode >= 400;
      },
    }),
  );
}
