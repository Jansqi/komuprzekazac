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
      className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-lg text-sm font-mono transition-colors"
      title="Skopiuj numer KRS"
    >
      KRS {krs}
      <span className="text-xs ml-1">
        {copied ? '✓ Skopiowano' : '📋'}
      </span>
    </button>
  );
}
