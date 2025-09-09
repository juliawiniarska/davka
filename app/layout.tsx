import "./globals.css";
import { Inter, Playfair_Display } from "next/font/google";
import { Poppins } from 'next/font/google'

const poppins = Poppins({
  weight: ['400', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-poppins',
})
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const play  = Playfair_Display({ subsets: ["latin"], variable: "--font-play" });

export const metadata = { title: "davka." };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
<html lang="pl" className={poppins.variable}>
      <body className="font-poppins">{children}</body>
    </html>
  );
}
