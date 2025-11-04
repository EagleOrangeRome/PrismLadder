/**
 * Generate ABI and addresses from Hardhat deployments
 * Supports both localhost and sepolia networks
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FRONTEND_ROOT = path.resolve(__dirname, '..');
const CONTRACT_ROOT = path.resolve(FRONTEND_ROOT, '../fhevm-hardhat-template');
const ABI_DIR = path.join(FRONTEND_ROOT, 'abi');

// Contract name
const CONTRACT_NAME = 'PrismLadderCompensation';

function generateABI() {
  console.log('📝 Generating ABI and addresses...');

  // Ensure ABI directory exists
  if (!fs.existsSync(ABI_DIR)) {
    fs.mkdirSync(ABI_DIR, { recursive: true });
  }

  const networks = ['localhost', 'sepolia'];
  const addresses = {};

  for (const network of networks) {
    const deploymentPath = path.join(
      CONTRACT_ROOT,
      'deployments',
      network,
      `${CONTRACT_NAME}.json`
    );

    if (fs.existsSync(deploymentPath)) {
      const deployment = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));
      
      // Extract ABI (only once, as it's the same for all networks)
      if (!fs.existsSync(path.join(ABI_DIR, `${CONTRACT_NAME}ABI.ts`))) {
        const abiContent = `// Auto-generated from Hardhat deployments
// Do not edit manually

export const ${CONTRACT_NAME}ABI = ${JSON.stringify(deployment.abi, null, 2)} as const;
`;
        fs.writeFileSync(path.join(ABI_DIR, `${CONTRACT_NAME}ABI.ts`), abiContent);
        console.log(`✅ Generated ABI for ${CONTRACT_NAME}`);
      }

      // Extract address
      addresses[network] = deployment.address;
      console.log(`✅ Found ${network} address: ${deployment.address}`);
    } else {
      // Include network key even if deployment doesn't exist (as undefined)
      addresses[network] = undefined;
      console.log(`⚠️  No deployment found for ${network} (will set as undefined)`);
    }
  }

  // Generate addresses file with explicit undefined handling
  const addressEntries = Object.entries(addresses)
    .map(([network, address]) => {
      if (address === undefined) {
        return `  "${network}": undefined as string | undefined`;
      }
      return `  "${network}": "${address}"`;
    })
    .join(',\n');

  const addressesContent = `// Auto-generated from Hardhat deployments
// Do not edit manually

export const ${CONTRACT_NAME}Addresses = {
${addressEntries}
} as const;

export type NetworkName = keyof typeof ${CONTRACT_NAME}Addresses;

export function getContractAddress(chainId: number): string | undefined {
  if (chainId === 31337) return ${CONTRACT_NAME}Addresses.localhost;
  if (chainId === 11155111) return ${CONTRACT_NAME}Addresses.sepolia;
  return undefined;
}
`;

  fs.writeFileSync(path.join(ABI_DIR, `${CONTRACT_NAME}Addresses.ts`), addressesContent);
  console.log(`✅ Generated addresses file`);

  console.log('✨ ABI generation complete!');
}

// Run
try {
  generateABI();
} catch (error) {
  console.error('❌ Error generating ABI:', error.message);
  process.exit(1);
}

