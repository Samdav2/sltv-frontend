import type { Metadata } from "next";
import { Fredoka } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-fredoka",
});

export const metadata: Metadata = {
  title: {
    default: "EZY VTU | Instant Airtime, Data & Bill Pay",
    template: "%s | EZY VTU",
  },
  description: "The fastest and most reliable platform for Airtime, Data Bundles, Cable TV subscriptions, and Electricity bill payments in Nigeria. Instant delivery, secure transactions.",
  keywords: ["VTU", "Airtime", "Data", "Nigeria", "Electricity", "Cable TV", "Bill Payment", "EZY VTU"],
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://ezyvtu.com.ng",
    siteName: "EZY VTU",
    title: "EZY VTU | Instant Airtime, Data & Bill Pay",
    description: "Fastest VTU platform in Nigeria for Airtime, Data, and Bills.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "EZY VTU Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EZY VTU | Instant Airtime, Data & Bill Pay",
    description: "Fastest VTU platform in Nigeria for Airtime, Data, and Bills.",
    images: ["/og-image.png"],
  },
};

import Providers from "./providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${fredoka.variable} antialiased font-sans bg-gray-50 text-gray-700`}
      >
        <Providers>
          {children}
          <Toaster position="top-center" richColors />
        </Providers>
      </body>
    </html>
  );
}
