import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono, Orbitron } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "NEXUS // Continuum Authority",
  description:
    "Nexus is the convergence point of the multiverse — the console Continuum Operators use to monitor timeline stability, detect anomalies, and prevent catastrophic collapse.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${orbitron.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-void text-lavender">
        {children}
      </body>
    </html>
  );
}
