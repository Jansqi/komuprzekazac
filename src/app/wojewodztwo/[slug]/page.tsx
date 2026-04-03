import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getOrganizationsByVoivodeship } from '@/lib/data';
import { VOIVODESHIPS, VOIVODESHIP_NAMES } from '@/lib/constants';
import OrgList from '@/components/OrgList';

export async function generateStaticParams() {
  return Object.values(VOIVODESHIPS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const name = VOIVODESHIP_NAMES[slug];
  if (!name) return {};
  return {
    title: `Organizacje OPP — woj. ${name}`,
    description: `Lista organizacji pożytku publicznego w województwie ${name.toLowerCase()}.`,
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
        Województwo {name}
      </h1>
      <p className="text-gray-600 mb-6">
        {orgs.length.toLocaleString('pl-PL')} organizacji pożytku publicznego
      </p>
      <OrgList organizations={orgs} />
    </div>
  );
}
