import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'O serwisie',
  description: 'KomuPrzekazac.pl — niezależny serwis informacyjny o organizacjach pożytku publicznego.',
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">O serwisie</h1>

      <div className="prose prose-gray max-w-none space-y-4">
        <p>
          <strong>KomuPrzekazac.pl</strong> to niezależny serwis informacyjny, który pomaga polskim
          podatnikom świadomie wybrać organizację pożytku publicznego (OPP) do przekazania 1,5% podatku
          dochodowego.
        </p>

        <h2 className="text-xl font-semibold mt-8">Skąd pochodzą dane?</h2>
        <p>
          Prezentujemy dane z oficjalnych sprawozdań merytorycznych i finansowych za rok 2024,
          złożonych przez organizacje w Narodowym Instytucie Wolności — Centrum Rozwoju Społeczeństwa
          Obywatelskiego (NIW-CRSO). Dodatkowo wzbogacamy je o dane z Krajowego Rejestru Sądowego (KRS).
        </p>
        <p>
          Opisy organizacji zostały wygenerowane przez sztuczną inteligencję na podstawie celów
          statutowych i opisów działalności z oficjalnych dokumentów. Służą one wyłącznie jako
          przystępne streszczenie — zachęcamy do weryfikacji na stronach organizacji i w eKRS.
        </p>

        <h2 className="text-xl font-semibold mt-8">Dlaczego nie oceniamy?</h2>
        <p>
          Świadomie nie stosujemy scoringu, rankingów ani ocen punktowych. Każda arbitralna formuła
          oceny faworyzuje jedne organizacje kosztem innych, a badania pokazują, że scoring prowadzi
          do manipulacji danymi. Zamiast tego prezentujemy fakty i sygnały transparentności — decyzja
          należy do Ciebie.
        </p>
        <p>
          <Link href="/dlaczego-nie-oceniamy" className="text-blue-600 hover:text-blue-800">
            Przeczytaj więcej o naszym podejściu →
          </Link>
        </p>

        <h2 className="text-xl font-semibold mt-8">Ile organizacji jest w bazie?</h2>
        <p>
          Serwis obejmuje 9 671 organizacji pożytku publicznego uprawnionych do otrzymania 1,5%
          podatku za rok 2025 (w rozliczeniu za 2026). Lista pochodzi z oficjalnego wykazu NIW.
        </p>

        <h2 className="text-xl font-semibold mt-8">Kontakt</h2>
        <p>
          Serwis prowadzony jest przez Upgraider (JDG). Pytania i uwagi:{' '}
          <a href="mailto:janrogulski@gmail.com" className="text-blue-600 hover:text-blue-800">
            janrogulski@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}
