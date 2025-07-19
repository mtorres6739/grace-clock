import './globals.css';
import type { Metadata } from 'next';
import { Inter, Roboto, Poppins, Playfair_Display, Montserrat } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
});

const roboto = Roboto({ 
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
  display: 'swap'
});

const poppins = Poppins({ 
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap'
});

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap'
});

const montserrat = Montserrat({ 
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'Modern Clock - Beautiful Time Display',
  description: 'A modern, elegant clock application with glassmorphism design, Bible verses, and customizable settings.',
  keywords: 'clock, time, glassmorphism, modern design, Bible verses',
  authors: [{ name: 'Modern Clock App' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`
        ${inter.variable} 
        ${roboto.variable} 
        ${poppins.variable} 
        ${playfair.variable} 
        ${montserrat.variable}
        font-sans antialiased
      `}>
        <TooltipProvider>
          {children}
          <Toaster />
        </TooltipProvider>
      </body>
    </html>
  );
}
