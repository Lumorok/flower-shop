import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import CartModal from '@/components/CartModal';
import Footer from '@/components/Footer';
import { ThemeProvider } from '@/components/ThemeProvider';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
  title: 'Цветочный магазин во Владивостоке | Тюльпаны, букеты, самовывоз',
  description: 'Свежие цветы, тюльпаны премиум-сорта, авторские букеты. Самовывоз с 07:00 до 23:00, доставка через Telegram.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <CartModal />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}