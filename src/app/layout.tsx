
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AppHeader } from '@/components/AppHeader';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: '¿Qué tan roto estás?',
  description: 'Descubre tu índice de "rotura" emocional con este divertido quiz.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}>
        <AppHeader />
        <main className="flex-grow flex flex-col items-center justify-start p-4 sm:p-6 md:p-8">
          <div className="w-full max-w-2xl">
            {children}
          </div>
        </main>
        <Toaster />
        <footer className="text-center p-4 text-muted-foreground text-sm mt-auto">
          Hecho con <span className="text-destructive animate-pulse">💔</span> (y un poco de código)
        </footer>
      </body>
    </html>
  );
}
