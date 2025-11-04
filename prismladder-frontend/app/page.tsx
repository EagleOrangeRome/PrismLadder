"use client";

import { useApp } from "./providers";
import { Navigation } from "@/components/Navigation";
import Link from "next/link";

export default function HomePage() {
  const { wallet } = useApp();

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-300/20 dark:bg-primary-600/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-300/20 dark:bg-secondary-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        </div>

        {/* Hero Section */}
        <div className="relative z-10 container mx-auto px-4 pt-32 pb-20">
          <div className="text-center max-w-5xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm rounded-full border border-primary-200 dark:border-primary-700/50 shadow-lg mb-8 animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
              </span>
              <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                Powered by FHEVM • On-Chain Privacy
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold mb-6 text-neutral-900 dark:text-white tracking-tight leading-tight">
              <span className="bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent">
                PrismLadder
              </span>
            </h1>
            
            <p className="text-2xl md:text-3xl font-bold mb-4 text-neutral-800 dark:text-neutral-100">
              Fair Pay, Full Privacy
            </p>
            
            <p className="text-lg md:text-xl mb-10 text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto leading-relaxed">
              Transform compensation transparency with encrypted on-chain analytics. 
              Reveal fairness insights without compromising individual privacy.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 justify-center items-center">
              {wallet.isConnected ? (
                <>
                  <Link 
                    href="/dashboard"
                    className="group relative px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      🚀 Go to Dashboard
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </Link>
                  <Link
                    href="/submit"
                    className="px-8 py-4 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm text-primary-600 dark:text-primary-400 border-2 border-primary-300 dark:border-primary-600 rounded-xl font-bold text-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-300 hover:scale-105"
                  >
                    📊 Submit Salary
                  </Link>
                </>
              ) : (
                <>
                  <button 
                    onClick={wallet.connect}
                    disabled={wallet.isConnecting}
                    className="group relative px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                  >
                    <span className="relative z-10">
                      {wallet.isConnecting ? "⏳ Connecting..." : "🔗 Connect Wallet"}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-secondary-600 to-secondary-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </button>
                  <button className="px-8 py-4 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm text-primary-600 dark:text-primary-400 border-2 border-primary-300 dark:border-primary-600 rounded-xl font-bold text-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-300 hover:scale-105">
                    📖 Learn More
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="group relative bg-white/60 dark:bg-neutral-800/60 backdrop-blur-xl p-8 rounded-2xl border border-white/20 dark:border-neutral-700/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center text-4xl mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  🔐
                </div>
                <h3 className="text-2xl font-bold mb-4 text-neutral-900 dark:text-white">
                  Submit Privately
                </h3>
                <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  Your salary data is encrypted locally before touching the blockchain. Only you hold the decryption key.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative bg-white/60 dark:bg-neutral-800/60 backdrop-blur-xl p-8 rounded-2xl border border-white/20 dark:border-neutral-700/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl flex items-center justify-center text-4xl mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  📊
                </div>
                <h3 className="text-2xl font-bold mb-4 text-neutral-900 dark:text-white">
                  Fair Analytics
                </h3>
                <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  View statistical distributions across roles, levels, and demographics without exposing individuals.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative bg-white/60 dark:bg-neutral-800/60 backdrop-blur-xl p-8 rounded-2xl border border-white/20 dark:border-neutral-700/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-accent-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center text-4xl mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  🔑
                </div>
                <h3 className="text-2xl font-bold mb-4 text-neutral-900 dark:text-white">
                  Your Control
                </h3>
                <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  Choose what to decrypt: your percentile position, group comparisons, or nothing at all.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-neutral-900 dark:text-white">
              How It Works
            </h2>
            
            <div className="space-y-8">
              {[
                { number: "1", title: "Connect Wallet", desc: "Sign with MetaMask or any EIP-6963 compatible wallet", icon: "🔗" },
                { number: "2", title: "Encrypt & Submit", desc: "Enter compensation details, encrypted with FHEVM public key", icon: "🔐" },
                { number: "3", title: "View Insights", desc: "Explore aggregate fairness metrics and personal positioning", icon: "📈" },
                { number: "4", title: "Take Action", desc: "Share insights with leadership or use for internal advocacy", icon: "🎯" }
              ].map((step, idx) => (
                <div key={idx} className="flex items-start gap-6 p-6 bg-white/40 dark:bg-neutral-800/40 backdrop-blur-lg rounded-2xl border border-white/20 dark:border-neutral-700/50 hover:shadow-xl transition-all duration-300 hover:scale-102">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg">
                      {step.number}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">{step.icon}</span>
                      <h3 className="font-bold text-xl text-neutral-900 dark:text-white">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-neutral-600 dark:text-neutral-400 text-lg">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600 rounded-3xl p-12 shadow-2xl text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to transform compensation transparency?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join the privacy-first fairness revolution
            </p>
            {wallet.isConnected ? (
              <Link 
                href="/submit"
                className="inline-block px-10 py-4 bg-white text-primary-600 rounded-xl font-bold text-lg hover:bg-neutral-100 transition-all duration-300 hover:scale-105 shadow-xl"
              >
                🚀 Submit Your Salary
              </Link>
            ) : (
              <button 
                onClick={wallet.connect}
                className="px-10 py-4 bg-white text-primary-600 rounded-xl font-bold text-lg hover:bg-neutral-100 transition-all duration-300 hover:scale-105 shadow-xl"
              >
                🔗 Get Started Now
              </button>
            )}
          </div>
        </div>

        {/* Stats Footer */}
        <div className="relative z-10 container mx-auto px-4 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
            <div className="p-6 bg-white/40 dark:bg-neutral-800/40 backdrop-blur-lg rounded-2xl border border-white/20 dark:border-neutral-700/50">
              <div className="text-5xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent mb-2">100%</div>
              <div className="text-lg font-medium text-neutral-700 dark:text-neutral-300">Privacy Guaranteed</div>
            </div>
            <div className="p-6 bg-white/40 dark:bg-neutral-800/40 backdrop-blur-lg rounded-2xl border border-white/20 dark:border-neutral-700/50">
              <div className="text-5xl font-bold bg-gradient-to-r from-secondary-600 to-secondary-500 bg-clip-text text-transparent mb-2">0</div>
              <div className="text-lg font-medium text-neutral-700 dark:text-neutral-300">Data Leaks Ever</div>
            </div>
            <div className="p-6 bg-white/40 dark:bg-neutral-800/40 backdrop-blur-lg rounded-2xl border border-white/20 dark:border-neutral-700/50">
              <div className="text-5xl font-bold bg-gradient-to-r from-accent-600 to-accent-500 bg-clip-text text-transparent mb-2">∞</div>
              <div className="text-lg font-medium text-neutral-700 dark:text-neutral-300">Trust Level</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
