import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Potential locations where .env could reside depending on execution CWD:
// 1. Current working directory
// 2. One directory up from current file (e.g. apps/api/ if running from apps/api/dist or apps/api/src)
// 3. Two directories up (e.g. monorepo root or apps/api)
// 4. Same directory as current file
const candidatePaths = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(__dirname, '..', '.env'),
  path.resolve(__dirname, '../..', '.env'),
  path.resolve(__dirname, '../../..', '.env'),
  path.resolve(__dirname, '.env'),
];

let loadedPath: string | null = null;
for (const p of candidatePaths) {
  if (fs.existsSync(p)) {
    dotenv.config({ path: p });
    loadedPath = p;
    break;
  }
}

if (!process.env['DATABASE_URL']) {
  console.warn(
    `⚠️ [Campusly Env] DATABASE_URL not detected! Checked candidate paths:\n` +
      candidatePaths.map((cp) => `  - ${cp}`).join('\n')
  );
}
