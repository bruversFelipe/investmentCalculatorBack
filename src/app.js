import express from 'express';
import config from './config/index.js';

async function startServer() {
  const app = express();

  (await import('./loaders/index.js')).default({ app });

  app
    .listen(config.app.port, () => {
      console.log(`Servidor Node.js escutando na porta ${config.app.port}`);
    })
    .on('error', (error) => {
      console.log(error.message);
      process.exit(1);
    });
}

startServer();
