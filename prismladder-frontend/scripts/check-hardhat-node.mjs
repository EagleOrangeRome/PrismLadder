/**
 * Check if Hardhat node is running on localhost:8545
 */

import http from 'http';

export async function isHardhatNodeRunning() {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 8545,
      path: '/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      resolve(res.statusCode === 200);
    });

    req.on('error', () => {
      resolve(false);
    });

    // Send a simple JSON-RPC request
    req.write(JSON.stringify({
      jsonrpc: '2.0',
      method: 'eth_blockNumber',
      params: [],
      id: 1,
    }));

    req.end();
  });
}

// Run as standalone script
if (import.meta.url === `file://${process.argv[1]}`) {
  const isRunning = await isHardhatNodeRunning();
  console.log(isRunning ? '✅ Hardhat node is running' : '❌ Hardhat node is NOT running');
  process.exit(isRunning ? 0 : 1);
}

