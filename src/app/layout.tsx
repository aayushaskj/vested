import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  metadataBase: new URL("https://vested.blog"),
  title: {
    default: "Vested — US investing & RSUs for Indian residents",
    template: "%s · Vested",
  },
  description:
    "Clear, practical guides on investing in US markets and managing RSUs as an Indian resident. LRS, taxes, brokerages, and reinvesting strategies.",
  openGraph: {
    title: "Vested",
    description:
      "US investing & RSU management, written for Indian residents.",
    url: "https://vested.blog",
    siteName: "Vested",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vested",
    description: "US investing & RSU management, written for Indian residents.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-white">
      <head>
        <link rel="preconnect" href="https://rsms.me/" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </head>
      <body className="min-h-screen bg-white text-ink-900 font-sans antialiased flex flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
