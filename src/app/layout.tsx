import type { Metadata } from "next";
import {
  Noto_Sans_JP,
  Noto_Sans_KR,
  Yusei_Magic,
} from "next/font/google";
import "./globals.css";

const bodyFont = Noto_Sans_JP({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const bodyFontKr = Noto_Sans_KR({
  variable: "--font-body-kr",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const displayFont = Yusei_Magic({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Yukiharu SNS Content Kit",
  description: "Step-by-step AI wizard for pet-brand Instagram cards and slide videos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${bodyFont.variable} ${bodyFontKr.variable} ${displayFont.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
