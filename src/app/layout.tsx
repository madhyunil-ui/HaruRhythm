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
  title: "Haru Rhythm | 나만의 감정 숲 가꾸기",
  description: "오늘의 기분에 맞는 음악과 루틴으로 하루를 채우고, 나만의 이모지 정원을 만들어보세요.",
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: "Haru Rhythm | 나만의 감정 숲 가꾸기",
    description: "오늘의 기분에 맞는 음악과 루틴으로 하루를 채우고, 나만의 이모지 정원을 만들어보세요.",
    type: "website",
    locale: "ko_KR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
