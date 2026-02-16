'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, User, X, Send } from 'lucide-react';
import { useStore } from '@/lib/store';

export default function ReviewsSection() {
  const [newReview, setNewReview] = useState({ author: '', comment: '', rating: 5 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { reviews, addReview, deleteReview } = useStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.author.trim() || !newReview.comment.trim()) return;
    setIsSubmitting(true);
    addReview({
      author: newReview.author,
      comment: newReview.comment,
      rating: newReview.rating,
    });
    setNewReview({ author: '', comment: '', rating: 5 });
    setIsSubmitting(false);
  };

  return (
    <section id="reviews" className="py-20">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Отзывы покупателей
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Поделитесь вашими впечатлениями. Мы ценим каждое мнение!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 max-w-2xl mx-auto"
        >
          <div className="bg-card rounded-xl p-6 shadow-soft dark:shadow-soft-dark">
            <h3 className="font-semibold text-lg text-foreground mb-4">
              Оставить отзыв
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ваше имя
                </label>
                <input
                  type="text"
                  value={newReview.author}
                  onChange={(e) => setNewReview(prev => ({ ...prev, author: e.target.value }))}
                  className="input-field"
                  placeholder="Как к вам обращаться?"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Оценка
                </label>
                <div className="flex space-x-1">
                  {[1,2,3,4,5].map((star) => (
                    <button key={star} type="button" onClick={() => setNewReview(prev => ({ ...prev, rating: star }))} className="p-1">
                      <Star className={`w-6 h-6 ${star <= newReview.rating ? 'text-primary fill-current' : 'text-gray-300 dark:text-gray-600'}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ваш отзыв
                </label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                  className="input-field min-h-[100px]"
                  placeholder="Поделитесь вашими впечатлениями..."
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting || !newReview.author.trim() || !newReview.comment.trim()}
                className="btn-primary flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Отправка...' : 'Опубликовать отзыв'}</span>
              </button>
            </form>
          </div>
        </motion.div>

        <AnimatePresence>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-xl p-6 shadow-soft dark:shadow-soft-dark"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{review.author}</h4>
                      <div className="flex items-center space-x-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-primary fill-current' : 'text-gray-300 dark:text-gray-600'}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteReview(review.id)}
                    className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-primary transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{review.comment}</p>
                <div className="text-sm text-gray-500 dark:text-gray-400">{review.date}</div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>

        {reviews.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <div className="inline-flex items-center justify-center p-4 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
              <Star className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="font-semibold text-lg text-foreground mb-2">
              Пока нет отзывов
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Будьте первым, кто оставит отзыв!
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}