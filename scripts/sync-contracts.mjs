import { access, copyFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const workspaceRoot = resolve(repositoryRoot, '..');
const source = resolve(repositoryRoot, 'openapi/generated/core-api.d.ts');

// Each client keeps a committed snapshot, so it can be cloned independently.
for (const repository of ['multition-mobile', 'multition-web']) {
  const clientRoot = resolve(workspaceRoot, repository);
  try {
    await access(resolve(clientRoot, 'package.json'));
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    process.stdout.write(`Skipped ${repository}: clone it beside multition-api to sync.\n`);
    continue;
  }
  const destination = resolve(clientRoot, 'src/types/generated/core-api.d.ts');
  await mkdir(dirname(destination), { recursive: true });
  await copyFile(source, destination);
  process.stdout.write(`Synced core API types to ${repository}.\n`);
}
