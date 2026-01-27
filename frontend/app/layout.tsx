import type { Metadata } from "next";
import { Outfit, Space_Grotesk } from "next/font/google";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], variable: '--font-outfit' });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: '--font-space' });

export const metadata: Metadata = {
  title: "ISRO AI | Next Gen Mission Control",
  description: "Advanced AI Interface for ISRO Mission Data",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${spaceGrotesk.variable} font-outfit antialiased`}>
        <div className="cosmic-bg" />
        <div className="grid-bg" />
        <div className="orb orb-1" />
        <div className="orb orb-2" />

        <Navbar />

        <main className="relative z-10 min-h-screen w-full flex flex-col pt-20">
          {children}
        </main>
      </body>
    </html>
  );
}
