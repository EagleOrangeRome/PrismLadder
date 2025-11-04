"use client";

import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { useApp } from "../providers";
import { useCompensation } from "@/hooks/useCompensation";

export default function SubmitPage() {
  const { wallet, fhevm } = useApp();
  const compensation = useCompensation();

  const [formData, setFormData] = useState({
    role: 0,
    level: 0,
    geography: 0,
    baseSalary: "",
    bonus: "",
    equity: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!wallet.isConnected) {
      alert("Please connect your wallet first");
      return;
    }

    if (!fhevm.isInitialized) {
      alert("FHEVM is not initialized. Please wait...");
      return;
    }

    const result = await compensation.submitCompensation({
      baseSalary: parseInt(formData.baseSalary) || 0,
      bonus: parseInt(formData.bonus) || 0,
      equity: parseInt(formData.equity) || 0,
      role: formData.role,
      level: formData.level,
      geography: formData.geography,
    });

    if (result?.success) {
      // 清空表单
      setFormData({
        ...formData,
        baseSalary: "",
        bonus: "",
        equity: "",
      });
    }
  };

  const totalComp = (parseInt(formData.baseSalary) || 0) + (parseInt(formData.bonus) || 0) + (parseInt(formData.equity) || 0);

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Submit Your Compensation
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400 text-lg">
                All salary data is encrypted before submission. Your privacy is guaranteed.
              </p>
            </div>
            
            {/* Privacy Notice */}
            <div className="glass p-6 rounded-xl mb-6 border-l-4 border-primary-500 shadow-lg">
              <div className="flex items-start gap-3">
                <div className="text-2xl">🔒</div>
                <div>
                  <h3 className="font-semibold text-primary-700 dark:text-primary-400 mb-1">End-to-End Encryption</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Your exact compensation will never be visible on-chain or to other users. Only encrypted ciphertexts are stored using FHEVM technology.
                  </p>
                </div>
              </div>
            </div>

            {/* Wallet/FHEVM Status */}
            {!wallet.isConnected && (
              <div className="glass p-6 rounded-xl mb-6 border-l-4 border-amber-500 shadow-lg animate-pulse">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">⚠️</div>
                  <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
                    Please connect your wallet to submit compensation data
                  </p>
                </div>
              </div>
            )}

            {wallet.isConnected && !fhevm.isInitialized && (
              <div className="glass p-6 rounded-xl mb-6 border-l-4 border-blue-500 shadow-lg">
                <div className="flex items-start gap-3">
                  <div className="text-2xl animate-spin">🔄</div>
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-400">
                    Initializing FHEVM encryption system... ({fhevm.isLoading ? "Loading" : "Please wait"})
                  </p>
                </div>
              </div>
            )}

            {compensation.message && (
              <div className={`glass p-4 rounded-xl mb-6 shadow-lg border-l-4 ${
                compensation.message.includes('✅') 
                  ? 'border-green-500' 
                  : compensation.message.includes('❌') 
                  ? 'border-red-500' 
                  : 'border-blue-500'
              }`}>
                <p className="text-sm font-medium">{compensation.message}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="glass p-8 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-xl">
                    👤
                  </div>
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Basic Information</h2>
                </div>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-neutral-700 dark:text-neutral-300">
                      🎯 Role/Job Title
                    </label>
                    <select 
                      className="w-full px-4 py-3 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800 transition-all duration-300 font-medium"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: parseInt(e.target.value) })}
                    >
                      <option value={0}>Software Engineer</option>
                      <option value={1}>Product Manager</option>
                      <option value={2}>Designer</option>
                      <option value={3}>Sales</option>
                      <option value={4}>HR</option>
                      <option value={5}>Executive</option>
                      <option value={6}>Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-neutral-700 dark:text-neutral-300">
                      📊 Level/Grade
                    </label>
                    <select 
                      className="w-full px-4 py-3 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800 transition-all duration-300 font-medium"
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })}
                    >
                      <option value={0}>Junior (L1-L2)</option>
                      <option value={1}>Mid (L3-L4)</option>
                      <option value={2}>Senior (L5-L6)</option>
                      <option value={3}>Staff/Principal (L7+)</option>
                      <option value={4}>Manager</option>
                      <option value={5}>Director</option>
                      <option value={6}>VP/Executive</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-neutral-700 dark:text-neutral-300">
                      🌍 Geography
                    </label>
                    <select 
                      className="w-full px-4 py-3 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800 transition-all duration-300 font-medium"
                      value={formData.geography}
                      onChange={(e) => setFormData({ ...formData, geography: parseInt(e.target.value) })}
                    >
                      <option value={0}>North America</option>
                      <option value={1}>Europe</option>
                      <option value={2}>Asia-Pacific</option>
                      <option value={3}>Latin America</option>
                      <option value={4}>Middle East/Africa</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Compensation Details */}
              <div className="glass p-8 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white text-xl">
                    💰
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Compensation Details</h2>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">All values will be encrypted</p>
                  </div>
                </div>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-neutral-700 dark:text-neutral-300">
                      💵 Base Salary (USD/year)
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 font-bold">$</span>
                      <input
                        type="number"
                        placeholder="120000"
                        className="w-full pl-8 pr-4 py-3 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-800 transition-all duration-300 font-medium"
                        value={formData.baseSalary}
                        onChange={(e) => setFormData({ ...formData, baseSalary: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-neutral-700 dark:text-neutral-300">
                      🎁 Annual Bonus (USD)
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 font-bold">$</span>
                      <input
                        type="number"
                        placeholder="20000"
                        className="w-full pl-8 pr-4 py-3 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-800 transition-all duration-300 font-medium"
                        value={formData.bonus}
                        onChange={(e) => setFormData({ ...formData, bonus: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-neutral-700 dark:text-neutral-300">
                      📈 Equity/Stock Value (Annual vesting, USD)
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 font-bold">$</span>
                      <input
                        type="number"
                        placeholder="50000"
                        className="w-full pl-8 pr-4 py-3 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-800 transition-all duration-300 font-medium"
                        value={formData.equity}
                        onChange={(e) => setFormData({ ...formData, equity: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Total Compensation Display */}
                  <div className="pt-6 border-t-2 border-neutral-200 dark:border-neutral-700">
                    <div className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/30 dark:to-secondary-900/30 p-6 rounded-xl">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-neutral-700 dark:text-neutral-300">💼 Total Compensation:</span>
                        <span className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                          ${totalComp.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                        This total will be encrypted and stored securely on-chain
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={compensation.isSubmitting || !wallet.isConnected || !fhevm.isInitialized}
                className="w-full px-8 py-4 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-500 hover:to-secondary-500 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {compensation.isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">🔄</span>
                    Encrypting & Submitting...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    🔐 Encrypt & Submit to Blockchain
                  </span>
                )}
              </button>

              {/* Info Footer */}
              <div className="text-center text-sm text-neutral-500 dark:text-neutral-400">
                <p>🛡️ Protected by FHEVM | 🔒 Zero-Knowledge Privacy | ⛓️ Immutable Records</p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
