import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  // Make the Inter font available as a CSS variable (--font-inter).
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "Student Management Dashboard",
  description: "A dashboard for managing students and their performance.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <body>{children}</body>
    </html>
  );
}
