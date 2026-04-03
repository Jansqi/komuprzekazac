'use client';

import { useState } from 'react';

export default function CopyKRS({ krs }: { krs: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(krs);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#00b9fb]/10 hover:bg-[#00b9fb]/20 text-[#00b9fb] rounded-lg text-sm font-mono transition-colors"
      aria-label={`Skopiuj numer KRS ${krs}`}
    >
      KRS {krs}
      <span className="text-xs ml-1" aria-live="polite">
        {copied ? '✓ Skopiowano' : <span aria-hidden="true">📋</span>}
      </span>
    </button>
  );
}
