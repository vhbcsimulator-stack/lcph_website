import React, { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { newsData } from '../data/newsData';
import { NewsCard } from '../components/cards/NewsCard';
import { EditableText } from '../components/admin/EditableText';
import { ArrowRight, Calendar, Clock } from 'lucide-react';

export const NewsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const prefersReducedMotion = useReducedMotion();

  const categories = ['All', 'Announcements', 'Events', 'Guides'];

  const filteredNews = newsData.filter(item => 
    selectedCategory === 'All' || item.category === selectedCategory
  );
  const featuredArticle = selectedCategory === 'All' ? newsData.find((item) => item.featured) : undefined;
  const articles = featuredArticle ? filteredNews.filter((item) => item.id !== featuredArticle.id) : filteredNews;

  return (
    <div className="overflow-hidden pb-xl">
      <div className="border-b border-outline-variant/20 via-surface-container-low to-surface">
        <div className="container-custom pb-10 pt-sm md:pb-14">
        <Breadcrumbs items={[{ label: 'News & Events' }]} />

        {/* Page Header */}
        <div className="grid items-end gap-6 pt-8 md:grid-cols-[1fr_auto] md:pt-12">
          <div className="max-w-3xl">
          <EditableText 
            contentKey="news_title"
            tag="h1"
            className="font-headline-xl-mobile text-headline-xl-mobile font-bold capitalize tracking-tight text-primary md:font-headline-xl md:text-headline-xl"
          />
          <EditableText 
            contentKey="news_subtitle"
            tag="p"
            className="mt-3 max-w-2xl font-body-lg text-body-lg leading-relaxed text-on-surface-variant"
          />
          </div>
        </div>
        </div>
      </div>

      <div className="container-custom space-y-9 pt-10 md:pt-12">

        {/* Categories */}
        <div className="flex items-center justify-between gap-4 border-b border-outline-variant/20 pb-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`cursor-pointer whitespace-nowrap rounded-full border px-5 py-2.5 font-label-lg text-[12px] font-bold uppercase tracking-wider transition-all ${
                selectedCategory === cat 
                  ? 'border-primary bg-primary text-on-primary shadow-md' 
                  : 'border-outline-variant/40 bg-surface-container-lowest text-on-surface-variant hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary hover:shadow-sm'
              }`}
            >
              {cat}
            </button>
          ))}
          </div>
          <p className="hidden shrink-0 text-body-sm text-on-surface-variant sm:block">
            <span className="font-bold text-on-surface">{filteredNews.length}</span> {filteredNews.length === 1 ? 'story' : 'stories'}
          </p>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={selectedCategory}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.32, ease: [0.2, 0, 0, 1] }}
            className="space-y-9"
          >
            {featuredArticle && (
              <article className="group grid overflow-hidden rounded-2xl border border-outline-variant/20 bg-surface-container-lowest shadow-[0_20px_50px_-34px_rgba(0,67,33,0.55)] lg:grid-cols-[1.15fr_0.85fr]">
                <Link to={`/news/${featuredArticle.slug}`} className="relative min-h-[300px] overflow-hidden lg:min-h-[420px]">
                  <img
                    src={featuredArticle.image}
                    alt={featuredArticle.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/10" />
                  <span className="absolute left-5 top-5 rounded-full bg-primary-fixed px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-on-primary-fixed shadow-sm">
                    <EditableText contentKey="news_featured_badge" value="Featured story" tag="span" inline />
                  </span>
                </Link>

                <div className="flex flex-col justify-center p-7 md:p-10 lg:p-12">
                  <span className="mb-4 w-fit rounded-full bg-secondary-container/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-secondary">
                    {featuredArticle.category}
                  </span>
                  <div className="mb-3 flex flex-wrap items-center gap-3 text-xs font-semibold text-on-surface-variant">
                    <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-primary" />{featuredArticle.date}</span>
                    <span className="h-1 w-1 rounded-full bg-outline-variant" />
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-primary" />{featuredArticle.readTime}</span>
                  </div>
                  <h2 className="font-headline-md text-headline-md font-bold leading-snug text-on-surface transition-colors group-hover:text-primary md:text-[30px]">
                    {featuredArticle.title}
                  </h2>
                  <p className="mt-4 font-body-md text-body-md leading-relaxed text-on-surface-variant">{featuredArticle.excerpt}</p>
                  <Link to={`/news/${featuredArticle.slug}`} className="home-cta group/link mt-7 inline-flex w-fit items-center gap-2 rounded-lg bg-primary px-5 py-3 text-xs font-bold uppercase tracking-wider text-on-primary hover:bg-primary-container">
                    <EditableText contentKey="news_featured_cta" value="Read featured story" tag="span" inline />
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1" />
                  </Link>
                </div>
              </article>
            )}

            {articles.length > 0 && (
              <div>
                <div className="mb-5 flex items-center gap-4">
                  {selectedCategory === 'All' ? (
                    <EditableText
                      contentKey="news_latest_title"
                      value="Latest stories"
                      className="shrink-0 font-headline-sm text-headline-sm font-bold text-on-surface"
                      tag="h2"
                      inline
                    />
                  ) : (
                    <h2 className="shrink-0 font-headline-sm text-headline-sm font-bold text-on-surface">
                      {selectedCategory}
                    </h2>
                  )}
                  <div className="h-px flex-1 bg-outline-variant/25" />
                </div>
                <div className="grid grid-cols-1 gap-gutter md:grid-cols-2 lg:grid-cols-3">
                  {articles.map(news => <NewsCard key={news.id} news={news} />)}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
export default NewsPage;
