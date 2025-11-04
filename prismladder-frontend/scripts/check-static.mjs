/**
 * Check for static export violations
 * Ensures no SSR/ISR/API routes/server-only imports
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FRONTEND_ROOT = path.resolve(__dirname, '..');
const APP_DIR = path.join(FRONTEND_ROOT, 'app');

const VIOLATIONS = [
  { pattern: /getServerSideProps/g, name: 'getServerSideProps' },
  { pattern: /getInitialProps/g, name: 'getInitialProps' },
  { pattern: /getStaticProps.*revalidate/gs, name: 'ISR (revalidate)' },
  { pattern: /export\s+const\s+dynamic\s*=\s*['"]force-dynamic['"]/g, name: 'force-dynamic' },
  { pattern: /from\s+['"]next\/headers['"]/g, name: 'next/headers' },
  { pattern: /\bcookies\(\)/g, name: 'cookies()' },
  { pattern: /from\s+['"]server-only['"]/g, name: 'server-only' },
];

const API_ROUTE_PATTERNS = [
  /\/api\//,  // pages/api or app/api
  /route\.(ts|tsx|js|jsx)$/,  // App Router route handlers
];

let errors = [];

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(FRONTEND_ROOT, filePath);

  // Check for API routes
  for (const pattern of API_ROUTE_PATTERNS) {
    if (pattern.test(filePath)) {
      errors.push(`❌ API route detected: ${relativePath}`);
      return;
    }
  }

  // Check for SSR/ISR violations
  for (const { pattern, name } of VIOLATIONS) {
    if (pattern.test(content)) {
      errors.push(`❌ Found ${name} in ${relativePath}`);
    }
  }
}

function checkDynamicRoutes(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // Check if it's a dynamic route directory (contains [ or [[)
      if (entry.name.includes('[')) {
        // Look for generateStaticParams in the same directory
        const hasGenerateStaticParams = entries.some((e) =>
          e.isFile() && (e.name === 'page.tsx' || e.name === 'page.ts')
        );

        if (hasGenerateStaticParams) {
          const pageFile = path.join(fullPath, 'page.tsx') || path.join(fullPath, 'page.ts');
          if (fs.existsSync(pageFile)) {
            const content = fs.readFileSync(pageFile, 'utf8');
            if (!/export\s+(async\s+)?function\s+generateStaticParams/.test(content)) {
              errors.push(
                `❌ Dynamic route ${entry.name} missing generateStaticParams in ${path.relative(FRONTEND_ROOT, pageFile)}`
              );
            }
          }
        }
      }

      checkDynamicRoutes(fullPath);
    } else if (entry.isFile() && /\.(ts|tsx|js|jsx)$/.test(entry.name)) {
      checkFile(fullPath);
    }
  }
}

function checkNextConfig() {
  const configPath = path.join(FRONTEND_ROOT, 'next.config.ts');
  if (fs.existsSync(configPath)) {
    const content = fs.readFileSync(configPath, 'utf8');
    
    if (!/output:\s*['"]export['"]/.test(content)) {
      errors.push(`❌ next.config.ts missing output: 'export'`);
    }
    
    if (!/images:\s*\{[^}]*unoptimized:\s*true/.test(content)) {
      errors.push(`❌ next.config.ts missing images.unoptimized: true`);
    }
    
    if (!/trailingSlash:\s*true/.test(content)) {
      errors.push(`❌ next.config.ts missing trailingSlash: true`);
    }
  } else {
    errors.push(`❌ next.config.ts not found`);
  }
}

console.log('🔍 Checking for static export violations...\n');

// Check next.config.ts
checkNextConfig();

// Check app directory
if (fs.existsSync(APP_DIR)) {
  checkDynamicRoutes(APP_DIR);
}

// Report results
if (errors.length > 0) {
  console.log('❌ Static export violations found:\n');
  errors.forEach((error) => console.log(error));
  console.log(`\n❌ Found ${errors.length} violation(s)`);
  process.exit(1);
} else {
  console.log('✅ No static export violations found!');
  process.exit(0);
}

