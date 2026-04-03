import { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: { canonical: '/szukaj' },
  title: 'Szukaj organizacji',
  description: 'Wyszukaj wśród 9 671 organizacji pożytku publicznego. Filtruj po kategorii, województwie, zasięgu i rozmiarze.',
  openGraph: {
    title: 'Szukaj organizacji | KomuPrzekazac.pl',
    description: 'Wyszukaj wśród 9 671 organizacji pożytku publicznego. Filtruj po kategorii, województwie, zasięgu i rozmiarze.',
  },
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
