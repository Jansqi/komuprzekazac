import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllSlugs, getOrganizationBySlug, getCategoryAverages } from '@/lib/data';
import { CATEGORIES, SCOPE_LABELS, BENEFICIARY_TAGS } from '@/lib/constants';
import { formatPLN, formatPercent, safePercent, formatNumber, formatVoivodeship } from '@/lib/format';
import CopyKRS from '@/components/CopyKRS';
import ShowEmail from '@/components/ShowEmail';
import FinancialBar from '@/components/FinancialBar';
import ExternalLink from '@/components/ExternalLink';
import NiwLink from '@/components/NiwLink';
import ReportBugButton from '@/components/ReportBugButton';

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const org = getOrganizationBySlug(slug);
  if (!org) return {};
  return {
    alternates: { canonical: `/organizacja/${slug}` },
    title: `${org.name} - KRS ${org.krs_number}`,
    description: `${org.ai_summary} Przekaż 1,5% podatku na KRS ${org.krs_number}.`,
    openGraph: {
      title: `${org.name} | KomuPrzekazac.pl`,
      description: org.ai_summary,
    },
  };
}

export default async function OrganizationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const org = getOrganizationBySlug(slug);
  if (!org) notFound();

  const catAvg = getCategoryAverages()[org.primary_category];
  const costStatPct = safePercent(org.rach_costs_statutory_curr, org.costs_total);
  const costAdminPct = safePercent(org.rach_costs_admin_curr, org.costs_total);
  const revFromTaxPct = safePercent(org.revenue_15pct, org.revenue_total);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NGO',
    name: org.name,
    description: org.ai_summary,
    address: {
      '@type': 'PostalAddress',
      addressLocality: org.city,
      addressRegion: org.voivodeship,
      postalCode: org.postal_code,
      addressCountry: 'PL',
    },
    url: org.website,
    identifier: {
      '@type': 'PropertyValue',
      name: 'KRS',
      value: org.krs_number,
    },
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Strona główna', item: 'https://komuprzekazac.pl' },
      { '@type': 'ListItem', position: 2, name: CATEGORIES[org.primary_category] || org.primary_category, item: `https://komuprzekazac.pl/kategoria/${org.primary_category}` },
      { '@type': 'ListItem', position: 3, name: org.name, item: `https://komuprzekazac.pl/organizacja/${slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{org.name}</h1>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <CopyKRS krs={org.krs_number} />
            {org.nip && <span className="text-sm text-gray-500">NIP: {org.nip}</span>}
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-3">
            <span>{formatVoivodeship(org.city)}, {formatVoivodeship(org.voivodeship)}</span>
            {org.postal_code && <span>({org.postal_code})</span>}
            {org.org_type && <span>· {org.org_type}</span>}
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/kategoria/${org.primary_category}`}
              className="badge badge-primary"
            >
              {CATEGORIES[org.primary_category] || org.primary_category}
            </Link>
            {org.related_categories.map((cat) => (
              <Link key={cat} href={`/kategoria/${cat}`} className="badge badge-secondary">
                {CATEGORIES[cat] || cat}
              </Link>
            ))}
            <span className="badge badge-secondary">
              {SCOPE_LABELS[org.scope] || org.scope}
            </span>
          </div>
        </div>

        {/* AI Summary */}
        <div className="bg-[#00b9fb]/10 border border-[#00b9fb]/20 rounded-xl p-5 mb-8">
          <p className="text-gray-800 leading-relaxed">{org.ai_summary}</p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-4 mb-8 text-sm">
          {org.website && (
            <ExternalLink
              href={org.website}
              className="text-[#00b9fb] hover:text-[#009dd4] underline"
            >
              🌐 Strona WWW
            </ExternalLink>
          )}
          {org.email && <ShowEmail email={org.email} />}
          <ExternalLink
            href="https://ekrs.ms.gov.pl/web/wyszukiwarka-krs/strona-glowna/index.html"
            className="text-[#00b9fb] hover:text-[#009dd4] underline"
          >
            📋 Sprawdź w eKRS
          </ExternalLink>
          <NiwLink krs={org.krs_number} />
        </div>

        {/* Transparency signals */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <div className="card text-center text-sm">
            <span className="text-lg">{org.has_website ? '✅' : '❌'}</span>
            <p className="mt-1">Strona WWW</p>
          </div>
          <div className="card text-center text-sm">
            <span className="text-lg">{org.has_email ? '✅' : '❌'}</span>
            <p className="mt-1">Email kontaktowy</p>
          </div>
          <div className="card text-center text-sm">
            <span className="text-lg">{org.form_variant === 'standard' ? '✅' : '⚠️'}</span>
            <p className="mt-1">{org.form_variant === 'standard' ? 'Pełne sprawozdanie' : 'Uproszczone'}</p>
          </div>
          <div className="card text-center text-sm">
            <span className="text-lg">🏛️</span>
            <p className="mt-1">
              {org.opp_years !== null ? `OPP od ${org.opp_years} lat` : 'Status OPP'}
            </p>
          </div>
        </div>

        {/* Financials */}
        {org.revenue_total !== null && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Finanse (dane za {org.report_year} r.)</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="card">
                <p className="text-sm text-gray-500">Przychody ogółem</p>
                <p className="text-2xl font-bold text-gray-900">{formatPLN(org.revenue_total)}</p>
                {org.size && (
                  <p className="text-xs text-gray-500 mt-1">
                    Organizacja: {org.size} · mediana w kategorii: {formatPLN(catAvg?.median_revenue ?? null)}
                  </p>
                )}
              </div>
              <div className="card">
                <p className="text-sm text-gray-500">Przychody z 1,5% podatku</p>
                <p className="text-2xl font-bold text-[#00b9fb]">{formatPLN(org.revenue_15pct)}</p>
                {revFromTaxPct !== null && (
                  <p className="text-xs text-gray-500 mt-1">
                    {formatPercent(revFromTaxPct)} przychodów ogółem
                  </p>
                )}
              </div>
              <div className="card">
                <p className="text-sm text-gray-500">Koszty ogółem</p>
                <p className="text-2xl font-bold text-gray-900">{formatPLN(org.costs_total)}</p>
              </div>
              <div className="card">
                <p className="text-sm text-gray-500">Wynik netto</p>
                <p className={`text-2xl font-bold ${(org.rach_result_net_curr ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatPLN(org.rach_result_net_curr)}
                </p>
              </div>
            </div>

            {/* Revenue structure */}
            {(org.revenue_public_total || org.revenue_private_total || org.revenue_15pct) && (
              <div className="card mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Struktura przychodów</h3>
                <FinancialBar
                  segments={[
                    { label: '1,5% podatku', value: org.revenue_15pct ?? 0, color: '#00b9fb' },
                    { label: 'Publiczne (inne)', value: Math.max(0, (org.revenue_public_total ?? 0) - (org.revenue_15pct ?? 0)), color: '#00b9fb', opacity: 0.7 },
                    { label: 'Prywatne', value: org.revenue_private_total ?? 0, color: '#00b9fb', opacity: 0.4 },
                    { label: 'Inne', value: org.revenue_other ?? 0, color: '#9ca3af' },
                  ]}
                />
              </div>
            )}

            {/* Cost structure */}
            {costStatPct !== null && (
              <div className="card mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Struktura kosztów</h3>
                <FinancialBar
                  segments={[
                    { label: 'Statutowe (misja)', value: org.rach_costs_statutory_curr ?? 0, color: '#00b9fb' },
                    { label: 'Administracyjne', value: org.rach_costs_admin_curr ?? 0, color: '#00b9fb', opacity: 0.4 },
                  ]}
                />
                <p className="text-xs text-gray-500 mt-3">
                  Koszty statutowe: {formatPercent(costStatPct)}
                  {catAvg?.avg_costs_statutory_pct && (
                    <> (średnia w kategorii {CATEGORIES[org.primary_category]}: {formatPercent(catAvg.avg_costs_statutory_pct)})</>
                  )}
                </p>
                {costAdminPct !== null && catAvg?.avg_costs_admin_pct && (
                  <p className="text-xs text-gray-500">
                    Koszty administracyjne: {formatPercent(costAdminPct)}
                    {' '}(średnia w kategorii: {formatPercent(catAvg.avg_costs_admin_pct)})
                  </p>
                )}
              </div>
            )}

            {/* 1.5% spending */}
            {org.costs_15pct_total !== null && org.costs_15pct_total > 0 && (
              <div className="card">
                <p className="text-sm text-gray-500">Wydatki ze środków z 1,5% podatku</p>
                <p className="text-xl font-bold text-gray-900">{formatPLN(org.costs_15pct_total)}</p>
              </div>
            )}
          </section>
        )}

        {/* People */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Ludzie</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {(org.staff_employed !== null && org.staff_employed > 0) && (
              <div className="card">
                <p className="text-sm text-gray-500">Pracownicy (etat)</p>
                <p className="text-xl font-bold">{formatNumber(org.staff_employed)}</p>
              </div>
            )}
            {(org.staff_civil_contract !== null && org.staff_civil_contract > 0) && (
              <div className="card">
                <p className="text-sm text-gray-500">Umowy cywilnoprawne</p>
                <p className="text-xl font-bold">{formatNumber(org.staff_civil_contract)}</p>
              </div>
            )}
            {(org.members_count !== null && org.members_count > 0) && (
              <div className="card">
                <p className="text-sm text-gray-500">Członkowie</p>
                <p className="text-xl font-bold">{formatNumber(org.members_count)}</p>
              </div>
            )}
            {(org.beneficiaries_physical !== null && org.beneficiaries_physical > 0) && (
              <div className="card">
                <p className="text-sm text-gray-500">Beneficjenci (osoby)</p>
                <p className="text-xl font-bold">{formatNumber(org.beneficiaries_physical)}</p>
                <p className="text-xs text-gray-400 mt-1">wg sprawozdania organizacji</p>
              </div>
            )}
          </div>
        </section>

        {/* Beneficiary tags */}
        {org.beneficiary_tags.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Komu pomaga</h2>
            <div className="flex flex-wrap gap-2">
              {org.beneficiary_tags.map((tag) => (
                <span key={tag} className="badge badge-secondary">
                  {BENEFICIARY_TAGS[tag] || tag}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Source note */}
        <div className="text-xs text-gray-400 border-t border-gray-100 pt-4 mt-8 flex flex-wrap items-center justify-between gap-3">
          <span>
            Dane ze sprawozdania za rok {org.report_year}, złożonego w NIW-CRSO.{' '}
            <ExternalLink
              href="https://ekrs.ms.gov.pl/web/wyszukiwarka-krs/strona-glowna/index.html"
              className="underline"
            >
              Sprawdź w eKRS
            </ExternalLink>
          </span>
          <ReportBugButton
            variant="data"
            krs={org.krs_number}
            orgName={org.name}
          />
        </div>
      </div>
    </>
  );
}
