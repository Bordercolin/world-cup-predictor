import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Prono Club | World Cup Predictor",
  description:
    "Create a private World Cup prediction group, forecast match scores, and compete with friends on a live leaderboard.",
  openGraph: {
    title: "Prono Club | World Cup Predictor",
    description:
      "Create a private World Cup prediction group, forecast match scores, and compete with friends on a live leaderboard.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prono Club | World Cup Predictor",
    description:
      "Create a private World Cup prediction group, forecast match scores, and compete with friends on a live leaderboard.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
