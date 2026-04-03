'use client';

import { useState } from 'react';

export default function ShowEmail({ email }: { email: string }) {
  const [visible, setVisible] = useState(false);

  if (!visible) {
    return (
      <button
        onClick={() => setVisible(true)}
        className="text-sm text-[#00b9fb] hover:text-[#009dd4] underline"
        aria-label="Pokaż adres email kontaktowy"
      >
        Pokaż email
      </button>
    );
  }

  return (
    <a href={`mailto:${email}`} className="text-sm text-[#00b9fb] hover:text-[#009dd4]">
      {email}
    </a>
  );
}
