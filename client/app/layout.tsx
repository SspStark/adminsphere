import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';

import AppProvider from '@/providers/app-provider';
import { Toaster } from 'sonner';

const geist = Geist({
  variable: '--font-geist',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'AdminSphere',
    template: '%s | AdminSphere',
  },
  description: 'Enterprise admin and task management platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-screen bg-background text-foreground">
        <AppProvider>
          {children}
          <Toaster richColors position="top-right" />
        </AppProvider>
      </body>
    </html>
  );
}
