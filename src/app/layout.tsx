import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ravi Kirana & General Store - Your Trusted Neighborhood Store in Nashik",
  description: "Ravi Kirana Store in Nashik offers fresh groceries, daily essentials, and exciting rewards. Earn coins on every purchase, get cashback, free gifts, and exclusive offers. Free delivery available.",
  keywords: "kirana store nashik, grocery store nashik, daily essentials, rewards store, coin system, cashback offers, free delivery nashik, general store nashik, ravi kirana store",
  authors: [{ name: "Ravi Kirana Store" }],
  creator: "Ravi Kirana Store",
  publisher: "Ravi Kirana Store",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://ravikirana.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Ravi Kirana & General Store - Nashik",
    description: "Your trusted neighborhood store for groceries and daily needs in Nashik. Earn coins, cashback, and free gifts with every purchase.",
    url: 'https://ravikirana.com',
    siteName: 'Ravi Kirana Store',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Ravi Kirana Store - Your Trusted Neighborhood Store',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Ravi Kirana & General Store - Nashik",
    description: "Your trusted neighborhood store for groceries and daily needs in Nashik. Earn rewards on every purchase.",
    images: ['/twitter-image.jpg'],
    creator: '@ravikiranastore',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  other: {
    'facebook:app_id': 'your-facebook-app-id',
    'og:price:amount': '100',
    'og:price:currency': 'INR',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Additional Meta Tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#8B5CF6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Ravi Kirana Store" />
        
        {/* Favicon Links */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Preload Critical Resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        
        {/* Structured Data for Local Business */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "GroceryStore",
              "name": "Ravi Kirana & General Store",
              "description": "Your trusted neighborhood store for groceries and daily needs in Nashik",
              "url": "https://ravikirana.com",
              "telephone": "+91-9876543210",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Near Main Market",
                "addressLocality": "Nashik",
                "addressRegion": "Maharashtra",
                "postalCode": "422009",
                "addressCountry": "IN"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "19.9975",
                "longitude": "73.7906"
              },
              "openingHours": [
                "Mo-Su 07:00-14:00",
                "Mo-Su 16:00-22:00"
              ],
              "priceRange": "₹₹",
              "servesCuisine": "Indian Groceries",
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Store Rewards",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Coin Rewards"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Cashback Offers"
                    }
                  }
                ]
              },
              "sameAs": [
                "https://www.facebook.com/ravikiranastore",
                "https://www.instagram.com/ravikiranastore"
              ]
            })
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}