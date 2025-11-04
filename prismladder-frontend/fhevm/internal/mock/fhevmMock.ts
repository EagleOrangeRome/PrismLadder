//////////////////////////////////////////////////////////////////////////
//
// WARNING!!
// ALWAYS USE DYNAMIC IMPORT TO AVOID INCLUDING THE ENTIRE 
// FHEVM MOCK LIB IN THE FINAL PRODUCTION BUNDLE!!
//
//////////////////////////////////////////////////////////////////////////

import { JsonRpcProvider, Contract } from "ethers";
import type { FhevmInstance } from "../../fhevmTypes";

/**
 * Create FHEVM Mock Instance for local Hardhat development
 * 
 * v0.3.0-1 API Changes:
 * - MockFhevmInstance.create() now requires 4th parameter: properties
 * - verifyingContractAddressInputVerification must match InputVerifier's EIP712 domain
 * - Dynamically query InputVerifier contract for correct EIP712 domain
 */
export const fhevmMockCreateInstance = async (parameters: {
  rpcUrl: string;
  chainId: number;
  metadata: {
    ACLAddress: `0x${string}`;
    InputVerifierAddress: `0x${string}`;
    KMSVerifierAddress: `0x${string}`;
  };
}): Promise<FhevmInstance> => {
  const mockUtils = await import("@fhevm/mock-utils");
  const MockFhevmInstance = mockUtils.MockFhevmInstance;
  
  const provider = new JsonRpcProvider(parameters.rpcUrl);
  
  // Query InputVerifier contract for EIP712 domain
  // This ensures verifyingContractAddressInputVerification matches the actual contract configuration
  const inputVerifierContract = new Contract(
    parameters.metadata.InputVerifierAddress,
    [
      "function eip712Domain() external view returns (bytes1 fields, string memory name, string memory version, uint256 chainId, address verifyingContract, bytes32 salt, uint256[] memory extensions)"
    ],
    provider
  );
  
  let verifyingContractAddressInputVerification: string;
  let gatewayChainId: number;
  
  try {
    const domain = await inputVerifierContract.eip712Domain();
    verifyingContractAddressInputVerification = domain[4]; // index 4 is verifyingContract
    gatewayChainId = Number(domain[3]); // index 3 is chainId
    
    console.log("[fhevmMockCreateInstance] InputVerifier EIP712 domain:", {
      verifyingContract: verifyingContractAddressInputVerification,
      chainId: gatewayChainId,
    });
  } catch (error) {
    console.warn("[fhevmMockCreateInstance] Failed to query EIP712 domain, using defaults:", error);
    // Fallback to default values if query fails
    verifyingContractAddressInputVerification = "0x812b06e1CDCE800494b79fFE4f925A504a9A9810";
    gatewayChainId = 10901;
  }
  
  const config = {
    aclContractAddress: parameters.metadata.ACLAddress,
    chainId: parameters.chainId,
    gatewayChainId,
    inputVerifierContractAddress: parameters.metadata.InputVerifierAddress,
    kmsContractAddress: parameters.metadata.KMSVerifierAddress,
    verifyingContractAddressDecryption: "0x5ffdaAB0373E62E2ea2944776209aEf29E631A64" as `0x${string}`,
    verifyingContractAddressInputVerification: verifyingContractAddressInputVerification as `0x${string}`,
  };
  
  // v0.3.0-1 requires 4th parameter: properties
  const properties = {
    inputVerifierProperties: {},
    kmsVerifierProperties: {},
  };
  
  console.log("[fhevmMockCreateInstance] Creating instance with config:", config);
  
  const instance = await MockFhevmInstance.create(
    provider,
    provider,
    config,
    properties // NEW: 4th parameter required in v0.3.0-1
  );
  
  console.log("[fhevmMockCreateInstance] ✅ Mock FHEVM instance created successfully");
  
  return instance as unknown as FhevmInstance;
};

