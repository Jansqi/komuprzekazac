'use client';

import { useState } from 'react';

export default function NiwLink({ krs }: { krs: string }) {
  const [copied, setCopied] = useState(false);

  const handleClick = async () => {
    await navigator.clipboard.writeText(krs);
    setCopied(true);
    setTimeout(() => setCopied(false), 3500);
    window.open('https://sprawozdaniaopp.niw.gov.pl/', '_blank', 'noopener');
  };

  return (
    <span className="relative inline-block">
      <button
        onClick={handleClick}
        className="text-sm text-[#00b9fb] hover:text-[#009dd4] underline cursor-pointer"
        aria-label={`Otwórz sprawozdanie w NIW i skopiuj KRS ${krs}`}
      >
        📄 Sprawozdanie w NIW
      </button>
      {copied && (
        <span
          role="status"
          className="absolute left-0 top-full mt-1 whitespace-nowrap bg-gray-900 text-white text-xs rounded-lg px-3 py-1.5 shadow-lg z-10"
        >
          Skopiowano KRS do schowka - wklej w wyszukiwarce NIW
        </span>
      )}
    </span>
  );
}
