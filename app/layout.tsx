import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: "You The Birthday — Your Personalized Birthday Experience",
    template: "%s | You The Birthday",
  },
  description:
    "Your birthday moodboard, trip planner, captions, colors, and cosmic map — all in one place. Personalized birthday dashboard powered by AI.",
  metadataBase: new URL("https://youthebirthday.app"),
  openGraph: {
    type: "website",
    siteName: "You The Birthday",
    title: "You The Birthday — Your Personalized Birthday Experience",
    description:
      "Your birthday moodboard, trip planner, captions, colors, and cosmic map — all in one place.",
  },
  twitter: {
    card: "summary_large_image",
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
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />

        {/* Organization + WebSite schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  name: "You The Birthday",
                  url: "https://youthebirthday.app",
                  description: "Personalized birthday experience platform — titles, captions, color palettes, destinations, and celebration plans curated for you.",
                },
                {
                  "@type": "WebSite",
                  name: "You The Birthday",
                  url: "https://youthebirthday.app",
                },
              ],
            }),
          }}
        />
      </body>
    </html>
  );
}
