"use client";

import { Navigation } from "@/components/Navigation";
import { useCompensation } from "@/hooks/useCompensation";
import { useApp } from "../providers";
import { useEffect, useState } from "react";

export default function AnalyticsPage() {
  const { wallet } = useApp();
  const { totalSubmissions, getGroupStats } = useCompensation();
  const [groupStats, setGroupStats] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const roleNames = ["Software Engineer", "Product Manager", "Designer", "Sales", "HR", "Executive", "Other"];
  const levelNames = ["Junior", "Mid", "Senior", "Staff/Principal", "Manager", "Director", "VP/Executive"];
  const geoNames = ["North America", "Europe", "Asia-Pacific", "Latin America", "Middle East/Africa"];

  useEffect(() => {
    const loadGroupStats = async () => {
      const provider = wallet.readonlyProvider || wallet.provider;
      if (!getGroupStats || !provider) return;
      
      setIsLoading(true);
      const stats = [];
      
      // 查询一些常见组合的统计数据
      for (let role = 0; role < 7; role++) { // 查询所有角色
        for (let level = 0; level < 7; level++) { // 查询所有级别
          for (let geo = 0; geo < 5; geo++) { // 查询所有地区
            const stat = await getGroupStats(role, level, geo);
            if (stat && stat.count > 0) {
              stats.push(stat);
            }
          }
        }
      }
      
      setGroupStats(stats);
      setIsLoading(false);
    };

    loadGroupStats();
  }, [getGroupStats, wallet.readonlyProvider, wallet.provider]);

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Analytics Dashboard
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Real-time compensation analytics powered by encrypted data
            </p>
          </div>

          {!wallet.isConnected ? (
            <div className="glass p-8 rounded-2xl border-l-4 border-amber-500 shadow-xl">
              <div className="flex items-start gap-4">
                <div className="text-4xl">🔗</div>
                <div>
                  <h2 className="text-xl font-semibold mb-2">Connect Your Wallet</h2>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                    Please connect your wallet to view analytics.
                  </p>
                  <button
                    onClick={wallet.connect}
                    className="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-lg hover:from-primary-500 hover:to-secondary-500 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                  >
                    Connect Wallet
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Total Submissions */}
              <div className="glass p-8 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-700 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-2xl">
                    📊
                  </div>
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Total Submissions</h2>
                </div>
                <div className="mt-4 text-center">
                  <p className="text-7xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-2">
                    {totalSubmissions}
                  </p>
                  <p className="text-neutral-600 dark:text-neutral-400 font-medium">
                    {totalSubmissions === 0 
                      ? "No submissions yet" 
                      : totalSubmissions === 1 
                      ? "submission from all participants" 
                      : "submissions from all participants"}
                  </p>
                </div>
                <div className="mt-6 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                  <p className="text-xs text-center text-neutral-600 dark:text-neutral-400">
                    🔒 All data encrypted with FHEVM
                  </p>
                </div>
              </div>

              {/* Active Groups */}
              <div className="glass p-8 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-700 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white text-2xl">
                    👥
                  </div>
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Active Groups</h2>
                </div>
                <div className="mt-4 text-center">
                  <p className="text-7xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
                    {groupStats.length}
                  </p>
                  <p className="text-neutral-600 dark:text-neutral-400 font-medium">
                    {groupStats.length === 0 
                      ? "No active groups yet" 
                      : groupStats.length === 1 
                      ? "group with submissions" 
                      : "groups with submissions"}
                  </p>
                </div>
                <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-xs text-center text-neutral-600 dark:text-neutral-400">
                    📈 Growing transparency network
                  </p>
                </div>
              </div>

              {/* Group Distribution */}
              <div className="glass p-8 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-700 md:col-span-2">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl">
                    📈
                  </div>
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Group Distribution</h2>
                </div>
                
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4 animate-pulse">⏳</div>
                    <p className="text-neutral-600 dark:text-neutral-400">Loading group statistics...</p>
                  </div>
                ) : groupStats.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📭</div>
                    <p className="text-neutral-600 dark:text-neutral-400 mb-4">No group data available yet</p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-500">Submit your salary to start building transparency!</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary-300 scrollbar-track-neutral-100">
                    {groupStats.map((stat, idx) => (
                      <div 
                        key={idx} 
                        className="p-5 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-xl border border-primary-200 dark:border-primary-700/50 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xl">💼</span>
                              <p className="font-bold text-neutral-900 dark:text-white">
                                {roleNames[stat.role]}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                              <span>📊 {levelNames[stat.level]}</span>
                              <span>•</span>
                              <span>🌍 {geoNames[stat.geography]}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                              {stat.count}
                            </p>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                              {stat.count === 1 ? "submission" : "submissions"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Privacy-Preserving Analytics */}
              <div className="glass p-8 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-700 md:col-span-2">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-2xl">
                    🔐
                  </div>
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Privacy-Preserving Technology</h2>
                </div>
                
                <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                  All salary data is encrypted using Fully Homomorphic Encryption (FHE). 
                  The statistics shown above are computed on encrypted data without revealing individual salaries.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20 rounded-xl border border-green-200 dark:border-green-700/50 hover:shadow-lg transition-all duration-300">
                    <div className="text-3xl mb-3">🔒</div>
                    <p className="text-sm font-bold text-green-800 dark:text-green-300 mb-2">Encrypted Inputs</p>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">
                      All submissions are encrypted client-side before reaching the blockchain
                    </p>
                  </div>
                  
                  <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 rounded-xl border border-blue-200 dark:border-blue-700/50 hover:shadow-lg transition-all duration-300">
                    <div className="text-3xl mb-3">⚙️</div>
                    <p className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-2">Homomorphic Computation</p>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">
                      Statistics are computed on encrypted data without decryption
                    </p>
                  </div>
                  
                  <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/20 rounded-xl border border-purple-200 dark:border-purple-700/50 hover:shadow-lg transition-all duration-300">
                    <div className="text-3xl mb-3">🔑</div>
                    <p className="text-sm font-bold text-purple-800 dark:text-purple-300 mb-2">Controlled Decryption</p>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">
                      Only you can decrypt your personal insights with your signature
                    </p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-lg border border-primary-200 dark:border-primary-700/50">
                  <p className="text-xs text-center text-neutral-600 dark:text-neutral-400">
                    💡 <strong>FHEVM Technology</strong>: Your data remains encrypted at all times, even during computation
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
