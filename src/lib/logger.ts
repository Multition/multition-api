import pino from 'pino';

import { env } from '../config/env.js';

export const logger = pino({
  level: env.LOG_LEVEL,
  base: { service: 'multition-api' },
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'password',
      '*.password',
      '*.accessToken',
      '*.refreshToken',
      '*.cvContent',
    ],
    censor: '[REDACTED]',
  },
});
