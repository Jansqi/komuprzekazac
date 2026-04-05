'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import Link from 'next/link';
import type { Organization } from '@/types/organization';
import { CATEGORIES } from '@/lib/constants';
import { formatVoivodeship } from '@/lib/format';

import 'leaflet/dist/leaflet.css';

// Fix default marker icon (Leaflet's asset path breaks with bundlers)
const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createClusterIcon(cluster: any) {
  const count = cluster.getChildCount();
  let size = 'small';
  let diameter = 36;
  if (count >= 100) {
    size = 'large';
    diameter = 48;
  } else if (count >= 10) {
    size = 'medium';
    diameter = 42;
  }
  return L.divIcon({
    html: `<div class="cluster-icon cluster-icon-${size}">${count}</div>`,
    className: 'custom-cluster',
    iconSize: L.point(diameter, diameter),
  });
}

interface MapViewProps {
  organizations: Organization[];
}

export default function MapView({ organizations }: MapViewProps) {
  const orgsWithCoords = organizations.filter(
    (o): o is Organization & { lat: number; lng: number } =>
      o.lat !== null && o.lng !== null
  );

  return (
    <MapContainer
      center={[52, 19.5]}
      zoom={6}
      className="h-full w-full rounded-xl"
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MarkerClusterGroup
        chunkedLoading
        iconCreateFunction={createClusterIcon}
        maxClusterRadius={60}
        spiderfyOnMaxZoom
        showCoverageOnHover={false}
      >
        {orgsWithCoords.map((org) => (
          <Marker
            key={org.krs_number}
            position={[org.lat, org.lng]}
            icon={markerIcon}
          >
            <Popup>
              <div className="text-sm leading-snug">
                <p className="font-semibold text-gray-900 mb-1">{org.name}</p>
                <p className="text-xs text-gray-500">
                  {CATEGORIES[org.primary_category] || org.primary_category}
                </p>
                <p className="text-xs text-gray-500 mb-2">
                  {formatVoivodeship(org.city)}, woj.{' '}
                  {formatVoivodeship(org.voivodeship)}
                </p>
                <Link
                  href={`/organizacja/${org.slug}`}
                  className="text-[#00b9fb] hover:text-[#009dd4] text-xs font-medium"
                >
                  Zobacz profil &rarr;
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
}
