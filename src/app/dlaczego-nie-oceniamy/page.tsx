import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dlaczego nie oceniamy organizacji',
  description: 'Wyjaśniamy, dlaczego KomuPrzekazac.pl nie stosuje scoringu ani rankingów organizacji pożytku publicznego.',
  openGraph: {
    title: 'Dlaczego nie oceniamy organizacji | KomuPrzekazac.pl',
    description: 'Wyjaśniamy, dlaczego KomuPrzekazac.pl nie stosuje scoringu ani rankingów organizacji pożytku publicznego.',
  },
};

export default function WhyNoRatingPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Dlaczego nie oceniamy organizacji pożytku publicznego
      </h1>

      <div className="prose prose-gray max-w-none space-y-4">
        <p>
          Wiele serwisów porównujących organizacje pozarządowe stosuje systemy punktowe, gwiazdki
          lub rankingi. My tego nie robimy — i to jest świadoma decyzja, nie brak funkcjonalności.
        </p>

        <h2 className="text-xl font-semibold mt-8">Problem z scoringiem</h2>
        <p>
          Każdy system oceny punktowej wymaga arbitralnej formuły: jakie wagi przypisać przychodom,
          kosztom administracyjnym, liczbie beneficjentów? Każdy wybór wag faworyzuje jedne organizacje
          kosztem innych. Szkoła specjalna z wysokimi kosztami osobowymi (nauczyciele!) wygląda
          &quot;gorzej&quot; niż fundacja grantowa, która po prostu przekazuje pieniądze dalej.
        </p>

        <h2 className="text-xl font-semibold mt-8">Mit kosztów administracyjnych</h2>
        <p>
          W 2013 roku trzy największe amerykańskie organizacje ewaluujące nonprofity — BBB Wise Giving
          Alliance, Charity Navigator i GuideStar — opublikowały wspólny list otwarty &quot;The Overhead
          Myth&quot;, w którym przyznały, że ocenianie organizacji na podstawie stosunku kosztów
          administracyjnych do kosztów ogólnych jest mylące i szkodliwe.
        </p>
        <p>
          Hospicjum potrzebuje lekarzy. Szkoła potrzebuje nauczycieli. Organizacja ratownicza
          potrzebuje sprzętu i szkoleń. Niskie koszty administracyjne nie oznaczają efektywności —
          często oznaczają niedoinwestowanie.
        </p>

        <h2 className="text-xl font-semibold mt-8">Co robimy zamiast tego</h2>
        <p>
          Prezentujemy dane finansowe <strong>zawsze z kontekstem</strong>: na tle średniej w danej
          kategorii tematycznej. Pokazujemy sygnały transparentności — czy organizacja ma stronę WWW,
          email kontaktowy, czy złożyła pełne sprawozdanie, jak długo ma status OPP. To fakty,
          nie wyroki.
        </p>
        <p>
          Podatnik wspierający lokalny klub sportowy ma inne kryteria niż wspierający fundację
          onkologiczną — i oba wybory są równie ważne. Naszą rolą jest dostarczyć informacje,
          nie narzucać ocenę.
        </p>
      </div>
    </div>
  );
}
