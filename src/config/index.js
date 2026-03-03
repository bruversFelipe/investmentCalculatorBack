import dotenv from 'dotenv';
import env from '../../env.js';

const envFound = dotenv.config();

process.env.NODE_ENV = process.env.NODE_ENV || 'local';

if (process.env.NODE_ENV === 'local' && envFound.error) {
  throw new Error('No .env file');
}

export default {
  app: {
    port: env.PORT,
    apiPrefix: env.API_PREFIX,
    cors: {
      method: env.CORS.METHOD,
      allowedHeaders: env.CORS.ALLOWED_HEADERS,
      origin: env.CORS.ORIGIN[process.env.NODE_ENV.toLocaleUpperCase()],
    },
  },
  morganLogFormat: env.MORGAN_LOG_FORMAT,
};
