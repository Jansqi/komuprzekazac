'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import type { DataFile } from '@/types/organization';

const MapView = dynamic(() => import('@/components/MapView'), { ssr: false });

export default function MapaPage() {
  const [data, setData] = useState<DataFile | null>(null);

  useEffect(() => {
    fetch('/data/organizations.json')
      .then((r) => r.json())
      .then((d: DataFile) => setData(d));
  }, []);

  const orgCount = data
    ? data.organizations.filter((o) => o.lat !== null && o.lng !== null).length
    : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Mapa organizacji
      </h1>
      <p className="text-sm text-gray-500 mb-4">
        {data
          ? `${orgCount.toLocaleString('pl-PL')} organizacji pożytku publicznego na mapie Polski.`
          : 'Ładowanie danych…'}
      </p>

      <div className="w-full rounded-xl border border-gray-200 overflow-hidden" style={{ height: '70vh' }}>
        {data ? (
          <MapView organizations={data.organizations} />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            Ładowanie mapy…
          </div>
        )}
      </div>
    </div>
  );
}
