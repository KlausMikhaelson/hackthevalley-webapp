import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppThemeProvider } from './contexts/ThemeContext';
import { CustomThemeProvider } from './contexts/CustomThemeContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Financial Dashboard",
  description: "Track your spending limits and savings goals",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <CustomThemeProvider>
          <AppThemeProvider>
            {children}
          </AppThemeProvider>
        </CustomThemeProvider>
      </body>
    </html>
  );
}
