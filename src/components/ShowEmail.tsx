'use client';

import { useState } from 'react';

export default function ShowEmail({ email }: { email: string }) {
  const [visible, setVisible] = useState(false);

  if (!visible) {
    return (
      <button
        onClick={() => setVisible(true)}
        className="text-sm text-blue-600 hover:text-blue-800 underline"
        aria-label="Pokaż adres email kontaktowy"
      >
        Pokaż email
      </button>
    );
  }

  return (
    <a href={`mailto:${email}`} className="text-sm text-blue-600 hover:text-blue-800">
      {email}
    </a>
  );
}
