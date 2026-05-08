import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "친사's Blog",
  description: "친사의 개인 블로그",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="border-b border-gray-700">
          <nav className="max-w-2xl mx-auto px-4 py-4 flex justify-between items-center">
            <a href="/" className="text-xl font-bold">친사's Blog</a>
            <div className="flex gap-6">
              <a href="/" className="hover:text-gray-400">홈</a>
              <a href="/blog" className="hover:text-gray-400">블로그</a>
              <a href="/about" className="hover:text-gray-400">소개</a>
            </div>
          </nav>
        </header>
        <main className="flex-1">
          {children}
        </main>
        <footer className="border-t border-gray-700">
          <div className="max-w-2xl mx-auto px-4 py-6 text-center text-gray-500 text-sm">
            © 2026 친사's Blog. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}