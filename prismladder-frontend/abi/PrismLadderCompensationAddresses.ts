// Auto-generated from Hardhat deployments
// Do not edit manually

export const PrismLadderCompensationAddresses = {
  "localhost": "0x807bB73583BbF10A7B7804504D30b06D1436628E",
  "sepolia": "0x807bB73583BbF10A7B7804504D30b06D1436628E"
} as const;

export type NetworkName = keyof typeof PrismLadderCompensationAddresses;

export function getContractAddress(chainId: number): string | undefined {
  if (chainId === 31337) return PrismLadderCompensationAddresses.localhost;
  if (chainId === 11155111) return PrismLadderCompensationAddresses.sepolia;
  return undefined;
}
