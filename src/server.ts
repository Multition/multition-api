import { createApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './lib/logger.js';

const app = createApp();

const server = app.listen(env.PORT, () => {
  logger.info({ port: env.PORT, environment: env.NODE_ENV }, 'Multition API started');
});

function shutdown(signal: string) {
  logger.info({ signal }, 'Shutting down Multition API');
  server.close((error) => {
    if (error) {
      logger.error({ error }, 'Graceful shutdown failed');
      process.exitCode = 1;
    }
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
