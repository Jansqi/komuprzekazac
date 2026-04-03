import type { DataFile, Organization, CategoryAverage } from '@/types/organization';

// Import at build time for SSG
// eslint-disable-next-line @typescript-eslint/no-require-imports
const raw: DataFile = require('../../public/data/organizations.json');

export function getAllOrganizations(): Organization[] {
  return raw.organizations;
}

export function getOrganizationBySlug(slug: string): Organization | undefined {
  return raw.organizations.find(o => o.slug === slug);
}

export function getAllSlugs(): string[] {
  return raw.organizations.map(o => o.slug);
}

export function getCategoryAverages(): Record<string, CategoryAverage> {
  return raw.meta.category_averages;
}

export function getMeta() {
  return raw.meta;
}

export function getOrganizationsByCategory(category: string): Organization[] {
  return raw.organizations.filter(
    o => o.primary_category === category || o.related_categories.includes(category)
  );
}

export function getOrganizationsByVoivodeship(voivodeship: string): Organization[] {
  return raw.organizations.filter(
    o => o.voivodeship === voivodeship
  );
}

export function getCategoryCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const org of raw.organizations) {
    const cat = org.primary_category;
    counts[cat] = (counts[cat] || 0) + 1;
  }
  return counts;
}

export function getVoivodeshipCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const org of raw.organizations) {
    const v = org.voivodeship;
    counts[v] = (counts[v] || 0) + 1;
  }
  return counts;
}
