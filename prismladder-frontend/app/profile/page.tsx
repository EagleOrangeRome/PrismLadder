"use client";

import Link from "next/link";
import { Navigation } from "@/components/Navigation";
import { useCompensation } from "@/hooks/useCompensation";

export default function ProfilePage() {
  const { 
    userMetadata, 
    requestPersonalInsight, 
    isRequestingInsight, 
    insightMessage, 
    decryptedInsight 
  } = useCompensation();

  const roleNames = ["Software Engineer", "Product Manager", "Designer", "Sales", "HR", "Executive", "Other"];
  const levelNames = ["Junior", "Mid", "Senior", "Staff/Principal", "Manager", "Director", "VP/Executive"];
  const geoNames = ["North America", "Europe", "Asia-Pacific", "Latin America", "Middle East/Africa"];

  const handleRevealPosition = async () => {
    await requestPersonalInsight("vs_median");
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Your Personal Insights
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400">
                Private, encrypted insights about your compensation position
              </p>
            </div>

            <div className="space-y-6">
              {/* Submission Summary */}
              <div className="glass p-8 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-700 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-2xl">
                    📋
                  </div>
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Your Submission</h2>
                </div>
                
                {userMetadata && userMetadata.isActive ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-semibold flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        Active
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/20 rounded-xl border border-primary-200 dark:border-primary-700/50">
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">Role</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xl">💼</span>
                          <p className="font-bold text-neutral-900 dark:text-white">{roleNames[userMetadata.role]}</p>
                        </div>
                      </div>

                      <div className="p-4 bg-gradient-to-br from-secondary-50 to-secondary-100 dark:from-secondary-900/30 dark:to-secondary-800/20 rounded-xl border border-secondary-200 dark:border-secondary-700/50">
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">Level</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xl">📊</span>
                          <p className="font-bold text-neutral-900 dark:text-white">{levelNames[userMetadata.level]}</p>
                        </div>
                      </div>

                      <div className="p-4 bg-gradient-to-br from-accent-50 to-accent-100 dark:from-accent-900/30 dark:to-accent-800/20 rounded-xl border border-accent-200 dark:border-accent-700/50">
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">Geography</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🌍</span>
                          <p className="font-bold text-neutral-900 dark:text-white">{geoNames[userMetadata.geography]}</p>
                        </div>
                      </div>

                      <div className="p-4 bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-700 rounded-xl border border-neutral-300 dark:border-neutral-600">
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">Last Update</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xl">📅</span>
                          <p className="font-bold text-neutral-900 dark:text-white">
                            {new Date(userMetadata.timestamp * 1000).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <Link
                      href="/submit"
                      className="block w-full mt-4 px-6 py-3 text-center bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-xl hover:bg-primary-200 dark:hover:bg-primary-900/40 font-semibold transition-all duration-300 transform hover:scale-[1.02]"
                    >
                      🔄 Update Submission
                    </Link>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">📝</div>
                    <p className="text-neutral-600 dark:text-neutral-400 mb-2">No submission yet</p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-500 mb-6">
                      Submit your compensation data to unlock insights
                    </p>
                    <Link
                      href="/submit"
                      className="inline-block px-8 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-xl hover:from-primary-500 hover:to-secondary-500 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Submit Now
                    </Link>
                  </div>
                )}
              </div>

              {/* Position in Distribution */}
              <div className="glass p-8 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-700 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white text-2xl">
                    🎯
                  </div>
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Your Position</h2>
                </div>
                
                {!userMetadata?.isActive ? (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">🔒</div>
                    <p className="text-neutral-600 dark:text-neutral-400 mb-2">
                      Insights Locked
                    </p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-500">
                      Submit your salary data to unlock personal insights
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 rounded-xl border border-blue-200 dark:border-blue-700/50">
                      <p className="text-sm text-neutral-700 dark:text-neutral-300">
                        🔍 Compare your total compensation to your peer group average
                      </p>
                    </div>
                    
                    {insightMessage && (
                      <div className={`p-5 rounded-xl border-2 ${
                        insightMessage.includes('✅') 
                          ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700' 
                          : insightMessage.includes('❌')
                          ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
                          : 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700'
                      }`}>
                        <p className="text-sm font-medium">{insightMessage}</p>
                      </div>
                    )}

                    {decryptedInsight && (
                      <div className="p-8 bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/40 dark:to-secondary-900/40 rounded-2xl border-2 border-primary-300 dark:border-primary-700 shadow-lg">
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                          Difference from group average:
                        </p>
                        <div className="flex items-center gap-3 mb-3">
                          {Number(decryptedInsight) >= 0 ? (
                            <>
                              <span className="text-4xl">📈</span>
                              <p className="text-4xl font-bold text-green-600 dark:text-green-400">
                                +${Number(decryptedInsight).toLocaleString()}
                              </p>
                            </>
                          ) : (
                            <>
                              <span className="text-4xl">📉</span>
                              <p className="text-4xl font-bold text-red-600 dark:text-red-400">
                                -${Math.abs(Number(decryptedInsight)).toLocaleString()}
                              </p>
                            </>
                          )}
                        </div>
                        <div className="p-3 bg-white/50 dark:bg-neutral-800/50 rounded-lg">
                          <p className="text-xs text-neutral-600 dark:text-neutral-400">
                            💡 This represents how much your total compensation (base + bonus + equity) 
                            differs from your peer group average. All calculations are performed on encrypted data.
                          </p>
                        </div>
                      </div>
                    )}

                    <button 
                      onClick={handleRevealPosition}
                      disabled={isRequestingInsight}
                      className="w-full px-8 py-4 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-500 hover:to-secondary-500 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {isRequestingInsight ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="animate-spin">🔄</span>
                          Decrypting Your Insight...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          🔓 Reveal My Position
                        </span>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Privacy Notice */}
              <div className="glass p-8 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-2xl">
                    🛡️
                  </div>
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Privacy Guarantee</h2>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-xl">🔒</div>
                    <div>
                      <p className="font-semibold text-neutral-900 dark:text-white text-sm mb-1">End-to-End Encryption</p>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400">
                        Your salary data is encrypted client-side before submission
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-xl">🔐</div>
                    <div>
                      <p className="font-semibold text-neutral-900 dark:text-white text-sm mb-1">Controlled Decryption</p>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400">
                        Only you can decrypt your personal insights with your signature
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="text-xl">⛓️</div>
                    <div>
                      <p className="font-semibold text-neutral-900 dark:text-white text-sm mb-1">Blockchain Immutability</p>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400">
                        Your encrypted data is securely stored on-chain, permanently private
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
