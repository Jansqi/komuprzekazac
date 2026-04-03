import { Metadata } from 'next';
import Link from 'next/link';
import { getCategoryCounts, getMeta } from '@/lib/data';
import { CATEGORIES } from '@/lib/constants';

export const metadata: Metadata = {
  openGraph: {
    title: 'KomuPrzekazac.pl — Sprawdź organizacje pożytku publicznego',
    description: 'Porównaj 9 671 organizacji pożytku publicznego. Dane finansowe, opisy działalności, sygnały transparentności. Wybierz świadomie, komu przekazać 1,5% podatku.',
  },
};

const CATEGORY_ICONS: Record<string, string> = {
  'sport': '⚽',
  'niepelnosprawnosc': '♿',
  'edukacja': '📚',
  'zdrowie': '🏥',
  'kultura': '🎭',
  'spoleczenstwo-obywatelskie': '🤝',
  'pomoc-spoleczna': '🫶',
  'dzieci-i-rodzina': '👨‍👩‍👧',
  'ratownictwo': '🚑',
  'zdrowie-psychiczne': '🧠',
  'zwierzeta': '🐾',
  'srodowisko': '🌿',
  'prawa-i-wolnosci': '⚖️',
  'seniorzy': '👴',
  'religia': '⛪',
  'wspolpraca-miedzynarodowa': '🌍',
  'turystyka': '🏔️',
  'inne': '📁',
};

export default function HomePage() {
  const categoryCounts = getCategoryCounts();
  const meta = getMeta();

  const sortedCategories = Object.entries(CATEGORIES).sort((a, b) => {
    return (categoryCounts[b[0]] || 0) - (categoryCounts[a[0]] || 0);
  });

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Komu przekazać 1,5% podatku?
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Porównaj {meta.record_count.toLocaleString('pl-PL')} organizacji pożytku publicznego.
            Dane finansowe, opisy działalności, sygnały transparentności — wszystko w jednym miejscu.
          </p>
          <Link
            href="/szukaj"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-medium hover:bg-blue-700 transition-colors"
          >
            🔍 Szukaj organizacji
          </Link>
          <p className="text-sm text-gray-400 mt-4">
            Dane ze sprawozdań za rok {meta.report_year}
          </p>
        </div>
      </section>

      {/* Category grid */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Przeglądaj według kategorii</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {sortedCategories.map(([slug, name]) => (
            <Link
              key={slug}
              href={`/kategoria/${slug}`}
              className="card flex items-center gap-4 hover:border-blue-200 transition-colors"
            >
              <span className="text-2xl">{CATEGORY_ICONS[slug] || '📁'}</span>
              <div>
                <p className="font-medium text-gray-900">{name}</p>
                <p className="text-sm text-gray-500">
                  {(categoryCounts[slug] || 0).toLocaleString('pl-PL')} organizacji
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* About section */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">O serwisie</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600">
              KomuPrzekazac.pl to niezależny serwis informacyjny, który pomaga podatnikom świadomie wybrać
              organizację pożytku publicznego do przekazania 1,5% podatku dochodowego. Prezentujemy dane
              ze sprawozdań złożonych w NIW-CRSO, wzbogacone o informacje z KRS.
            </p>
            <p className="text-gray-600 mt-3">
              <strong>Nie oceniamy ani nie rankingujemy organizacji.</strong> Zamiast tego pokazujemy fakty
              i sygnały transparentności, abyś mógł podjąć decyzję samodzielnie.
            </p>
          </div>
          <Link href="/o-serwisie" className="text-blue-600 hover:text-blue-800 text-sm mt-4 inline-block">
            Dowiedz się więcej →
          </Link>
        </div>
      </section>
    </div>
  );
}
