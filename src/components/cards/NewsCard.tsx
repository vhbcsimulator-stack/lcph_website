import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import type { NewsArticle } from '../../types';

interface NewsCardProps {
  news: NewsArticle;
}

export const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group">
      <div className="relative aspect-[16/9] overflow-hidden">
        <img 
          src={news.image} 
          alt={news.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span className="absolute top-3 left-3 bg-secondary-container text-on-secondary-container text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded backdrop-blur-md">
          {news.category}
        </span>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center gap-3 text-body-sm text-body-sm text-on-surface-variant font-medium mb-1">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-primary" />
              {news.date}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-outline" />
              {news.readTime}
            </span>
          </div>

          <h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors line-clamp-2 font-bold">
            {news.title}
          </h3>

          <p className="text-body-sm text-body-sm text-on-surface-variant mt-2 line-clamp-2 leading-relaxed">
            {news.excerpt}
          </p>
        </div>

        <Link
          to={`/news/${news.slug}`}
          className="inline-flex items-center gap-1.5 text-label-lg font-label-lg text-primary hover:underline pt-2 border-t border-outline-variant/20 cursor-pointer"
        >
          <span>Read Full Article</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default NewsCard;
