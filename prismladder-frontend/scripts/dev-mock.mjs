/**
 * dev:mock entry point
 * 1. Check if Hardhat node is running
 * 2. Generate ABI and addresses
 * 3. Start Next.js dev server with NEXT_PUBLIC_MODE=mock
 */

import { spawn } from 'child_process';
import { isHardhatNodeRunning } from './check-hardhat-node.mjs';

console.log('🚀 Starting PrismLadder in Mock mode...\n');

// Check Hardhat node
console.log('1️⃣ Checking Hardhat node...');
const isRunning = await isHardhatNodeRunning();

if (!isRunning) {
  console.error('❌ Hardhat node is not running on localhost:8545');
  console.error('   Please start it with: cd ../fhevm-hardhat-template && npx hardhat node');
  process.exit(1);
}
console.log('✅ Hardhat node is running\n');

// Generate ABI
console.log('2️⃣ Generating ABI and addresses...');
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

console.log('\n3️⃣ Starting Next.js dev server...\n');

// Start Next.js dev server
const nextProcess = spawn('next', ['dev'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NEXT_PUBLIC_MODE: 'mock',
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

