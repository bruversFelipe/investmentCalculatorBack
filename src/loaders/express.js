import helmet from 'helmet';
import express from 'express';
import config from '../config/index.js';
import logs from '../middlewares/logs.js';
import indexRouter from '../routers/index.js';
import { corsHandler } from '../middlewares/cors.js';
import { notFoundHandler, globalErrorHandler } from '../middlewares/errors.js';


export default async function ({ app }) {
  app.enable('trust proxy');
  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );
  corsHandler(app);
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  logs(app);
  app.use(config.app.apiPrefix, indexRouter(express.Router()));
  app.use(notFoundHandler);
  app.use(globalErrorHandler);
  logs(app);
}
