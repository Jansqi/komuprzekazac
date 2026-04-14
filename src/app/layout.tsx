import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import ReportBugButton from "@/components/ReportBugButton";
import "./globals.css";

const SITE_DESCRIPTION =
  "Porównaj 9 671 organizacji pożytku publicznego. Dane finansowe, opisy działalności, sygnały transparentności. Wybierz świadomie, komu przekazać 1,5% podatku.";

export const metadata: Metadata = {
  title: {
    default: "KomuPrzekazac.pl - Sprawdź organizacje pożytku publicznego",
    template: "%s | KomuPrzekazac.pl",
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL("https://komuprzekazac.pl"),
  openGraph: {
    siteName: "KomuPrzekazac.pl",
    locale: "pl_PL",
    type: "website",
    url: "https://komuprzekazac.pl",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "KomuPrzekazac.pl — porównaj organizacje pożytku publicznego",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KomuPrzekazac.pl",
    description: SITE_DESCRIPTION,
    images: ["/og-default.png"],
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
  // TODO: Jan wpisuje po założeniu property w GSC/Bing.
  // Main verification method: DNS TXT. Meta tag below is a fallback.
  verification: {
    google: "PLACEHOLDER_GOOGLE_VERIFICATION",
    other: { "msvalidate.01": "PLACEHOLDER_BING_VERIFICATION" },
  },
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
              <Link href="/#mapa" className="text-gray-600 hover:text-[#00b9fb]">
                Mapa
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
              KomuPrzekazac.pl - niezależny serwis informacyjny. Dane ze sprawozdań OPP za rok 2024,
              złożonych w NIW-CRSO. Serwis nie ocenia ani nie rankinguje organizacji.
            </p>
            <div className="mt-2 flex flex-wrap gap-4 items-center">
              <Link href="/o-serwisie" className="hover:text-white/80">O serwisie</Link>
              <Link href="/dlaczego-nie-oceniamy" className="hover:text-white/80">Dlaczego nie oceniamy</Link>
              <Link href="/polityka-prywatnosci" className="hover:text-white/80">Polityka prywatności</Link>
              <ReportBugButton variant="website" source="footer" />
            </div>
          </div>
        </footer>
        <Script
          id="tally-embed"
          src="https://tally.so/widgets/embed.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
