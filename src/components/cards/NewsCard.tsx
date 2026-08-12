import React from 'react';
import { Link } from 'react-router-dom';
import type { NewsArticle } from '../../types';
import { useAdmin } from '../../context/AdminContext';
import { EditableText } from '../admin/EditableText';
import { EditableRichText } from '../admin/EditableRichText';
import { EditableImage } from '../admin/EditableImage';
import { DeleteItemButton } from '../admin/AddItemButton';
import { ArrowRight, Calendar, Clock } from 'lucide-react';

interface NewsCardProps {
  news: NewsArticle;
}

export const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
  const { updateNewsField, deleteNews } = useAdmin();

  return (
    <article className="interactive-card bg-surface-container-lowest rounded-xl border border-outline-variant/20 overflow-hidden shadow-sm transition-all duration-300 flex flex-col group">
      <div className="relative aspect-[16/9] overflow-hidden">
        <EditableImage value={news.image} onSave={(val) => updateNewsField(news.id, 'image', val)}>
          {(src) => (
            <img
              src={src}
              alt={news.title}
              className="w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-700 ease-out"
            />
          )}
        </EditableImage>
        <span className="absolute top-3 left-3 z-40 bg-secondary-container text-on-secondary-container text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded backdrop-blur-md">
          <EditableText
            value={news.category}
            onSave={(val) => updateNewsField(news.id, 'category', val as NewsArticle['category'])}
            tag="span"
            inline
          />
        </span>
        <DeleteItemButton onClick={() => deleteNews(news.id)} title="Delete article" />
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center gap-3 text-body-sm text-body-sm text-on-surface-variant font-medium mb-1">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-primary" />
              <EditableText
                value={news.date}
                onSave={(val) => updateNewsField(news.id, 'date', val)}
                tag="span"
                inline
              />
            </span>
            <span>â€¢</span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-outline" />
              <EditableText
                value={news.readTime}
                onSave={(val) => updateNewsField(news.id, 'readTime', val)}
                tag="span"
                inline
              />
            </span>
          </div>

          <EditableText
            value={news.title}
            onSave={(val) => updateNewsField(news.id, 'title', val)}
            className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors line-clamp-2 font-bold"
            tag="h3"
          />

          <EditableRichText
            value={news.excerpt}
            onSave={(val) => updateNewsField(news.id, 'excerpt', val)}
            className="text-body-sm text-body-sm text-on-surface-variant mt-2 line-clamp-2 leading-relaxed"
            compact
          />
        </div>

        <Link
          to={`/news/${news.slug}`}
          className="group/link inline-flex items-center gap-1.5 text-label-lg font-label-lg text-primary hover:underline pt-2 border-t border-outline-variant/20 cursor-pointer"
        >
          <EditableText contentKey="card_news_cta" value="Read Full Article" tag="span" inline />
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/link:translate-x-1" />
        </Link>
      </div>
    </article>
  );
};

export default NewsCard;
