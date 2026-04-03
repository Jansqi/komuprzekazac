'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Fuse from 'fuse.js';
import { CATEGORIES, VOIVODESHIPS, SCOPE_LABELS, SIZE_LABELS } from '@/lib/constants';
import { formatPLN, formatVoivodeship } from '@/lib/format';
import type { Organization, DataFile } from '@/types/organization';

const PER_PAGE = 20;

export default function SearchPage() {
  const [data, setData] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [voivodeship, setVoivodeship] = useState('');
  const [scope, setScope] = useState('');
  const [size, setSize] = useState('');
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

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

    return results;
  }, [query, category, voivodeship, scope, size, data, fuse]);

  const totalPages = Math.ceil(filteredResults.length / PER_PAGE);
  const pageResults = filteredResults.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const resetFilters = useCallback(() => {
    setQuery('');
    setCategory('');
    setVoivodeship('');
    setScope('');
    setSize('');
    setPage(1);
  }, []);

  useEffect(() => {
    setPage(1);
  }, [query, category, voivodeship, scope, size]);

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
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Wpisz nazwę, numer KRS, miasto..."
          className="w-full px-4 py-3 border border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Filter toggle (mobile) */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="md:hidden mb-4 text-sm text-blue-600 hover:text-blue-800"
      >
        {showFilters ? 'Ukryj filtry' : 'Pokaż filtry'} ▾
      </button>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters */}
        <aside className={`md:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden md:block'}`}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategoria</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Województwo</label>
              <select
                value={voivodeship}
                onChange={(e) => setVoivodeship(e.target.value)}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Zasięg</label>
              <select
                value={scope}
                onChange={(e) => setScope(e.target.value)}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Rozmiar</label>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value)}
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

            <button
              onClick={resetFilters}
              className="text-sm text-gray-500 hover:text-blue-600"
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
                className="card block hover:border-blue-200 transition-colors"
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
                  {org.revenue_total !== null && (
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm text-gray-500">Przychody</p>
                      <p className="font-semibold text-gray-900">{formatPLN(org.revenue_total)}</p>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-30 hover:bg-gray-50"
              >
                ← Poprzednia
              </button>
              <span className="text-sm text-gray-500">
                {page} z {totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-30 hover:bg-gray-50"
              >
                Następna →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
