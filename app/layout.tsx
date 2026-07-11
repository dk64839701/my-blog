import type { Metadata, Viewport } from "next";
import { Noto_Sans_KR } from "next/font/google";
import Link from "next/link";
import MusicPlayer from "@/app/components/MusicPlayer";
import PWAInstaller from "@/app/components/PWAInstaller";
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
    apple: "/icons/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "친사 블로그",
  },
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
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
              친사&apos;s Blog
            </Link>
            <div className="flex flex-wrap items-center justify-end gap-x-6 gap-y-3">
              <MusicPlayer />
              <Link href="/" className="hover:text-blue-600 transition-colors">홈</Link>
              <Link href="/blog" className="hover:text-blue-600 transition-colors">블로그</Link>
              <Link href="/world-clock" className="hover:text-blue-600 transition-colors">세계 시간</Link>
              <Link href="/about" className="hover:text-blue-600 transition-colors">소개</Link>
            </div>
          </nav>
        </header>
        <PWAInstaller />
        <main className="flex-1">
          {children}
        </main>
        <footer className="border-t border-gray-200">
          <div className="max-w-2xl mx-auto px-4 py-6 text-center text-sm" style={{color: '#9ca3af'}}>
            © 2026 친사&apos;s Blog. All rights reserved.
            <span className="mx-2">·</span>
            <Link href="/admin" style={{color: '#d1d5db'}} className="hover:text-gray-400 transition-colors">
              관리자
            </Link>
          </div>
        </footer>

      </body>
    </html>
  );
}
