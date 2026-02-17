import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import CartModal from '@/components/CartModal';
import Footer from '@/components/Footer';
import { ThemeProvider } from '@/components/ThemeProvider';

export const metadata: Metadata = {
  title: 'Цветочный магазин во Владивостоке | Тюльпаны и упаковка',
  description: 'Эксклюзивные тюльпаны и всё для упаковки. Самовывоз и доставка.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className="antialiased">
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