/**
 * FHEVM Decryption Signature Storage
 * Account-specific signature persistence
 */

const SIGNATURE_PREFIX = "fhevm.decryptionSignature.";

export class FhevmDecryptionSignature {
  static set(account: string, signature: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(`${SIGNATURE_PREFIX}${account.toLowerCase()}`, signature);
  }

  static get(account: string): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(`${SIGNATURE_PREFIX}${account.toLowerCase()}`);
  }

  static remove(account: string): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(`${SIGNATURE_PREFIX}${account.toLowerCase()}`);
  }

  static clear(): void {
    if (typeof window === "undefined") return;
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith(SIGNATURE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  }
}

