import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import pg from 'pg';

import { env } from '../config/env.js';

const migrationUrl = new URL('../../migrations/001_initial.sql', import.meta.url);
const sql = await readFile(fileURLToPath(migrationUrl), 'utf8');
const client = new pg.Client({ connectionString: env.DATABASE_URL });

await client.connect();
try {
  await client.query(sql);
  console.log('Applied migrations/001_initial.sql');
} finally {
  await client.end();
}
