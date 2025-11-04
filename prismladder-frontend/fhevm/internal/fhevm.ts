/**
 * FHEVM Instance Creation
 * 参考 frontend/fhevm/internal/fhevm.ts 思路实现
 */

import { isAddress, Eip1193Provider, JsonRpcProvider, BrowserProvider } from "ethers";
import type { FhevmInstance } from "../fhevmTypes";
import { RelayerSDKLoader } from "./RelayerSDKLoader";

export class FhevmError extends Error {
  code: string;
  constructor(code: string, message?: string) {
    super(message);
    this.code = code;
    this.name = "FhevmError";
  }
}

async function getChainId(providerOrUrl: Eip1193Provider | string | BrowserProvider): Promise<number> {
  if (typeof providerOrUrl === "string") {
    const provider = new JsonRpcProvider(providerOrUrl);
    return Number((await provider.getNetwork()).chainId);
  }
  
  // Check if it's an ethers Provider (has getNetwork method)
  if ('getNetwork' in providerOrUrl && typeof providerOrUrl.getNetwork === 'function') {
    const network = await providerOrUrl.getNetwork();
    return Number(network.chainId);
  }
  
  // Otherwise it's an EIP-1193 provider
  const eip1193Provider = providerOrUrl as Eip1193Provider;
  const chainId = await eip1193Provider.request({ method: "eth_chainId" });
  return Number.parseInt(chainId as string, 16);
}

async function getWeb3Client(rpcUrl: string) {
  const rpc = new JsonRpcProvider(rpcUrl);
  try {
    const version = await rpc.send("web3_clientVersion", []);
    return version;
  } catch (e) {
    throw new FhevmError("WEB3_CLIENTVERSION_ERROR", `The URL ${rpcUrl} is not reachable`);
  } finally {
    rpc.destroy();
  }
}

async function tryFetchFHEVMHardhatNodeMetadata(rpcUrl: string): Promise<
  | {
      ACLAddress: `0x${string}`;
      InputVerifierAddress: `0x${string}`;
      KMSVerifierAddress: `0x${string}`;
    }
  | undefined
> {
  const version = await getWeb3Client(rpcUrl);
  if (typeof version !== "string" || !version.toLowerCase().includes("hardhat")) {
    return undefined;
  }
  
  try {
    const rpc = new JsonRpcProvider(rpcUrl);
    const metadata = await rpc.send("fhevm_relayer_metadata", []);
    rpc.destroy();
    
    if (!metadata || typeof metadata !== "object") return undefined;
    if (!("ACLAddress" in metadata) || typeof metadata.ACLAddress !== "string") return undefined;
    if (!("InputVerifierAddress" in metadata) || typeof metadata.InputVerifierAddress !== "string") return undefined;
    if (!("KMSVerifierAddress" in metadata) || typeof metadata.KMSVerifierAddress !== "string") return undefined;
    
    return metadata as any;
  } catch {
    return undefined;
  }
}

type MockResolveResult = { isMock: true; chainId: number; rpcUrl: string };
type GenericResolveResult = { isMock: false; chainId: number; rpcUrl?: string };

async function resolve(
  providerOrUrl: Eip1193Provider | string | BrowserProvider,
  mockChains?: Record<number, string>
): Promise<MockResolveResult | GenericResolveResult> {
  const chainId = await getChainId(providerOrUrl);
  let rpcUrl = typeof providerOrUrl === "string" ? providerOrUrl : undefined;

  const _mockChains: Record<number, string> = {
    31337: "http://localhost:8545",
    ...(mockChains ?? {}),
  };

  if (Object.hasOwn(_mockChains, chainId)) {
    if (!rpcUrl) {
      rpcUrl = _mockChains[chainId];
    }
    return { isMock: true, chainId, rpcUrl };
  }

  return { isMock: false, chainId, rpcUrl };
}

export const createFhevmInstance = async (parameters: {
  provider: Eip1193Provider | string | BrowserProvider;
  mockChains?: Record<number, string>;
}): Promise<FhevmInstance> => {
  const { provider: providerOrUrl, mockChains } = parameters;

  // Resolve chainId and check if mock
  const { isMock, rpcUrl, chainId } = await resolve(providerOrUrl, mockChains);

  if (isMock) {
    const fhevmMetadata = await tryFetchFHEVMHardhatNodeMetadata(rpcUrl);

    if (fhevmMetadata) {
      // Dynamic import to avoid bundling mock-utils in production
      const fhevmMock = await import("./mock/fhevmMock");
      const mockInstance = await fhevmMock.fhevmMockCreateInstance({
        rpcUrl,
        chainId,
        metadata: fhevmMetadata,
      });

      return mockInstance;
    }
  }

  // Relayer SDK for Sepolia/production
  const loader = new RelayerSDKLoader({ trace: console.log });
  
  if (!loader.isLoaded()) {
    await loader.load();
  }

  // Initialize SDK
  const win = window as any;
  if (!win.relayerSDK.__initialized__) {
    await win.relayerSDK.initSDK();
    win.relayerSDK.__initialized__ = true;
  }

  const relayerSDK = win.relayerSDK;
  const aclAddress = relayerSDK.SepoliaConfig.aclContractAddress;
  
  if (!isAddress(aclAddress)) {
    throw new FhevmError("INVALID_ACL_ADDRESS", `Invalid ACL address: ${aclAddress}`);
  }

  // Determine the network parameter for Relayer SDK
  let networkForSDK: Eip1193Provider | string;
  
  if (typeof providerOrUrl === "string") {
    networkForSDK = providerOrUrl;
  } else if ('getNetwork' in providerOrUrl) {
    // It's a BrowserProvider, extract window.ethereum
    if (typeof window !== "undefined" && window.ethereum) {
      networkForSDK = window.ethereum;
    } else {
      throw new FhevmError("NO_ETHEREUM_PROVIDER", "window.ethereum not available");
    }
  } else {
    // It's already an EIP-1193 provider
    networkForSDK = providerOrUrl;
  }

  const config = {
    ...relayerSDK.SepoliaConfig,
    network: networkForSDK,
  };

  const instance = await relayerSDK.createInstance(config);

  return instance;
};

