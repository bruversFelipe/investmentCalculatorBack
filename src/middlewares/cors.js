import cors from 'cors';
import config from '../config/index.js';

const allowedOrigin =
  process.env.NODE_ENV === 'local' ? '*' : config.app.cors.origin;

function responseCorsHandler(req, res, next) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    return res.status(204).send();
  }
  
  next();
}

export function corsHandler(app) {
  app.use(
    cors(),
  );
  app.use(responseCorsHandler);
}
