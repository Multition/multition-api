import { createServer, type Server } from 'node:http';

import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { createApp } from '../src/app.js';

describe('Multition API', () => {
  let server: Server;

  beforeAll(async () => {
    server = createServer(createApp());
    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  });

  afterAll(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  });

  it('reports service health', async () => {
    const response = await request(server).get('/health').expect(200);
    expect(response.body).toMatchObject({ status: 'ok', service: 'multition-api' });
  });

  it('returns a JSON 404 for unknown routes', async () => {
    const response = await request(server).get('/not-implemented').expect(404);
    expect(response.body).toEqual({ error: 'NOT_FOUND', message: 'Route not found.' });
  });
});
