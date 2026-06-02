"use client";

import { LoadingIcon } from "tdesign-icons-react";

export function LoadingOverlay() {
  return (
    <div className="loading-overlay">
      <LoadingIcon className="w-10 h-10 text-[var(--mia-gold)] animate-spin mb-4" />
      <div className="text-(--mia-ink) font-display tracking-widest">
        CONNECTING TO CATHEDRAL...
      </div>
      <div className="text-(--mia-gold-deep) text-xs mt-2 font-serif-cn">
        SYNCING CONFIGURATION FILES
      </div>
    </div>
  );
}
