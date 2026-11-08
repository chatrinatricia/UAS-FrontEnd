import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import { getSession } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const display = Playfair_Display({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-display" });
const body = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-body" });

export const metadata: Metadata = {
  title: { default: "Kerak Telor | Legenda Betawi", template: "%s | Kerak Telor" },
  description:
    "Website edukasi dan promosi kuliner Kerak Telor Betawi: sejarah, cara pembuatan, rekomendasi tempat di Jakarta, dan ulasan pengunjung.",
  icons: { icon: "/images/logo.jpeg" },
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  return (
    <html lang="id" className={`${display.variable} ${body.variable}`}>
      <body>
        <Navbar role={session?.role} />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
