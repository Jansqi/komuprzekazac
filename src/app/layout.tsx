import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "KomuPrzekazac.pl — Sprawdź organizacje pożytku publicznego",
    template: "%s | KomuPrzekazac.pl",
  },
  description:
    "Porównaj 9 671 organizacji pożytku publicznego. Dane finansowe, opisy działalności, sygnały transparentności. Wybierz świadomie, komu przekazać 1,5% podatku.",
  metadataBase: new URL("https://komuprzekazac.pl"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
          <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-blue-800 hover:text-blue-600">
              KomuPrzekazac.pl
            </Link>
            <div className="flex gap-4 text-sm">
              <Link href="/szukaj" className="text-gray-600 hover:text-blue-600">
                Szukaj
              </Link>
              <Link href="/o-serwisie" className="text-gray-600 hover:text-blue-600">
                O serwisie
              </Link>
            </div>
          </nav>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-gray-200 bg-gray-50 mt-12">
          <div className="max-w-6xl mx-auto px-4 py-8 text-sm text-gray-500">
            <p>
              KomuPrzekazac.pl — niezależny serwis informacyjny. Dane ze sprawozdań OPP za rok 2024,
              złożonych w NIW-CRSO. Serwis nie ocenia ani nie rankinguje organizacji.
            </p>
            <div className="mt-2 flex gap-4">
              <Link href="/o-serwisie" className="hover:text-blue-600">O serwisie</Link>
              <Link href="/dlaczego-nie-oceniamy" className="hover:text-blue-600">Dlaczego nie oceniamy</Link>
              <Link href="/polityka-prywatnosci" className="hover:text-blue-600">Polityka prywatności</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
