import { randomUUID } from 'node:crypto';
import type { IncomingMessage } from 'node:http';

import cors from 'cors';
import express, { type ErrorRequestHandler } from 'express';
import helmet from 'helmet';
import { pinoHttp } from 'pino-http';

import { env } from './config/env.js';
import { logger } from './lib/logger.js';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN.split(',').map((origin) => origin.trim()) }));
  app.use(express.json({ limit: '1mb' }));
  app.use(
    pinoHttp({
      logger,
      genReqId: (request: IncomingMessage) =>
        request.headers['x-request-id']?.toString() ?? randomUUID(),
    }),
  );

  app.get('/health', (_request, response) => {
    response.json({
      status: 'ok',
      service: 'multition-api',
      version: '0.1.0',
      timestamp: new Date().toISOString(),
    });
  });

  app.use((_request, response) => {
    response.status(404).json({ error: 'NOT_FOUND', message: 'Route not found.' });
  });

  const errorHandler: ErrorRequestHandler = (error, request, response, _next) => {
    request.log?.error({ error }, 'Unhandled request error');
    response.status(500).json({
      error: 'INTERNAL_SERVER_ERROR',
      message: env.NODE_ENV === 'production' ? 'Unexpected server error.' : String(error),
    });
  };
  app.use(errorHandler);

  return app;
}
