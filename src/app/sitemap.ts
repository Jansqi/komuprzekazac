import type { MetadataRoute } from 'next';
import { getAllSlugs } from '@/lib/data';
import { CATEGORIES, VOIVODESHIPS } from '@/lib/constants';

// Required by `output: 'export'` — sitemap must be statically generated at build time.
export const dynamic = 'force-static';

const BASE_URL = 'https://komuprzekazac.pl';

export default function sitemap(): MetadataRoute.Sitemap {
  // Shared timestamp so every URL in one build has the same lastModified value.
  const lastModified = new Date();

  const staticPaths = [
    '/',
    '/szukaj',
    '/o-serwisie',
    '/dlaczego-nie-oceniamy',
    '/polityka-prywatnosci',
  ];

  const categorySlugs = Object.keys(CATEGORIES).slice().sort();
  const voivodeshipSlugs = Object.values(VOIVODESHIPS).slice().sort();
  const orgSlugs = getAllSlugs();

  const entries: MetadataRoute.Sitemap = [];

  for (const path of staticPaths) {
    entries.push({
      url: path === '/' ? BASE_URL : `${BASE_URL}${path}`,
      lastModified,
    });
  }

  for (const slug of categorySlugs) {
    entries.push({ url: `${BASE_URL}/kategoria/${slug}`, lastModified });
  }

  for (const slug of voivodeshipSlugs) {
    entries.push({ url: `${BASE_URL}/wojewodztwo/${slug}`, lastModified });
  }

  for (const slug of orgSlugs) {
    entries.push({ url: `${BASE_URL}/organizacja/${slug}`, lastModified });
  }

  return entries;
}
