"use client";

import { useState, useCallback, useEffect } from "react";
import { Contract, ethers } from "ethers";
import { useApp } from "@/app/providers";
import { PrismLadderCompensationABI } from "@/abi/PrismLadderCompensationABI";
import { getContractAddress } from "@/abi/PrismLadderCompensationAddresses";

export function useCompensation() {
  const { wallet, fhevm } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [userMetadata, setUserMetadata] = useState<any>(null);
  const [isRequestingInsight, setIsRequestingInsight] = useState(false);
  const [insightMessage, setInsightMessage] = useState("");
  const [decryptedInsight, setDecryptedInsight] = useState<string | null>(null);
  const [totalSubmissions, setTotalSubmissions] = useState<number>(0);

  const contractAddress = wallet.chainId ? getContractAddress(wallet.chainId) : undefined;

  // 获取用户元数据
  const fetchUserMetadata = useCallback(async () => {
    const provider = wallet.readonlyProvider || wallet.provider;
    if (!provider || !contractAddress || !wallet.account) return;

    try {
      // 使用 readonlyProvider 来避免缓存问题
      const contract = new Contract(contractAddress, PrismLadderCompensationABI, provider);
      const metadata = await contract.getUserMetadata(wallet.account);
      
      setUserMetadata({
        role: Number(metadata.role),
        level: Number(metadata.level),
        geography: Number(metadata.geography),
        timestamp: Number(metadata.timestamp),
        isActive: metadata.isActive,
      });
    } catch (err) {
      console.error("Failed to fetch user metadata:", err);
    }
  }, [wallet.readonlyProvider, wallet.provider, contractAddress, wallet.account]);

  useEffect(() => {
    fetchUserMetadata();
  }, [fetchUserMetadata]);

  // 获取总提交数
  const fetchTotalSubmissions = useCallback(async () => {
    const provider = wallet.readonlyProvider || wallet.provider;
    if (!provider || !contractAddress) return;

    try {
      const contract = new Contract(contractAddress, PrismLadderCompensationABI, provider);
      const total = await contract.getTotalSubmissions();
      setTotalSubmissions(Number(total));
    } catch (err) {
      console.error("Failed to fetch total submissions:", err);
    }
  }, [wallet.readonlyProvider, wallet.provider, contractAddress]);

  useEffect(() => {
    fetchTotalSubmissions();
  }, [fetchTotalSubmissions]);

  // 获取特定群组的统计数据
  const getGroupStats = useCallback(
    async (role: number, level: number, geography: number) => {
      const provider = wallet.readonlyProvider || wallet.provider;
      if (!provider || !contractAddress) return null;

      try {
        const contract = new Contract(contractAddress, PrismLadderCompensationABI, provider);
        const count = await contract.getGroupCount(role, level, geography);
        return {
          role,
          level,
          geography,
          count: Number(count),
        };
      } catch (err) {
        console.error("Failed to fetch group stats:", err);
        return null;
      }
    },
    [wallet.readonlyProvider, wallet.provider, contractAddress]
  );

  const submitCompensation = useCallback(
    async (data: {
      baseSalary: number;
      bonus: number;
      equity: number;
      role: number;
      level: number;
      geography: number;
    }) => {
      if (!fhevm.instance || !wallet.signer || !contractAddress) {
        setMessage("FHEVM instance or wallet not ready");
        return;
      }

      setIsSubmitting(true);
      setMessage("Encrypting compensation data...");

      try {
        // 创建加密输入
        const input = fhevm.instance.createEncryptedInput(contractAddress, wallet.account!);
        input.add64(data.baseSalary);
        input.add64(data.bonus);
        input.add64(data.equity);

        setMessage("Generating proof...");
        const encryptedData = await input.encrypt();

        setMessage("Submitting to contract...");
        const contract = new Contract(contractAddress, PrismLadderCompensationABI, wallet.signer);

        const tx = await contract.submitCompensation(
          encryptedData.handles[0], // baseSalary
          encryptedData.handles[1], // bonus
          encryptedData.handles[2], // equity
          encryptedData.inputProof,
          encryptedData.inputProof,
          encryptedData.inputProof,
          data.role,
          data.level,
          data.geography
        );

        setMessage(`Waiting for confirmation... (tx: ${tx.hash})`);
        const receipt = await tx.wait();

        setMessage(`✅ Submission successful! Block: ${receipt?.blockNumber}`);
        
        // 刷新用户元数据
        setTimeout(() => {
          fetchUserMetadata();
        }, 2000);

        return { success: true, txHash: tx.hash };
      } catch (err: any) {
        console.error("Failed to submit compensation:", err);
        setMessage(`❌ Submission failed: ${err.message || "Unknown error"}`);
        return { success: false, error: err.message };
      } finally {
        setIsSubmitting(false);
      }
    },
    [fhevm.instance, wallet.signer, wallet.account, contractAddress, fetchUserMetadata]
  );

  const requestPersonalInsight = useCallback(
    async (metric: string = "vs_median") => {
      if (!fhevm.instance || !wallet.signer || !contractAddress || !wallet.account) {
        setInsightMessage("FHEVM instance or wallet not ready");
        return;
      }

      setIsRequestingInsight(true);
      setInsightMessage("Requesting personal insight from contract...");
      setDecryptedInsight(null);

      try {
        const contract = new Contract(contractAddress, PrismLadderCompensationABI, wallet.signer);

        // 调用合约的 requestPersonalInsight
        const tx = await contract.requestPersonalInsight(metric);
        setInsightMessage(`Waiting for confirmation... (tx: ${tx.hash})`);
        const receipt = await tx.wait();

        setInsightMessage("Fetching encrypted result handle...");
        
        // 读取 personalInsights mapping 的加密句柄
        const personalInsightsHandle = await contract.personalInsights(wallet.account, metric);

        setInsightMessage("Generating decryption keypair...");
        
        // 生成解密密钥对
        const { publicKey, privateKey } = fhevm.instance.generateKeypair();

        setInsightMessage("Signing EIP-712 message for decryption...");
        
        // 使用 FHEVM SDK 创建正确的 EIP-712 签名
        const startTimestamp = Math.floor(Date.now() / 1000);
        const durationDays = 7;
        
        const eip712 = fhevm.instance.createEIP712(
          publicKey,
          [contractAddress],
          startTimestamp,
          durationDays
        );

        const signature = await wallet.signer.signTypedData(
          eip712.domain,
          { UserDecryptRequestVerification: eip712.types.UserDecryptRequestVerification },
          eip712.message
        );

        setInsightMessage("Decrypting your personal insight...");
        
        // 使用 FHEVM userDecrypt
        const decryptedValues = await fhevm.instance.userDecrypt(
          [{ handle: personalInsightsHandle.toString(), contractAddress }],
          privateKey,
          publicKey,
          signature,
          [contractAddress],
          wallet.account,
          startTimestamp,
          durationDays
        );
        
        const decryptedValue = decryptedValues[personalInsightsHandle.toString()];
        
        setDecryptedInsight(decryptedValue.toString());
        setInsightMessage(`✅ Insight revealed! Your ${metric} difference from group average: ${decryptedValue.toString()}`);

        return { success: true, value: decryptedValue.toString() };
      } catch (err: any) {
        console.error("Failed to request personal insight:", err);
        setInsightMessage(`❌ Failed: ${err.message || "Unknown error"}`);
        return { success: false, error: err.message };
      } finally {
        setIsRequestingInsight(false);
      }
    },
    [fhevm.instance, wallet.signer, wallet.account, contractAddress, wallet.chainId]
  );

  return {
    contractAddress,
    isSubmitting,
    message,
    userMetadata,
    submitCompensation,
    refreshMetadata: fetchUserMetadata,
    requestPersonalInsight,
    isRequestingInsight,
    insightMessage,
    decryptedInsight,
    totalSubmissions,
    getGroupStats,
    refreshTotalSubmissions: fetchTotalSubmissions,
  };
}

