"use client";

import { useState, useEffect, useCallback } from "react";
import { BrowserProvider, JsonRpcSigner, JsonRpcProvider } from "ethers";
import { WalletPersistence } from "@/fhevm/WalletPersistence";

export function useWallet() {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [readonlyProvider, setReadonlyProvider] = useState<JsonRpcProvider | BrowserProvider | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 静默恢复钱包连接
  useEffect(() => {
    const silentReconnect = async () => {
      const state = WalletPersistence.load();
      
      if (!state.connected || typeof window === "undefined" || !window.ethereum) {
        return;
      }

      try {
        const provider = new BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_accounts", []);
        
        if (accounts.length > 0 && accounts[0] === state.lastAccounts[0]) {
          const network = await provider.getNetwork();
          const signer = await provider.getSigner();
          const chainIdNum = Number(network.chainId);
          
          setProvider(provider);
          setSigner(signer);
          setAccount(accounts[0]);
          setChainId(chainIdNum);
          
          // 为 localhost (chainId 31337) 创建独立的 readonly provider 以避免缓存
          if (chainIdNum === 31337) {
            const readonlyProv = new JsonRpcProvider("http://localhost:8545");
            setReadonlyProvider(readonlyProv);
          } else {
            setReadonlyProvider(provider);
          }
        } else {
          WalletPersistence.clear();
        }
      } catch (err) {
        console.error("Silent reconnect failed:", err);
        WalletPersistence.clear();
      }
    };

    silentReconnect();
  }, []);

  // 监听账户和链变化
  useEffect(() => {
    if (typeof window === "undefined" || !window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect();
      } else {
        setAccount(accounts[0]);
        WalletPersistence.save({ lastAccounts: accounts });
        
        // 重新获取signer
        if (provider) {
          provider.getSigner().then(setSigner);
        }
      }
    };

    const handleChainChanged = (chainIdHex: string) => {
      const newChainId = parseInt(chainIdHex, 16);
      setChainId(newChainId);
      WalletPersistence.save({ lastChainId: newChainId });
      
      // 刷新页面以重新初始化provider
      window.location.reload();
    };

    const handleDisconnect = () => {
      disconnect();
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);
    window.ethereum.on("disconnect", handleDisconnect);

    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum?.removeListener("chainChanged", handleChainChanged);
      window.ethereum?.removeListener("disconnect", handleDisconnect);
    };
  }, [provider]);

  const connect = useCallback(async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      setError("No Ethereum provider found. Please install MetaMask.");
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const network = await provider.getNetwork();
      const signer = await provider.getSigner();
      const chainIdNum = Number(network.chainId);

      setProvider(provider);
      setSigner(signer);
      setAccount(accounts[0]);
      setChainId(chainIdNum);

      // 为 localhost (chainId 31337) 创建独立的 readonly provider 以避免缓存
      if (chainIdNum === 31337) {
        const readonlyProv = new JsonRpcProvider("http://localhost:8545");
        setReadonlyProvider(readonlyProv);
      } else {
        setReadonlyProvider(provider);
      }

      // 保存到持久化
      WalletPersistence.save({
        connected: true,
        lastAccounts: accounts,
        lastChainId: chainIdNum,
        lastConnectorId: "injected", // 简化，未实现完整EIP-6963
      });
    } catch (err: any) {
      console.error("Failed to connect wallet:", err);
      setError(err.message || "Failed to connect wallet");
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setProvider(null);
    setReadonlyProvider(null);
    setSigner(null);
    setAccount(null);
    setChainId(null);
    WalletPersistence.clear();
  }, []);

  const switchNetwork = useCallback(async (targetChainId: number) => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${targetChainId.toString(16)}` }],
      });
    } catch (err: any) {
      console.error("Failed to switch network:", err);
      setError(err.message || "Failed to switch network");
    }
  }, []);

  return {
    provider,
    readonlyProvider,
    signer,
    account,
    chainId,
    isConnected: !!account,
    isConnecting,
    error,
    connect,
    disconnect,
    switchNetwork,
  };
}

