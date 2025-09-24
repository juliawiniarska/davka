import "./globals.css";
import { Inter, Playfair_Display, Poppins } from "next/font/google";
import CookieBanner from './components/CookieBanner'

const poppins = Poppins({
  weight: ["400", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-poppins",
});
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const play = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-play",
});

export const metadata = {
  title: "davka.",
  description:
    "davka. – elegancka kawiarnia w centrum Nysy. Wyjątkowa kawa specialty, matcha, lody rzemieślnicze, śniadania, drinki, piwo Peroni i wino w klimatycznym wnętrzu.",
  keywords: [
    "kawiarnia Nysa",
    "kawa specialty Nysa",
    "matcha Nysa",
    "lody rzemieślnicze Nysa",
    "śniadania Nysa",
    "drinki Nysa",
    "wino Nysa",
    "piwo Peroni Nysa",
    "ciasta Nysa",
    "davka kawiarnia",
  ],
  openGraph: {
    title: "davka.",
    description:
      "Odwiedź davka. w centrum Nysy – kawa specialty, matcha, lody rzemieślnicze, śniadania, drinki, piwo Peroni i wino w eleganckim wnętrzu.",
    url: "https://davkacafe.pl",
    siteName: "davka.",
    images: [
      {
        url: "/logo.png",
        width: 192,
        height: 192,
        alt: "davka. kawiarnia w Nysie",
      },
    ],
    locale: "pl_PL",
    type: "website",
  },
icons: {
    icon: "/logo-50x50.png",       
    shortcut: "/logo-50x50.png",
    apple: "/logo-225x225.png",    
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" className={poppins.variable}>
      <body className="font-poppins bg-white text-gray-900">
        {children}
         <CookieBanner />
      </body>
    </html>
  );
}
