"use client";

import React, { createContext, useContext, useEffect } from "react";
import { FhevmProvider, useFhevm } from "@/fhevm/useFhevm";
import { useWallet } from "@/hooks/useWallet";

interface AppContextType {
  wallet: ReturnType<typeof useWallet>;
  fhevm: ReturnType<typeof useFhevm>;
}

const AppContext = createContext<AppContextType | null>(null);

function AppContextProvider({ children }: { children: React.ReactNode }) {
  const wallet = useWallet();
  const fhevm = useFhevm();

  // 当钱包连接且链ID变化时，初始化FHEVM
  useEffect(() => {
    if (wallet.provider && wallet.chainId && !fhevm.isInitialized && !fhevm.isLoading) {
      fhevm.initializeForProvider(wallet.provider, wallet.chainId);
    }
  }, [wallet.provider, wallet.chainId, fhevm.isInitialized, fhevm.isLoading]);

  return (
    <AppContext.Provider value={{ wallet, fhevm }}>
      {children}
    </AppContext.Provider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <FhevmProvider>
      <AppContextProvider>
        {children}
      </AppContextProvider>
    </FhevmProvider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within Providers");
  }
  return context;
}

