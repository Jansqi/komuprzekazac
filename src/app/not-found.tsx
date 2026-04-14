import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Strona nie znaleziona',
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <p className="text-sm font-semibold text-[#00b9fb] mb-2">404</p>
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        Strona nie znaleziona
      </h1>
      <p className="text-gray-600 mb-8 max-w-xl mx-auto">
        Ta strona nie istnieje albo została przeniesiona. Organizacja mogła zmienić numer KRS
        lub zostać usunięta z rejestru OPP. Spróbuj wyszukać ją po nazwie lub numerze KRS.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 bg-[#00b9fb] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#009dd4] transition-colors"
        >
          Wróć do strony głównej
        </Link>
        <Link
          href="/szukaj"
          className="inline-flex items-center justify-center gap-2 border border-[#00b9fb] text-[#00b9fb] px-6 py-3 rounded-xl font-medium hover:bg-[#00b9fb]/10 transition-colors"
        >
          🔍 Wyszukaj organizację
        </Link>
      </div>
    </div>
  );
}
