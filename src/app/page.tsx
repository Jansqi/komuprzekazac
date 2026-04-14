import { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { getCategoryCounts, getMeta } from '@/lib/data';
import { CATEGORIES } from '@/lib/constants';
import OrgMap from '@/components/OrgMap';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
  openGraph: {
    title: 'KomuPrzekazac.pl — Wybierz świadomie, komu przekazujesz 1,5%',
    description:
      'Przeglądaj 9 671 organizacji pożytku publicznego na mapie Polski. Znajdź organizację w swojej okolicy, porównaj dane finansowe i sygnały transparentności.',
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

function MapSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="rounded-xl border border-gray-200 overflow-hidden h-[50vh] md:h-[70vh] bg-gradient-to-br from-sky-50 to-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <div
            className="w-10 h-10 border-4 border-gray-200 border-t-[#00b9fb] rounded-full animate-spin"
            aria-hidden="true"
          />
          <p className="text-sm">Ładowanie mapy…</p>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const categoryCounts = getCategoryCounts();
  const meta = getMeta();

  const searchActionLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'KomuPrzekazac.pl',
    url: 'https://komuprzekazac.pl',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://komuprzekazac.pl/szukaj?szukaj={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  const sortedCategories = Object.entries(CATEGORIES).sort((a, b) => {
    return (categoryCounts[b[0]] || 0) - (categoryCounts[a[0]] || 0);
  });

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(searchActionLd) }}
      />

      {/* Hero */}
      <section className="bg-[#00b9fb] py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Wybierz świadomie, komu przekazujesz 1,5%
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-6 max-w-2xl mx-auto">
            Przeglądaj {meta.record_count.toLocaleString('pl-PL')} organizacji pożytku publicznego
            na mapie Polski i znajdź tę, którą chcesz wesprzeć.
          </p>
          <Link
            href="/szukaj"
            className="inline-flex items-center gap-2 bg-white text-[#00b9fb] px-8 py-4 rounded-xl text-lg font-medium hover:bg-white/90 transition-colors"
          >
            🔍 Wyszukaj
          </Link>
          <p className="text-sm text-white/70 mt-4">
            Dane ze sprawozdań za rok {meta.report_year}
          </p>
        </div>
      </section>

      {/* Map */}
      <section id="mapa" className="py-8 md:py-12 scroll-mt-16">
        <Suspense fallback={<MapSkeleton />}>
          <OrgMap basePath="/" />
        </Suspense>
      </section>

      {/* Category grid */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Przeglądaj według kategorii</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {sortedCategories.map(([slug, name]) => (
            <Link
              key={slug}
              href={`/kategoria/${slug}`}
              className="card flex items-center gap-4 border-l-4 border-l-[#00b9fb] hover:border-[#00b9fb] transition-colors"
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

      {/* Jak działamy */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Jak działamy</h2>
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
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <Link href="/o-serwisie" className="text-[#00b9fb] hover:text-[#009dd4]">
              O serwisie →
            </Link>
            <Link href="/dlaczego-nie-oceniamy" className="text-[#00b9fb] hover:text-[#009dd4]">
              Dlaczego nie oceniamy →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
