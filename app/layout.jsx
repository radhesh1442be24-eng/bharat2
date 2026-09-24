import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata = {
  title: "Bharat Tyres — Tyre Size Calculator & Upsize Tool",
  description: "Official Bharat Tyres mobile tyre size calculator. Calculate exact tyre dimensions, sidewall height, circumference, revs per km, and compare upsize & downsize alternatives.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-full bg-[#070d1e] text-slate-100 antialiased`}>
        {children}
      </body>
    </html>
  );
}
