"use client";

import Link from "next/link";
import { Navigation } from "@/components/Navigation";
import { useApp } from "../providers";
import { useCompensation } from "@/hooks/useCompensation";

export default function DashboardPage() {
  const { wallet } = useApp();
  const { userMetadata } = useCompensation();

  const roleNames = ["Software Engineer", "Product Manager", "Designer", "Sales", "HR", "Executive", "Other"];
  const levelNames = ["Junior", "Mid", "Senior", "Staff/Principal", "Manager", "Director", "VP/Executive"];
  const geoNames = ["North America", "Europe", "Asia-Pacific", "Latin America", "Middle East/Africa"];

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400">
                Welcome back! Here's your compensation transparency overview.
              </p>
            </div>

            {!wallet.isConnected && (
              <div className="glass p-8 rounded-2xl border-l-4 border-amber-500 mb-6 shadow-xl">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">🔗</div>
                  <div>
                    <h2 className="text-xl font-semibold mb-2">Connect Your Wallet</h2>
                    <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                      Please connect your wallet to view your dashboard and submit compensation data.
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
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Participation Summary */}
              <div className="glass p-8 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-700 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-2xl">
                    📊
                  </div>
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Participation</h2>
                </div>
                
                {userMetadata && userMetadata.isActive ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-semibold flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        Active Submission
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">Role</p>
                        <p className="font-semibold text-neutral-900 dark:text-white">{roleNames[userMetadata.role]}</p>
                      </div>
                      <div className="p-3 bg-secondary-50 dark:bg-secondary-900/20 rounded-lg">
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">Level</p>
                        <p className="font-semibold text-neutral-900 dark:text-white">{levelNames[userMetadata.level]}</p>
                      </div>
                      <div className="p-3 bg-accent-50 dark:bg-accent-900/20 rounded-lg">
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">Geography</p>
                        <p className="font-semibold text-neutral-900 dark:text-white">{geoNames[userMetadata.geography]}</p>
                      </div>
                      <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">Last Update</p>
                        <p className="font-semibold text-neutral-900 dark:text-white">
                          {new Date(userMetadata.timestamp * 1000).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <Link
                      href="/submit"
                      className="block w-full mt-4 px-4 py-2.5 text-center bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-900/40 font-semibold transition-all duration-300"
                    >
                      🔄 Update Submission
                    </Link>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">📝</div>
                    <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                      You haven't submitted your compensation data yet
                    </p>
                    <Link
                      href="/submit"
                      className="inline-block px-8 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:from-primary-500 hover:to-secondary-500 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Submit Your Salary
                    </Link>
                  </div>
                )}
              </div>

              {/* Fairness Score */}
              <div className="glass p-8 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-700 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white text-2xl">
                    ⚖️
                  </div>
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Fairness Score</h2>
                </div>
                
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">📊</div>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                    Fairness analysis requires sufficient submissions across different groups
                  </p>
                  <div className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">
                      💡 Based on encrypted gap analysis across roles, levels, and geographies
                    </p>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="glass p-8 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-700 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl">
                    🕐
                  </div>
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Activity</h2>
                </div>
                
                <div className="space-y-3">
                  {userMetadata?.isActive ? (
                    <>
                      <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="text-xl">✅</div>
                        <div>
                          <p className="font-semibold text-neutral-900 dark:text-white text-sm">Active Submission</p>
                          <p className="text-xs text-neutral-600 dark:text-neutral-400">
                            Contributing to analytics
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="text-xl">🔒</div>
                        <div>
                          <p className="font-semibold text-neutral-900 dark:text-white text-sm">Privacy Guaranteed</p>
                          <p className="text-xs text-neutral-600 dark:text-neutral-400">
                            Data encrypted with FHEVM
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
                      <div className="text-4xl mb-2">📭</div>
                      <p className="text-sm">No recent activity</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="glass p-8 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-700 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-2xl">
                    ⚡
                  </div>
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Quick Actions</h2>
                </div>
                
                <div className="space-y-3">
                  <Link
                    href="/submit"
                    className="flex items-center gap-3 w-full px-4 py-3 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-secondary-500 text-white rounded-lg transition-all duration-300 font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    <span className="text-xl">📝</span>
                    <span>Submit Salary</span>
                  </Link>
                  
                  <Link
                    href="/analytics"
                    className="flex items-center gap-3 w-full px-4 py-3 bg-white dark:bg-neutral-800 border-2 border-primary-500 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-300 font-semibold transform hover:scale-105"
                  >
                    <span className="text-xl">📈</span>
                    <span>View Analytics</span>
                  </Link>
                  
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 w-full px-4 py-3 bg-white dark:bg-neutral-800 border-2 border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-all duration-300 font-semibold transform hover:scale-105"
                  >
                    <span className="text-xl">👤</span>
                    <span>Personal Insights</span>
                  </Link>
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-lg">
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 text-center">
                    💡 All data is encrypted end-to-end using FHEVM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
