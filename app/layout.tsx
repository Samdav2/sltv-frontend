import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "SwiftVTU | Instant Airtime, Data & Bill Pay",
    template: "%s | SwiftVTU",
  },
  description: "The fastest and most reliable platform for Airtime, Data Bundles, Cable TV subscriptions, and Electricity bill payments in Nigeria. Instant delivery, secure transactions.",
  keywords: ["VTU", "Airtime", "Data", "Nigeria", "Electricity", "Cable TV", "Bill Payment", "SwiftVTU"],
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://swiftvtu.com",
    siteName: "SwiftVTU",
    title: "SwiftVTU | Instant Airtime, Data & Bill Pay",
    description: "Fastest VTU platform in Nigeria for Airtime, Data, and Bills.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SwiftVTU Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SwiftVTU | Instant Airtime, Data & Bill Pay",
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
    <html lang="en" className="scroll-smooth">
      <body
        className={`${poppins.variable} antialiased font-sans bg-gray-50 text-gray-700`}
      >
        <Providers>
          {children}
          <Toaster position="top-center" richColors />
        </Providers>
      </body>
    </html>
  );
}
