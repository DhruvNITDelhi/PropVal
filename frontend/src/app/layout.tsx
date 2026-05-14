import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PropVal — AI Property Price Predictor | 100+ Indian Cities",
  description:
    "Get instant, transparent property valuations for land, houses, apartments, and commercial buildings across 100+ Indian cities. Powered by a hybrid AI engine with confidence scoring.",
  keywords: [
    "property valuation India",
    "house price prediction",
    "land price estimator",
    "real estate valuation",
    "property price calculator",
  ],
  authors: [{ name: "Dhruv", url: "https://github.com/DhruvNITDelhi" }],
  openGraph: {
    title: "PropVal — Know Your Property's True Worth",
    description: "Instant AI-powered property price predictions for 100+ Indian cities",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0d9488" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
