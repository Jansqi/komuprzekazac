'use client';

import { CATEGORIES, BENEFICIARY_TAGS, SCOPE_LABELS, SIZE_LABELS } from '@/lib/constants';

interface Props {
  categories: string[];
  beneficiaries: string[];
  scopes: string[];
  sizes: string[];
  hasWebsite: boolean;
  onCategoriesChange: (v: string[]) => void;
  onBeneficiariesChange: (v: string[]) => void;
  onScopesChange: (v: string[]) => void;
  onSizesChange: (v: string[]) => void;
  onHasWebsiteChange: (v: boolean) => void;
  onReset: () => void;
  visibleCount: number;
  totalCount: number;
  hasActive: boolean;
  isOpen: boolean;
  onClose: () => void;
}

function toggle(arr: string[], v: string): string[] {
  return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
}

function sortedByPolishName(entries: Record<string, string>): [string, string][] {
  return Object.entries(entries).sort((a, b) => a[1].localeCompare(b[1], 'pl'));
}

export default function MapFilters({
  categories,
  beneficiaries,
  scopes,
  sizes,
  hasWebsite,
  onCategoriesChange,
  onBeneficiariesChange,
  onScopesChange,
  onSizesChange,
  onHasWebsiteChange,
  onReset,
  visibleCount,
  totalCount,
  hasActive,
  isOpen,
  onClose,
}: Props) {
  const categoryEntries = sortedByPolishName(CATEGORIES);
  const beneficiaryEntries = sortedByPolishName(BENEFICIARY_TAGS);
  const scopeEntries = sortedByPolishName(SCOPE_LABELS);
  // Size is an ordinal scale - keep original (mikro → bardzo-duża) order
  const sizeEntries = Object.entries(SIZE_LABELS);

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/30 z-40"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        id="map-filters"
        className={`
          fixed md:static inset-y-0 right-0 z-50 md:z-auto
          w-80 max-w-full bg-white border-l md:border border-gray-200 md:rounded-xl
          overflow-y-auto shadow-xl md:shadow-none
          transform transition-transform duration-200 md:transition-none
          ${isOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
        `}
        aria-label="Filtry mapy"
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-900">Filtry</h2>
            <button
              onClick={onClose}
              className="md:hidden text-gray-500 hover:text-gray-800 text-xl leading-none"
              aria-label="Zamknij filtry"
            >
              ✕
            </button>
          </div>

          <p className="text-sm text-gray-500 mb-3">
            Pokazuje{' '}
            <span className="font-semibold text-gray-900">
              {visibleCount.toLocaleString('pl-PL')}
            </span>{' '}
            z {totalCount.toLocaleString('pl-PL')}
          </p>

          {hasActive && (
            <button
              onClick={onReset}
              className="text-sm text-[#00b9fb] hover:text-[#009dd4] underline mb-4"
            >
              Wyczyść filtry
            </button>
          )}

          {/* Categories - collapsible (18 items) */}
          <details
            className="mb-2 border-t border-gray-100 pt-3"
            open={categories.length > 0}
          >
            <summary className="cursor-pointer font-medium text-sm text-gray-800 list-none flex items-center justify-between select-none">
              <span>
                Kategoria{' '}
                {categories.length > 0 && (
                  <span className="text-[#00b9fb]">({categories.length})</span>
                )}
              </span>
              <span className="text-gray-400 text-xs" aria-hidden="true">
                ▾
              </span>
            </summary>
            <div className="mt-2 space-y-1 max-h-60 overflow-y-auto pr-1">
              {categoryEntries.map(([slug, name]) => (
                <label
                  key={slug}
                  className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 cursor-pointer py-0.5"
                >
                  <input
                    type="checkbox"
                    checked={categories.includes(slug)}
                    onChange={() => onCategoriesChange(toggle(categories, slug))}
                    className="w-4 h-4 rounded border-gray-300 text-[#00b9fb] focus:ring-[#00b9fb]/50"
                  />
                  <span>{name}</span>
                </label>
              ))}
            </div>
          </details>

          {/* Beneficiaries - collapsible (14 items) */}
          <details
            className="mb-2 border-t border-gray-100 pt-3"
            open={beneficiaries.length > 0}
          >
            <summary className="cursor-pointer font-medium text-sm text-gray-800 list-none flex items-center justify-between select-none">
              <span>
                Grupa docelowa{' '}
                {beneficiaries.length > 0 && (
                  <span className="text-[#00b9fb]">({beneficiaries.length})</span>
                )}
              </span>
              <span className="text-gray-400 text-xs" aria-hidden="true">
                ▾
              </span>
            </summary>
            <div className="mt-2 space-y-1 max-h-60 overflow-y-auto pr-1">
              {beneficiaryEntries.map(([slug, name]) => (
                <label
                  key={slug}
                  className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 cursor-pointer py-0.5"
                >
                  <input
                    type="checkbox"
                    checked={beneficiaries.includes(slug)}
                    onChange={() =>
                      onBeneficiariesChange(toggle(beneficiaries, slug))
                    }
                    className="w-4 h-4 rounded border-gray-300 text-[#00b9fb] focus:ring-[#00b9fb]/50"
                  />
                  <span>{name}</span>
                </label>
              ))}
            </div>
          </details>

          {/* Scope - always expanded (4 items) */}
          <div className="mb-3 border-t border-gray-100 pt-3">
            <p className="font-medium text-sm text-gray-800 mb-2">
              Zasięg{' '}
              {scopes.length > 0 && (
                <span className="text-[#00b9fb]">({scopes.length})</span>
              )}
            </p>
            <div className="space-y-1">
              {scopeEntries.map(([slug, name]) => (
                <label
                  key={slug}
                  className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer py-0.5"
                >
                  <input
                    type="checkbox"
                    checked={scopes.includes(slug)}
                    onChange={() => onScopesChange(toggle(scopes, slug))}
                    className="w-4 h-4 rounded border-gray-300 text-[#00b9fb] focus:ring-[#00b9fb]/50"
                  />
                  <span>{name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Size - always expanded (5 items), ordinal order preserved */}
          <div className="mb-3 border-t border-gray-100 pt-3">
            <p className="font-medium text-sm text-gray-800 mb-2">
              Wielkość{' '}
              {sizes.length > 0 && (
                <span className="text-[#00b9fb]">({sizes.length})</span>
              )}
            </p>
            <div className="space-y-1">
              {sizeEntries.map(([slug, name]) => (
                <label
                  key={slug}
                  className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer py-0.5"
                >
                  <input
                    type="checkbox"
                    checked={sizes.includes(slug)}
                    onChange={() => onSizesChange(toggle(sizes, slug))}
                    className="w-4 h-4 rounded border-gray-300 text-[#00b9fb] focus:ring-[#00b9fb]/50"
                  />
                  <span>{name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* has_website toggle */}
          <div className="mb-3 border-t border-gray-100 pt-3">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={hasWebsite}
                onChange={(e) => onHasWebsiteChange(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-[#00b9fb] focus:ring-[#00b9fb]/50"
              />
              <span className="font-medium">Tylko z własną stroną WWW</span>
            </label>
          </div>
        </div>
      </aside>
    </>
  );
}
