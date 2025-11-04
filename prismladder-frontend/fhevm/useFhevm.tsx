"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { BrowserProvider } from "ethers";
import type { FhevmInstance } from "./fhevmTypes";
import { createFhevmInstance } from "./internal/fhevm";

interface FhevmContextType {
  instance: FhevmInstance | null;
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  initializeForProvider: (provider: BrowserProvider, chainId: number) => Promise<void>;
}

const FhevmContext = createContext<FhevmContextType | null>(null);

export function FhevmProvider({ children }: { children: React.ReactNode }) {
  const [instance, setInstance] = useState<FhevmInstance | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initializeForProvider = useCallback(async (provider: BrowserProvider, chainId: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const fhevmInstance = await createFhevmInstance({
        provider: provider as any,
        mockChains: { 31337: "http://localhost:8545" },
      });

      setInstance(fhevmInstance);
    } catch (err: any) {
      console.error("Failed to initialize FHEVM:", err);
      setError(err.message || "Failed to initialize FHEVM");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <FhevmContext.Provider
      value={{
        instance,
        isInitialized: !!instance,
        isLoading,
        error,
        initializeForProvider,
      }}
    >
      {children}
    </FhevmContext.Provider>
  );
}

export function useFhevm() {
  const context = useContext(FhevmContext);
  if (!context) {
    throw new Error("useFhevm must be used within FhevmProvider");
  }
  return context;
}

