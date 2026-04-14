'use client';

import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  Suspense,
} from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import type { DataFile, Organization } from '@/types/organization';
import MapFilters from '@/components/MapFilters';

const MapView = dynamic(() => import('@/components/MapView'), { ssr: false });

const PARAM = {
  category: 'kategoria',
  beneficiary: 'grupa',
  scope: 'zakres',
  size: 'wielkosc',
  website: 'strona',
} as const;

function parseList(v: string | null): string[] {
  if (!v) return [];
  return v.split(',').filter(Boolean);
}

function MapaPageInner() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<DataFile | null>(null);

  // Initialize state from URL params
  const [categories, setCategories] = useState<string[]>(() =>
    parseList(searchParams.get(PARAM.category))
  );
  const [beneficiaries, setBeneficiaries] = useState<string[]>(() =>
    parseList(searchParams.get(PARAM.beneficiary))
  );
  const [scopes, setScopes] = useState<string[]>(() =>
    parseList(searchParams.get(PARAM.scope))
  );
  const [sizes, setSizes] = useState<string[]>(() =>
    parseList(searchParams.get(PARAM.size))
  );
  const [hasWebsite, setHasWebsite] = useState(
    () => searchParams.get(PARAM.website) === 'tak'
  );

  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    fetch('/data/organizations.json')
      .then((r) => r.json())
      .then((d: DataFile) => setData(d));
  }, []);

  // Sync state → URL (replaceState so we don't spam history)
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    const params = new URLSearchParams();
    if (categories.length > 0) params.set(PARAM.category, categories.join(','));
    if (beneficiaries.length > 0)
      params.set(PARAM.beneficiary, beneficiaries.join(','));
    if (scopes.length > 0) params.set(PARAM.scope, scopes.join(','));
    if (sizes.length > 0) params.set(PARAM.size, sizes.join(','));
    if (hasWebsite) params.set(PARAM.website, 'tak');

    const qs = params.toString();
    window.history.replaceState(null, '', qs ? `/mapa?${qs}` : '/mapa');
  }, [categories, beneficiaries, scopes, sizes, hasWebsite]);

  // Handle browser back/forward
  useEffect(() => {
    const onPopState = () => {
      const p = new URLSearchParams(window.location.search);
      setCategories(parseList(p.get(PARAM.category)));
      setBeneficiaries(parseList(p.get(PARAM.beneficiary)));
      setScopes(parseList(p.get(PARAM.scope)));
      setSizes(parseList(p.get(PARAM.size)));
      setHasWebsite(p.get(PARAM.website) === 'tak');
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const allOrgs = useMemo(() => data?.organizations ?? [], [data]);

  // Count all orgs that can be placed on map (have coords)
  const totalGeocodedCount = useMemo(
    () => allOrgs.filter((o) => o.lat !== null && o.lng !== null).length,
    [allOrgs]
  );

  // Apply filters (does not require coordinates here; MapView will skip coord-less orgs)
  const filtered = useMemo(() => {
    let result: Organization[] = allOrgs;

    if (categories.length > 0) {
      const set = new Set(categories);
      result = result.filter(
        (o) =>
          set.has(o.primary_category) ||
          o.related_categories.some((c) => set.has(c))
      );
    }
    if (beneficiaries.length > 0) {
      const set = new Set(beneficiaries);
      result = result.filter((o) =>
        o.beneficiary_tags.some((t) => set.has(t))
      );
    }
    if (scopes.length > 0) {
      const set = new Set(scopes);
      result = result.filter((o) => set.has(o.scope));
    }
    if (sizes.length > 0) {
      const set = new Set(sizes);
      result = result.filter((o) => o.size !== null && set.has(o.size));
    }
    if (hasWebsite) {
      result = result.filter((o) => o.has_website);
    }

    return result;
  }, [allOrgs, categories, beneficiaries, scopes, sizes, hasWebsite]);

  // Count only those that will actually show on map
  const visibleCount = useMemo(
    () => filtered.filter((o) => o.lat !== null && o.lng !== null).length,
    [filtered]
  );

  const hasActive =
    categories.length > 0 ||
    beneficiaries.length > 0 ||
    scopes.length > 0 ||
    sizes.length > 0 ||
    hasWebsite;

  const reset = useCallback(() => {
    setCategories([]);
    setBeneficiaries([]);
    setScopes([]);
    setSizes([]);
    setHasWebsite(false);
    window.history.pushState(null, '', '/mapa');
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Mapa organizacji
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {data
              ? `${visibleCount.toLocaleString('pl-PL')} z ${totalGeocodedCount.toLocaleString(
                  'pl-PL'
                )} organizacji pożytku publicznego na mapie Polski.`
              : 'Ładowanie danych…'}
          </p>
        </div>
        <button
          onClick={() => setFiltersOpen(true)}
          className="md:hidden flex-shrink-0 px-3 py-2 text-sm bg-[#00b9fb] text-white rounded-lg font-medium"
          aria-controls="map-filters"
          aria-expanded={filtersOpen}
        >
          Filtry {hasActive && <span aria-hidden="true">•</span>}
          {hasActive && <span className="sr-only">(aktywne)</span>}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div
          className="flex-1 min-w-0 rounded-xl border border-gray-200 overflow-hidden"
          style={{ height: '70vh' }}
        >
          {data ? (
            <MapView organizations={filtered} />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              Ładowanie mapy…
            </div>
          )}
        </div>

        <MapFilters
          categories={categories}
          beneficiaries={beneficiaries}
          scopes={scopes}
          sizes={sizes}
          hasWebsite={hasWebsite}
          onCategoriesChange={setCategories}
          onBeneficiariesChange={setBeneficiaries}
          onScopesChange={setScopes}
          onSizesChange={setSizes}
          onHasWebsiteChange={setHasWebsite}
          onReset={reset}
          visibleCount={visibleCount}
          totalCount={totalGeocodedCount}
          hasActive={hasActive}
          isOpen={filtersOpen}
          onClose={() => setFiltersOpen(false)}
        />
      </div>
    </div>
  );
}

export default function MapaPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <p className="text-gray-500 text-lg">Ładowanie danych…</p>
        </div>
      }
    >
      <MapaPageInner />
    </Suspense>
  );
}
