/**
 * Post-build script for Vercel deployment
 * Creates routes-manifest.json for Next.js static export compatibility
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUT_DIR = path.resolve(__dirname, '..', 'out');

// Create minimal routes-manifest.json for Vercel compatibility
const routesManifest = {
  version: 3,
  pages404: true,
  basePath: '',
  redirects: [],
  rewrites: [],
  headers: [],
};

const routesManifestPath = path.join(OUT_DIR, 'routes-manifest.json');

try {
  fs.writeFileSync(routesManifestPath, JSON.stringify(routesManifest, null, 2));
  console.log('✅ Created routes-manifest.json for Vercel compatibility');
} catch (error) {
  console.error('❌ Failed to create routes-manifest.json:', error.message);
  process.exit(1);
}



