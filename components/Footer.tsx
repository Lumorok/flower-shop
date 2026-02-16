'use client';

import { Phone, Mail, MapPin, Send } from 'lucide-react';

const TELEGRAM_OWNER_ID = process.env.NEXT_PUBLIC_TELEGRAM_OWNER_ID || '1602352560';
const TELEGRAM_LINK = `tg://user?id=${TELEGRAM_OWNER_ID}`;

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-100 py-12">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">Ц</span>
              </div>
              <span className="font-serif text-xl font-semibold text-white">
                Цветочный магазин
              </span>
            </div>
            <p className="text-gray-400">
              Свежие цветы и эксклюзивные букеты во Владивостоке. 
              Самовывоз и доставка через Telegram.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 text-white">Контакты</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-primary" />
                <span className="text-gray-400">+7 (953) 205 9141</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-primary" />
                <span className="text-gray-400">mihailsemeno86@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-gray-400">г. Владивосток</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 text-white">Часы работы</h3>
            <div className="space-y-2 text-gray-400">
              <p>Пн-Вс: 07:00 - 23:00</p>
              <p>Без выходных</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 text-white">Быстрая связь</h3>
            <a
              href={TELEGRAM_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>Написать владельцу</span>
            </a>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>© {currentYear} Цветочный магазин. Все права защищены.</p>
          <p className="text-sm mt-2">г. Владивосток, ул. Толстого, 38, ст. 1</p>
        </div>
      </div>
    </footer>
  );
}