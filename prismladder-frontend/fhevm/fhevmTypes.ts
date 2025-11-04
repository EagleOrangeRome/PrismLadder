/**
 * FHEVM Types
 * Types for FHEVM integration (Mock and Relayer modes)
 */

import type { BrowserProvider } from "ethers";

export interface EncryptedInput {
  add64(value: number | bigint): EncryptedInput;
  add32(value: number | bigint): EncryptedInput;
  add16(value: number | bigint): EncryptedInput;
  add8(value: number | bigint): EncryptedInput;
  addBool(value: boolean): EncryptedInput;
  encrypt(): Promise<{ handles: Uint8Array[]; inputProof: Uint8Array }>;
  getInputProof(): Uint8Array;
}

export interface FhevmInstance {
  encrypt64(value: number | bigint): Uint8Array;
  encrypt32(value: number | bigint): Uint8Array;
  encrypt16(value: number | bigint): Uint8Array;
  encrypt8(value: number | bigint): Uint8Array;
  encryptBool(value: boolean): Uint8Array;
  
  createEncryptedInput(contractAddress: string, userAddress: string): EncryptedInput;
  getPublicKey(contractAddress?: string): any;
  getPublicParams(size: number): Uint8Array;
  generateKeypair(): { publicKey: string; privateKey: string };
  
  createEIP712(
    publicKey: string,
    contractAddresses: string[],
    startTimestamp: number,
    durationDays: number
  ): {
    domain: any;
    types: any;
    message: any;
  };
  
  userDecrypt(
    handles: Array<{ handle: string; contractAddress: string }>,
    privateKey: string,
    publicKey: string,
    signature: string,
    contractAddresses: string[],
    userAddress: string,
    startTimestamp: number,
    durationDays: number
  ): Promise<Record<string, bigint>>;
}

export interface MockFhevmInstance extends FhevmInstance {
  decrypt(handle: bigint | string): Promise<bigint>;
}

export interface RelayerFhevmInstance extends FhevmInstance {
  requestDecryption(
    handle: bigint | string,
    contractAddress: string,
    userAddress: string
  ): Promise<bigint>;
}

export type FhevmMode = "mock" | "relayer";

export interface FhevmContextValue {
  instance: FhevmInstance | null;
  isInitialized: boolean;
  mode: FhevmMode;
  provider: BrowserProvider | null;
  chainId: number | null;
  initializeForContract: (contractAddress: string) => Promise<void>;
}

export interface EncryptedInput {
  data: Uint8Array;
  inputProof: Uint8Array;
}

