import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";
import { Sidebar } from "@/components/ui/Sidebar";
import { Navbar } from "@/components/ui/Navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });

export const metadata: Metadata = {
  title: "Supply Chain DApp | Track. Verify. Trust.",
  description: "A production-grade blockchain supply chain management dApp.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-sans bg-[var(--color-bg)] text-[var(--color-text)] antialiased min-h-screen`}
      >
        <Providers>
          <div className="flex min-h-screen relative">
            <Sidebar />
            <main className="flex-1 flex flex-col min-h-screen max-w-full overflow-hidden">
              <Navbar />
              <div className="p-6 md:p-8 flex-1 w-full mx-auto max-w-[1200px]">
                {children}
              </div>
            </main>
          </div>
          <Toaster position="bottom-right" />
        </Providers>
      </body>
    </html>
  );
}
