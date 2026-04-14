import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getOrganizationsByCategory, getCategoryAverages } from '@/lib/data';
import { CATEGORIES } from '@/lib/constants';
import { formatPLN } from '@/lib/format';
import OrgList from '@/components/OrgList';

export async function generateStaticParams() {
  return Object.keys(CATEGORIES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const name = CATEGORIES[slug];
  if (!name) return {};
  const description = `Lista organizacji pożytku publicznego w kategorii ${name}. Dane finansowe, opisy, sygnały transparentności.`;
  return {
    alternates: { canonical: `/kategoria/${slug}` },
    title: `${name} - organizacje pożytku publicznego`,
    description,
    openGraph: {
      title: `${name} - organizacje OPP | KomuPrzekazac.pl`,
      description,
      url: `https://komuprzekazac.pl/kategoria/${slug}`,
    },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const name = CATEGORIES[slug];
  if (!name) notFound();

  const orgs = getOrganizationsByCategory(slug);
  const avg = getCategoryAverages()[slug];

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Strona główna', item: 'https://komuprzekazac.pl' },
      { '@type': 'ListItem', position: 2, name: name, item: `https://komuprzekazac.pl/kategoria/${slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{name}</h1>
        <p className="text-gray-600 mb-6">
          {orgs.length.toLocaleString('pl-PL')} organizacji
          {avg?.median_revenue && (
            <> · mediana przychodów: {formatPLN(avg.median_revenue)}</>
          )}
        </p>
        <OrgList organizations={orgs} />
      </div>
    </>
  );
}
