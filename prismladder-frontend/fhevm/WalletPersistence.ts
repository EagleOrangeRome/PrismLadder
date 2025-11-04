/**
 * Wallet Persistence
 * Storage keys: wallet.lastConnectorId, wallet.lastAccounts, wallet.lastChainId, wallet.connected
 */

export interface WalletState {
  lastConnectorId: string | null;
  lastAccounts: string[];
  lastChainId: number | null;
  connected: boolean;
}

export class WalletPersistence {
  private static KEYS = {
    CONNECTOR_ID: "wallet.lastConnectorId",
    ACCOUNTS: "wallet.lastAccounts",
    CHAIN_ID: "wallet.lastChainId",
    CONNECTED: "wallet.connected",
  };

  static save(state: Partial<WalletState>): void {
    if (typeof window === "undefined") return;

    if (state.lastConnectorId !== undefined) {
      localStorage.setItem(this.KEYS.CONNECTOR_ID, state.lastConnectorId || "");
    }

    if (state.lastAccounts !== undefined) {
      localStorage.setItem(this.KEYS.ACCOUNTS, JSON.stringify(state.lastAccounts));
    }

    if (state.lastChainId !== undefined) {
      localStorage.setItem(this.KEYS.CHAIN_ID, String(state.lastChainId || ""));
    }

    if (state.connected !== undefined) {
      localStorage.setItem(this.KEYS.CONNECTED, state.connected ? "true" : "false");
    }
  }

  static load(): WalletState {
    if (typeof window === "undefined") {
      return {
        lastConnectorId: null,
        lastAccounts: [],
        lastChainId: null,
        connected: false,
      };
    }

    const lastConnectorId = localStorage.getItem(this.KEYS.CONNECTOR_ID) || null;
    const lastAccountsStr = localStorage.getItem(this.KEYS.ACCOUNTS);
    const lastChainIdStr = localStorage.getItem(this.KEYS.CHAIN_ID);
    const connectedStr = localStorage.getItem(this.KEYS.CONNECTED);

    return {
      lastConnectorId,
      lastAccounts: lastAccountsStr ? JSON.parse(lastAccountsStr) : [],
      lastChainId: lastChainIdStr ? parseInt(lastChainIdStr, 10) : null,
      connected: connectedStr === "true",
    };
  }

  static clear(): void {
    if (typeof window === "undefined") return;
    
    Object.values(this.KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  }
}

