'use client';

import { useState, useEffect, useMemo, useCallback, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Fuse from 'fuse.js';
import { CATEGORIES, VOIVODESHIPS, SCOPE_LABELS, SIZE_LABELS, BENEFICIARY_TAGS } from '@/lib/constants';
import { formatVoivodeship } from '@/lib/format';
import type { Organization, DataFile } from '@/types/organization';

const PER_PAGE = 20;

const PARAM_NAMES = {
  query: 'szukaj',
  category: 'kategoria',
  voivodeship: 'wojewodztwo',
  scope: 'zakres',
  size: 'wielkosc',
  beneficiary: 'grupa',
  page: 'strona',
} as const;

function SearchPageInner() {
  const searchParams = useSearchParams();

  const [data, setData] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize state from URL params
  const [query, setQuery] = useState(searchParams.get(PARAM_NAMES.query) ?? '');
  const [category, setCategory] = useState(searchParams.get(PARAM_NAMES.category) ?? '');
  const [voivodeship, setVoivodeship] = useState(searchParams.get(PARAM_NAMES.voivodeship) ?? '');
  const [scope, setScope] = useState(searchParams.get(PARAM_NAMES.scope) ?? '');
  const [size, setSize] = useState(searchParams.get(PARAM_NAMES.size) ?? '');
  const [beneficiary, setBeneficiary] = useState(searchParams.get(PARAM_NAMES.beneficiary) ?? '');
  const [page, setPage] = useState(() => {
    const p = parseInt(searchParams.get(PARAM_NAMES.page) ?? '', 10);
    return p > 0 ? p : 1;
  });
  const [showFilters, setShowFilters] = useState(false);

  // Debounced query for URL sync - the input updates `query` instantly,
  // but URL only updates after the user stops typing.
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    debounceTimer.current = setTimeout(() => setDebouncedQuery(query), 300);
    return () => { if (debounceTimer.current) clearTimeout(debounceTimer.current); };
  }, [query]);

  // Sync state → URL (replaceState so back button tracks meaningful changes)
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    const params = new URLSearchParams();
    if (debouncedQuery) params.set(PARAM_NAMES.query, debouncedQuery);
    if (category) params.set(PARAM_NAMES.category, category);
    if (voivodeship) params.set(PARAM_NAMES.voivodeship, voivodeship);
    if (scope) params.set(PARAM_NAMES.scope, scope);
    if (size) params.set(PARAM_NAMES.size, size);
    if (beneficiary) params.set(PARAM_NAMES.beneficiary, beneficiary);
    if (page > 1) params.set(PARAM_NAMES.page, String(page));

    const qs = params.toString();
    const url = qs ? `/szukaj?${qs}` : '/szukaj';
    window.history.replaceState(null, '', url);
  }, [debouncedQuery, category, voivodeship, scope, size, beneficiary, page]);

  // For dropdown/pagination changes, push a history entry so back button works
  const pushUrl = useCallback((overrides: Partial<Record<string, string | number>>) => {
    const state = { query, category, voivodeship, scope, size, beneficiary, page, ...overrides };
    const params = new URLSearchParams();
    if (state.query) params.set(PARAM_NAMES.query, String(state.query));
    if (state.category) params.set(PARAM_NAMES.category, String(state.category));
    if (state.voivodeship) params.set(PARAM_NAMES.voivodeship, String(state.voivodeship));
    if (state.scope) params.set(PARAM_NAMES.scope, String(state.scope));
    if (state.size) params.set(PARAM_NAMES.size, String(state.size));
    if (state.beneficiary) params.set(PARAM_NAMES.beneficiary, String(state.beneficiary));
    if (Number(state.page) > 1) params.set(PARAM_NAMES.page, String(state.page));
    const qs = params.toString();
    window.history.pushState(null, '', qs ? `/szukaj?${qs}` : '/szukaj');
  }, [query, category, voivodeship, scope, size, beneficiary, page]);

  // Handle browser back/forward
  useEffect(() => {
    const onPopState = () => {
      const p = new URLSearchParams(window.location.search);
      setQuery(p.get(PARAM_NAMES.query) ?? '');
      setDebouncedQuery(p.get(PARAM_NAMES.query) ?? '');
      setCategory(p.get(PARAM_NAMES.category) ?? '');
      setVoivodeship(p.get(PARAM_NAMES.voivodeship) ?? '');
      setScope(p.get(PARAM_NAMES.scope) ?? '');
      setSize(p.get(PARAM_NAMES.size) ?? '');
      setBeneficiary(p.get(PARAM_NAMES.beneficiary) ?? '');
      const pg = parseInt(p.get(PARAM_NAMES.page) ?? '', 10);
      setPage(pg > 0 ? pg : 1);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Filter change helpers - push history + update state
  const updateCategory = useCallback((v: string) => { setCategory(v); setPage(1); pushUrl({ category: v, page: 1 }); }, [pushUrl]);
  const updateVoivodeship = useCallback((v: string) => { setVoivodeship(v); setPage(1); pushUrl({ voivodeship: v, page: 1 }); }, [pushUrl]);
  const updateScope = useCallback((v: string) => { setScope(v); setPage(1); pushUrl({ scope: v, page: 1 }); }, [pushUrl]);
  const updateSize = useCallback((v: string) => { setSize(v); setPage(1); pushUrl({ size: v, page: 1 }); }, [pushUrl]);
  const updateBeneficiary = useCallback((v: string) => { setBeneficiary(v); setPage(1); pushUrl({ beneficiary: v, page: 1 }); }, [pushUrl]);

  useEffect(() => {
    fetch('/data/organizations.json')
      .then((r) => r.json())
      .then((d: DataFile) => {
        setData(d.organizations);
        setLoading(false);
      });
  }, []);

  const fuse = useMemo(
    () =>
      new Fuse(data, {
        keys: [
          { name: 'name', weight: 3 },
          { name: 'krs_number', weight: 2 },
          { name: 'city', weight: 1 },
          { name: 'ai_summary', weight: 1 },
        ],
        threshold: 0.35,
        ignoreLocation: true,
        minMatchCharLength: 2,
      }),
    [data]
  );

  const filteredResults = useMemo(() => {
    let results: Organization[];

    if (query.trim().length >= 2) {
      results = fuse.search(query, { limit: 500 }).map((r) => r.item);
    } else {
      results = data;
    }

    if (category) {
      results = results.filter(
        (o) => o.primary_category === category || o.related_categories.includes(category)
      );
    }
    if (voivodeship) {
      results = results.filter((o) => o.voivodeship === voivodeship);
    }
    if (scope) {
      results = results.filter((o) => o.scope === scope);
    }
    if (size) {
      results = results.filter((o) => o.size === size);
    }
    if (beneficiary) {
      results = results.filter((o) => o.beneficiary_tags.includes(beneficiary));
    }

    return results;
  }, [query, category, voivodeship, scope, size, beneficiary, data, fuse]);

  const totalPages = Math.ceil(filteredResults.length / PER_PAGE);
  const pageResults = filteredResults.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const resetFilters = useCallback(() => {
    setQuery('');
    setDebouncedQuery('');
    setCategory('');
    setVoivodeship('');
    setScope('');
    setSize('');
    setBeneficiary('');
    setPage(1);
    window.history.pushState(null, '', '/szukaj');
  }, []);

  // Reset page to 1 when query text changes (but not on initial mount)
  const prevQuery = useRef(query);
  useEffect(() => {
    if (prevQuery.current !== query) {
      prevQuery.current = query;
      setPage(1);
    }
  }, [query]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 text-lg">Ładowanie danych...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Szukaj organizacji</h1>

      {/* Search bar */}
      <div className="mb-6">
        <label htmlFor="search-input" className="sr-only">Szukaj organizacji</label>
        <input
          id="search-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Wpisz nazwę, numer KRS, miasto..."
          className="w-full px-4 py-3 border border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-[#00b9fb]/50 focus:border-transparent"
        />
      </div>

      {/* Filter toggle (mobile) */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="md:hidden mb-4 text-sm text-[#00b9fb] hover:text-[#009dd4]"
        aria-expanded={showFilters}
        aria-controls="search-filters"
      >
        {showFilters ? 'Ukryj filtry' : 'Pokaż filtry'} ▾
      </button>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters */}
        <aside id="search-filters" className={`md:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden md:block'}`}>
          <div className="space-y-4">
            <div>
              <label htmlFor="filter-category" className="block text-sm font-medium text-gray-700 mb-1">Kategoria</label>
              <select
                id="filter-category"
                value={category}
                onChange={(e) => updateCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="">Wszystkie kategorie</option>
                {Object.entries(CATEGORIES).map(([slug, name]) => (
                  <option key={slug} value={slug}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="filter-voivodeship" className="block text-sm font-medium text-gray-700 mb-1">Województwo</label>
              <select
                id="filter-voivodeship"
                value={voivodeship}
                onChange={(e) => updateVoivodeship(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="">Wszystkie województwa</option>
                {Object.entries(VOIVODESHIPS)
                  .sort((a, b) => a[0].localeCompare(b[0], 'pl'))
                  .map(([name, slug]) => (
                    <option key={slug} value={name}>
                      {formatVoivodeship(name)}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label htmlFor="filter-scope" className="block text-sm font-medium text-gray-700 mb-1">Zasięg</label>
              <select
                id="filter-scope"
                value={scope}
                onChange={(e) => updateScope(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="">Dowolny</option>
                {Object.entries(SCOPE_LABELS).map(([slug, name]) => (
                  <option key={slug} value={slug}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="filter-size" className="block text-sm font-medium text-gray-700 mb-1">Rozmiar</label>
              <select
                id="filter-size"
                value={size}
                onChange={(e) => updateSize(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="">Dowolny</option>
                {Object.entries(SIZE_LABELS).map(([slug, name]) => (
                  <option key={slug} value={slug}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="filter-beneficiary" className="block text-sm font-medium text-gray-700 mb-1">Grupa docelowa</label>
              <select
                id="filter-beneficiary"
                value={beneficiary}
                onChange={(e) => updateBeneficiary(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="">Dowolna</option>
                {Object.entries(BENEFICIARY_TAGS).map(([slug, name]) => (
                  <option key={slug} value={slug}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={resetFilters}
              className="text-sm text-gray-500 hover:text-[#00b9fb]"
            >
              Resetuj filtry
            </button>
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1">
          <p className="text-sm text-gray-500 mb-4">
            {filteredResults.length.toLocaleString('pl-PL')} {filteredResults.length === 1 ? 'organizacja' : 'organizacji'}
            {query && ` dla „${query}"`}
          </p>

          <div className="space-y-4">
            {pageResults.map((org) => (
              <Link
                key={org.krs_number}
                href={`/organizacja/${org.slug}`}
                className="card block hover:border-[#00b9fb] transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-base">{org.name}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {formatVoivodeship(org.city)}, woj. {formatVoivodeship(org.voivodeship)} · KRS {org.krs_number}
                    </p>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{org.ai_summary}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <span className="badge badge-primary text-xs">
                        {CATEGORIES[org.primary_category] || org.primary_category}
                      </span>
                      {org.scope && (
                        <span className="badge badge-secondary text-xs">
                          {SCOPE_LABELS[org.scope] || org.scope}
                        </span>
                      )}
                    </div>
                  </div>
                  {org.size && (
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm text-gray-500">Rozmiar</p>
                      <p className="font-semibold text-gray-900">{SIZE_LABELS[org.size] || org.size}</p>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="flex items-center justify-center gap-2 mt-8" aria-label="Nawigacja między stronami wyników">
              <button
                onClick={() => { const p = Math.max(1, page - 1); setPage(p); pushUrl({ page: p }); }}
                disabled={page === 1}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-30 hover:bg-gray-50"
                aria-label="Poprzednia strona wyników"
              >
                ← Poprzednia
              </button>
              <span className="text-sm text-gray-500">
                {page} z {totalPages}
              </span>
              <button
                onClick={() => { const p = Math.min(totalPages, page + 1); setPage(p); pushUrl({ page: p }); }}
                disabled={page === totalPages}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-30 hover:bg-gray-50"
                aria-label="Następna strona wyników"
              >
                Następna →
              </button>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 text-lg">Ładowanie danych...</p>
      </div>
    }>
      <SearchPageInner />
    </Suspense>
  );
}
