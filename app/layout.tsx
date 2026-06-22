import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import Link from "next/link";
import MusicPlayer from "@/app/components/MusicPlayer";
import "./globals.css";

const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "친사's Blog",
  description: "친사의 개인 블로그",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${notoSansKR.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-white text-gray-900" style={{fontFamily: 'var(--font-noto-sans-kr), sans-serif'}}>
        <header className="border-b border-gray-200 shadow-sm">
          <nav className="max-w-2xl mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="text-xl font-bold" style={{color: '#2563eb'}}>
              친사's Blog
            </Link>
            <div className="flex items-center gap-6">
              <MusicPlayer />
              <Link href="/" className="hover:text-blue-600 transition-colors">홈</Link>
              <Link href="/blog" className="hover:text-blue-600 transition-colors">블로그</Link>
              <Link href="/about" className="hover:text-blue-600 transition-colors">소개</Link>
            </div>
          </nav>
        </header>
        <main className="flex-1">
          {children}
        </main>
        <footer className="border-t border-gray-200">
          <div className="max-w-2xl mx-auto px-4 py-6 text-center text-sm" style={{color: '#9ca3af'}}>
            © 2026 친사's Blog. All rights reserved.
          </div>
        </footer>

      </body>
    </html>
  );
}