/**
 * FHEVM Constants
 * Network configurations and chain IDs
 */

export const SUPPORTED_CHAIN_IDS = {
  LOCALHOST: 31337,
  SEPOLIA: 11155111,
} as const;

export type SupportedChainId = typeof SUPPORTED_CHAIN_IDS[keyof typeof SUPPORTED_CHAIN_IDS];

export const CHAIN_NAMES: Record<SupportedChainId, string> = {
  [SUPPORTED_CHAIN_IDS.LOCALHOST]: "Localhost",
  [SUPPORTED_CHAIN_IDS.SEPOLIA]: "Sepolia",
};

export function isSupportedChain(chainId: number): chainId is SupportedChainId {
  return Object.values(SUPPORTED_CHAIN_IDS).includes(chainId as SupportedChainId);
}

export function getChainName(chainId: number): string {
  if (isSupportedChain(chainId)) {
    return CHAIN_NAMES[chainId];
  }
  return `Unknown (${chainId})`;
}

/**
 * Relayer SDK 0.3.0-5 Configuration
 * ⚠️ MUST use UMD format (.umd.cjs), NOT ES module format (.js)
 * ES module format contains import.meta which cannot be loaded as regular script
 */
export const SDK_CDN_URL =
  "https://cdn.zama.org/relayer-sdk-js/0.3.0-5/relayer-sdk-js.umd.cjs";
export const SDK_LOCAL_URL = "/relayer-sdk-js.umd.cjs";

