import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Polityka prywatności',
  description: 'Polityka prywatności serwisu KomuPrzekazac.pl',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Polityka prywatności</h1>

      <div className="prose prose-gray max-w-none space-y-4">
        <p>
          Serwis KomuPrzekazac.pl szanuje prywatność użytkowników.
        </p>

        <h2 className="text-xl font-semibold mt-8">Dane osobowe</h2>
        <p>
          Serwis nie zbiera, nie przetwarza ani nie przechowuje danych osobowych użytkowników.
          Nie wymaga rejestracji, logowania ani podawania jakichkolwiek danych.
        </p>

        <h2 className="text-xl font-semibold mt-8">Pliki cookies</h2>
        <p>
          Serwis nie stosuje plików cookies ani żadnych mechanizmów śledzenia użytkowników.
        </p>

        <h2 className="text-xl font-semibold mt-8">Dane organizacji</h2>
        <p>
          Dane prezentowane w serwisie pochodzą z publicznych źródeł: sprawozdań złożonych w NIW-CRSO
          oraz Krajowego Rejestru Sądowego. Są to informacje publiczne, udostępniane na podstawie
          przepisów o dostępie do informacji publicznej.
        </p>

        <h2 className="text-xl font-semibold mt-8">Kontakt</h2>
        <p>
          W sprawach związanych z prywatnością prosimy o kontakt:{' '}
          <a href="mailto:janrogulski@gmail.com" className="text-blue-600 hover:text-blue-800">
            janrogulski@gmail.com
          </a>
        </p>

        <p className="text-sm text-gray-400 mt-8">
          Ostatnia aktualizacja: kwiecień 2026
        </p>
      </div>
    </div>
  );
}
