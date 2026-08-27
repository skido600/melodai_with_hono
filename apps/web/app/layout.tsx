import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { MobileProvider } from "@/hooks/MobileContext";
import { ReactQueryProvider } from "@/context/TansackQuery";
import { Toaster } from "react-hot-toast";
const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta-sans",
  subsets: ["latin"],
});

const siteUrl = "https://your-melodia-domain.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Melodia | Music Streaming Platform",
    template: "%s | Melodia",
  },

  description:
    "Melodia is a modern music streaming platform where you can discover, listen to, and enjoy your favorite songs and artists.",

  keywords: [
    "Melodia",
    "Melodia Music",
    "Music Streaming",
    "Online Music",
    "Listen to Music",
    "Music Player",
    "Songs",
    "Artists",
    "Albums",
    "Music Platform",
  ],

  robots: {
    index: true,
    follow: true,
  },

  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },

  openGraph: {
    title: "Melodia | Music Streaming Platform",
    description:
      "Discover, stream, and enjoy your favorite music with Melodia.",
    url: siteUrl,
    siteName: "Melodia",
    images: [
      {
        url: `${siteUrl}/hero1.png`,
        alt: "Melodia Music Streaming Platform",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Melodia | Music Streaming Platform",
    description:
      "Discover, stream, and enjoy your favorite music with Melodia.",
    images: [`${siteUrl}/hero1.png`],
  },

  alternates: {
    canonical: siteUrl,
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ReactQueryProvider>
        <MobileProvider>
          <body className={`${jakartaSans.variable}`}>
            {" "}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
              }}
            />
            {children}
          </body>
        </MobileProvider>
      </ReactQueryProvider>
    </html>
  );
}
