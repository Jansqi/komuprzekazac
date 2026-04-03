import type { Metadata } from "next";
import Image from "next/image";
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
  openGraph: {
    siteName: "KomuPrzekazac.pl",
    locale: "pl_PL",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
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
            <Link href="/" className="flex items-center">
              <Image
                src="/icon-192.png"
                alt=""
                width={32}
                height={32}
                className="h-8 w-8 md:hidden"
              />
              <Image
                src="/logo-header.png"
                alt="KomuPrzekazac.pl"
                width={240}
                height={40}
                className="hidden md:block h-10 w-auto"
                priority
              />
            </Link>
            <div className="flex gap-4 text-sm">
              <Link href="/szukaj" className="text-gray-600 hover:text-[#00b9fb]">
                Szukaj
              </Link>
              <Link href="/o-serwisie" className="text-gray-600 hover:text-[#00b9fb]">
                O serwisie
              </Link>
            </div>
          </nav>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="bg-[#00b9fb] mt-12">
          <div className="max-w-6xl mx-auto px-4 py-8 text-sm text-white">
            <p>
              KomuPrzekazac.pl — niezależny serwis informacyjny. Dane ze sprawozdań OPP za rok 2024,
              złożonych w NIW-CRSO. Serwis nie ocenia ani nie rankinguje organizacji.
            </p>
            <div className="mt-2 flex gap-4">
              <Link href="/o-serwisie" className="hover:text-white/80">O serwisie</Link>
              <Link href="/dlaczego-nie-oceniamy" className="hover:text-white/80">Dlaczego nie oceniamy</Link>
              <Link href="/polityka-prywatnosci" className="hover:text-white/80">Polityka prywatności</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
