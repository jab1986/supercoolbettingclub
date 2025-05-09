import '../styles/globals.css';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';

// Load Inter font
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Betting League Table',
  description: 'Mobile-first betting league table app with player picks',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={`${inter.className} bg-white`}>{children}</body>
    </html>
  );
} 