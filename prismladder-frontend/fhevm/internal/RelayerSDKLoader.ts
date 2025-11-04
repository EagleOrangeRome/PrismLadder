/**
 * RelayerSDKLoader - 动态加载Zama Relayer SDK (参考frontend/fhevm/internal/RelayerSDKLoader.ts思路)
 * 
 * v0.3.0-5 升级要求：
 * - 使用 UMD 格式 (.umd.cjs)，不使用 ES 模块格式 (.js)
 * - CDN 域名：cdn.zama.org（不是 cdn.zama.ai）
 */

import { SDK_CDN_URL, SDK_LOCAL_URL } from "./constants";

export class RelayerSDKLoader {
  private trace?: (msg: string) => void;

  constructor(options?: { trace?: (msg: string) => void }) {
    this.trace = options?.trace;
  }

  isLoaded(): boolean {
    if (typeof window === "undefined") return false;
    return "relayerSDK" in window && typeof (window as any).relayerSDK === "object";
  }

  async load(): Promise<void> {
    if (typeof window === "undefined") {
      throw new Error("RelayerSDKLoader: can only be used in browser");
    }

    if (this.isLoaded()) {
      this.trace?.("RelayerSDK already loaded");
      return;
    }

    return new Promise((resolve, reject) => {
      // Try loading from local public folder first, fallback to CDN
      const urls = [SDK_LOCAL_URL, SDK_CDN_URL];
      let currentUrlIndex = 0;

      const tryLoad = (url: string) => {
        const existingScript = document.querySelector(`script[src="${url}"]`);
        if (existingScript) {
          if (this.isLoaded()) {
            resolve();
          } else {
            reject(new Error("Script exists but relayerSDK not loaded"));
          }
          return;
        }

        const script = document.createElement("script");
        script.src = url;
        script.type = "text/javascript";
        script.async = true;

        script.onload = () => {
          this.trace?.(`RelayerSDK script loaded from ${url}`);
          if (this.isLoaded()) {
            resolve();
          } else {
            reject(new Error("Script loaded but relayerSDK not available"));
          }
        };

        script.onerror = () => {
          this.trace?.(`Failed to load from ${url}, trying next...`);
          currentUrlIndex++;
          if (currentUrlIndex < urls.length) {
            tryLoad(urls[currentUrlIndex]);
          } else {
            reject(new Error(`Failed to load RelayerSDK from all sources`));
          }
        };

        document.head.appendChild(script);
        this.trace?.(`RelayerSDK script added to DOM from ${url}`);
      };

      tryLoad(urls[currentUrlIndex]);
    });
  }
}

