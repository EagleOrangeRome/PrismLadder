"use client";

import Link from "next/link";
import { useApp } from "@/app/providers";
import { SUPPORTED_CHAIN_IDS, getChainName } from "@/fhevm/internal/constants";
import { usePathname } from "next/navigation";

export function Navigation() {
  const { wallet } = useApp();
  const pathname = usePathname();

  const getNetworkBadgeColor = () => {
    if (!wallet.chainId) return "bg-gray-500";
    if (wallet.chainId === SUPPORTED_CHAIN_IDS.LOCALHOST || wallet.chainId === SUPPORTED_CHAIN_IDS.SEPOLIA) {
      return "bg-green-500";
    }
    return "bg-amber-500";
  };

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/submit", label: "Submit", icon: "📝" },
    { href: "/analytics", label: "Analytics", icon: "📈" },
    { href: "/profile", label: "Profile", icon: "👤" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-lg border-b border-neutral-200 dark:border-neutral-700/50 shadow-lg">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link 
          href="/" 
          className="flex items-center gap-3 group"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:scale-110 transition-transform">
            P
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            PrismLadder
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 flex items-center gap-2 ${
                isActive(link.href)
                  ? "bg-primary-500 text-white shadow-lg scale-105"
                  : "text-neutral-700 dark:text-neutral-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400"
              }`}
            >
              <span>{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          ))}
        </div>

        {/* Right Side: Network + Wallet */}
        <div className="flex items-center gap-3">
          {/* Network Indicator */}
          {wallet.isConnected && wallet.chainId && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-md">
              <div className={`relative w-2 h-2 rounded-full ${getNetworkBadgeColor()}`}>
                <div className={`absolute inset-0 rounded-full ${getNetworkBadgeColor()} animate-ping opacity-75`}></div>
              </div>
              <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                {getChainName(wallet.chainId)}
              </span>
            </div>
          )}

          {/* Wallet Button */}
          {wallet.isConnected ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/30 dark:to-secondary-900/30 border border-primary-200 dark:border-primary-700 shadow-md">
                <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                <span className="font-mono text-sm font-bold text-neutral-900 dark:text-white">
                  {wallet.account?.slice(0, 6)}...{wallet.account?.slice(-4)}
                </span>
              </div>
              <button
                onClick={wallet.disconnect}
                className="px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-700 transition-all duration-300 hover:scale-105"
              >
                🚪 Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={wallet.connect}
              disabled={wallet.isConnecting}
              className="px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-secondary-500 text-white text-sm font-bold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-105"
            >
              {wallet.isConnecting ? "⏳ Connecting..." : "🔗 Connect Wallet"}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden border-t border-neutral-200 dark:border-neutral-700/50 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-2 flex gap-2 overflow-x-auto scrollbar-hide">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-300 ${
                isActive(link.href)
                  ? "bg-primary-500 text-white shadow-md"
                  : "text-neutral-700 dark:text-neutral-300 hover:bg-primary-50 dark:hover:bg-primary-900/20"
              }`}
            >
              <span>{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
