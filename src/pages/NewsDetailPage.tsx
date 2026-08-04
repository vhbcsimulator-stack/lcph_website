import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { newsData } from '../data/newsData';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { EditableText } from '../components/admin/EditableText';

export const NewsDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = newsData.find(n => n.slug === slug) || newsData[0];

  return (
    <div className="space-y-xl py-sm">
      <div className="container-custom space-y-md max-w-4xl mx-auto">
        <Breadcrumbs items={[
          { label: 'News & Events', path: '/news' },
          { label: article.title }
        ]} />

        <div className="space-y-sm">
          <span className="bg-secondary-container text-on-secondary-container text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded inline-block">
            {article.category}
          </span>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface font-bold leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-body-sm text-body-sm text-on-surface-variant pt-2 border-b border-outline-variant/30 pb-4">
            <span className="flex items-center gap-1 font-semibold text-on-surface">
              <Calendar className="w-4 h-4 text-primary" />
              <span>{article.date}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-outline" />
              <span>{article.readTime}</span>
            </span>
            <span>•</span>
            <span><EditableText contentKey="news_detail_byline" value="By" tag="span" inline /> {article.author}</span>
          </div>
        </div>

        <div className="aspect-[16/9] rounded-xl overflow-hidden shadow-md border border-outline-variant/20">
          <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
        </div>

        <div className="prose max-w-none text-on-surface-variant text-body-md leading-relaxed space-y-4 pt-4">
          <p className="font-bold text-on-surface text-body-lg">
            {article.excerpt}
          </p>
          <p>{article.content}</p>
        </div>

        <div className="pt-sm border-t border-outline-variant/30">
          <Link to="/news" className="inline-flex items-center gap-2 text-label-lg font-label-lg text-primary hover:underline cursor-pointer">
            <ArrowLeft className="w-4 h-4" />
            <EditableText contentKey="news_detail_back" value="Back to News &amp; Events" tag="span" inline />
          </Link>
        </div>
      </div>
    </div>
  );
};
export default NewsDetailPage;
