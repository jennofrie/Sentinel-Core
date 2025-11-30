"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

export default function PWAInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setShowInstallButton(false);
      return;
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Listen for PWA install available event from service worker
    const handlePWAInstallAvailable = (e: any) => {
      setDeferredPrompt(e.detail);
      setShowInstallButton(true);
    };

    window.addEventListener("pwa-install-available", handlePWAInstallAvailable);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("pwa-install-available", handlePWAInstallAvailable);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      console.log("User accepted the install prompt");
    } else {
      console.log("User dismissed the install prompt");
    }

    setDeferredPrompt(null);
    setShowInstallButton(false);
  };

  if (!showInstallButton) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="glass-panel rounded-lg p-4 border border-safe-cyan/30 shadow-lg max-w-sm">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <h3 className="font-bold text-sm mb-1 text-white">Install Sentinel</h3>
            <p className="text-xs text-slate-400 font-mono">
              Add to home screen for quick access
            </p>
          </div>
          <button
            onClick={() => setShowInstallButton(false)}
            className="text-slate-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <button
          onClick={handleInstallClick}
          className="mt-3 w-full px-4 py-2 bg-safe-cyan/20 border border-safe-cyan/50 rounded-lg text-safe-cyan font-bold text-sm hover:bg-safe-cyan/30 transition-colors flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          Install App
        </button>
      </div>
    </div>
  );
}

