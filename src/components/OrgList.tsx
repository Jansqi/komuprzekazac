import Link from 'next/link';
import type { Organization } from '@/types/organization';
import { CATEGORIES, SCOPE_LABELS } from '@/lib/constants';
import { formatPLN, formatVoivodeship } from '@/lib/format';

const PER_PAGE = 50;

export default function OrgList({ organizations, page = 1 }: { organizations: Organization[]; page?: number }) {
  const start = (page - 1) * PER_PAGE;
  const shown = organizations.slice(start, start + PER_PAGE);

  return (
    <div className="space-y-3">
      {shown.map((org) => (
        <Link
          key={org.krs_number}
          href={`/organizacja/${org.slug}`}
          className="card block hover:border-blue-200 transition-colors"
        >
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-sm md:text-base">{org.name}</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {formatVoivodeship(org.city)}, woj. {formatVoivodeship(org.voivodeship)} · KRS {org.krs_number}
              </p>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{org.ai_summary}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                <span className="badge badge-primary text-xs">
                  {CATEGORIES[org.primary_category] || org.primary_category}
                </span>
              </div>
            </div>
            {org.revenue_total !== null && (
              <div className="text-right flex-shrink-0">
                <p className="font-semibold text-gray-900 text-sm">{formatPLN(org.revenue_total)}</p>
              </div>
            )}
          </div>
        </Link>
      ))}
      {organizations.length > PER_PAGE && (
        <p className="text-sm text-gray-400 text-center pt-4">
          Pokazano {Math.min(shown.length, PER_PAGE)} z {organizations.length} organizacji.
          Użyj <Link href="/szukaj" className="text-blue-600 underline">wyszukiwarki</Link> aby przefiltrować wyniki.
        </p>
      )}
    </div>
  );
}
