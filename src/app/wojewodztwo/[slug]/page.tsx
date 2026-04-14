import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getOrganizationsByVoivodeship } from '@/lib/data';
import { VOIVODESHIPS, VOIVODESHIP_NAMES, CATEGORIES } from '@/lib/constants';
import OrgList from '@/components/OrgList';

export async function generateStaticParams() {
  return Object.values(VOIVODESHIPS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const name = VOIVODESHIP_NAMES[slug];
  if (!name) return {};
  const description = `Lista organizacji pożytku publicznego w województwie ${name.toLowerCase()}.`;
  return {
    alternates: { canonical: `/wojewodztwo/${slug}` },
    title: `Organizacje OPP - woj. ${name}`,
    description,
    openGraph: {
      title: `Organizacje OPP - woj. ${name} | KomuPrzekazac.pl`,
      description,
      url: `https://komuprzekazac.pl/wojewodztwo/${slug}`,
    },
  };
}

export default async function VoivodeshipPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const name = VOIVODESHIP_NAMES[slug];
  if (!name) notFound();

  // Find the uppercase voivodeship name that maps to this slug
  const voivUpper = Object.entries(VOIVODESHIPS).find(([, s]) => s === slug)?.[0];
  if (!voivUpper) notFound();

  const orgs = getOrganizationsByVoivodeship(voivUpper);

  // Count orgs per primary category, sorted by count descending
  const catCounts: Record<string, number> = {};
  for (const org of orgs) {
    catCounts[org.primary_category] = (catCounts[org.primary_category] || 0) + 1;
  }
  const sortedCats = Object.entries(catCounts).sort((a, b) => b[1] - a[1]);

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Strona główna', item: 'https://komuprzekazac.pl' },
      { '@type': 'ListItem', position: 2, name: `Województwo ${name}`, item: `https://komuprzekazac.pl/wojewodztwo/${slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Województwo {name}
        </h1>
        <p className="text-gray-600 mb-8">
          {orgs.length.toLocaleString('pl-PL')} organizacji pożytku publicznego
        </p>

        {/* Category breakdown */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Kategorie</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {sortedCats.map(([catSlug, count]) => (
              <Link
                key={catSlug}
                href={`/kategoria/${catSlug}`}
                className="flex items-center justify-between px-3 py-2 rounded-lg border border-gray-200 hover:border-[#00b9fb] transition-colors text-sm"
              >
                <span className="text-gray-900">{CATEGORIES[catSlug] || catSlug}</span>
                <span className="text-gray-500">{count}</span>
              </Link>
            ))}
          </div>
        </section>

        <OrgList organizations={orgs} />
      </div>
    </>
  );
}
