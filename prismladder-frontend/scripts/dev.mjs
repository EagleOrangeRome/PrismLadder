/**
 * dev entry point (Relayer mode for Sepolia)
 * 1. Generate ABI and addresses
 * 2. Start Next.js dev server with NEXT_PUBLIC_MODE=relayer
 */

import { spawn } from 'child_process';

console.log('🚀 Starting PrismLadder in Relayer mode (Sepolia)...\n');

// Generate ABI
console.log('1️⃣ Generating ABI and addresses...');
const genabiProcess = spawn('node', ['scripts/genabi.mjs'], { stdio: 'inherit' });

await new Promise((resolve, reject) => {
  genabiProcess.on('close', (code) => {
    if (code !== 0) {
      console.error('❌ Failed to generate ABI');
      reject(new Error('genabi failed'));
    } else {
      resolve();
    }
  });
});

console.log('\n2️⃣ Starting Next.js dev server...\n');

// Start Next.js dev server
const nextProcess = spawn('next', ['dev'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NEXT_PUBLIC_MODE: 'relayer',
  },
});

nextProcess.on('close', (code) => {
  process.exit(code);
});

// Handle Ctrl+C
process.on('SIGINT', () => {
  nextProcess.kill('SIGINT');
  process.exit(0);
});

