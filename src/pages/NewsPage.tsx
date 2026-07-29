import React, { useState } from 'react';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { newsData } from '../data/newsData';
import { NewsCard } from '../components/cards/NewsCard';
import { EditableText } from '../components/admin/EditableText';

export const NewsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Announcements', 'Events', 'Guides'];

  const filteredNews = newsData.filter(item => 
    selectedCategory === 'All' || item.category === selectedCategory
  );

  return (
    <div className="space-y-xl py-sm">
      <div className="container-custom space-y-md">
        <Breadcrumbs items={[{ label: 'News & Events' }]} />

        {/* Page Header */}
        <div className="space-y-xs">
          <EditableText 
            contentKey="news_title"
            tag="h1"
            className="font-headline-xl-mobile md:font-headline-xl text-headline-xl-mobile md:text-headline-xl text-primary font-bold"
          />
          <EditableText 
            contentKey="news_subtitle"
            tag="p"
            className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl leading-relaxed"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-outline-variant/20">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2.5 rounded font-label-lg text-label-lg whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat 
                  ? 'bg-primary text-on-primary shadow-sm' 
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {filteredNews.map(news => (
            <NewsCard key={news.id} news={news} />
          ))}
        </div>
      </div>
    </div>
  );
};
export default NewsPage;

