import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600", "700", "800"],
});

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://insighte.in"),
  title: {
    default: "Insighte — Find Child Therapists & Specialists in Bangalore",
    template: "%s | Insighte",
  },
  description:
    "Find verified speech therapists, occupational therapists, behavioral therapists, and special educators for your child. Matched to your child's needs in 10 minutes. Trusted by 1000+ families.",
  keywords: [
    "child therapy Bangalore",
    "speech therapy for kids",
    "autism support India",
    "occupational therapy for children",
    "behavioral therapy kids",
    "special educator near me",
    "child therapist Bangalore",
    "speech delay therapy",
    "OT for kids",
    "ABA therapy India",
    "child specialist Bangalore",
  ],
  openGraph: {
    title: "Insighte — Find the Right Child Specialist in Minutes",
    description: "Verified therapists, educators, and specialists matched to your child's needs. Trusted by 1000+ families in Bangalore.",
    type: "website",
    locale: "en_IN",
    url: "https://insighte.in",
  },
  twitter: {
    card: "summary_large_image",
    title: "Insighte — Find the Right Child Specialist in Minutes",
    description: "Verified therapists, educators, and specialists matched to your child's needs. Trusted by 1000+ families in Bangalore.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAF9" },
    { media: "(prefers-color-scheme: dark)", color: "#111224" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${manrope.variable} min-h-screen bg-[#111224] text-slate-50 antialiased selection:bg-[#D3C4B5]/30 overflow-x-hidden`} suppressHydrationWarning>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:font-semibold focus:rounded-md">
          Skip to main content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
