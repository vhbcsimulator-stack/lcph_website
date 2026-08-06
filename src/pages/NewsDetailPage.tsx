import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { useAdmin } from '../context/AdminContext';
import { EditableImage } from '../components/admin/EditableImage';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { EditableText } from '../components/admin/EditableText';

export const NewsDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { news, updateNewsField } = useAdmin();
  const article = news.find((n) => n.slug === slug) || news[0];

  if (!article) return null;

  return (
    <div className="space-y-xl py-sm">
      <div className="container-custom space-y-md max-w-4xl mx-auto">
        <Breadcrumbs items={[
          { label: 'News & Events', path: '/news' },
          { label: article.title }
        ]} />

        <div className="space-y-sm">
          <span className="bg-secondary-container text-on-secondary-container text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded inline-block">
            <EditableText
              value={article.category}
              onSave={(val: string) => updateNewsField(article.id, 'category', val as any)}
              tag="span"
              inline
            />
          </span>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface font-bold leading-tight">
            <EditableText
              value={article.title}
              onSave={(val: string) => updateNewsField(article.id, 'title', val)}
              tag="span"
              inline
            />
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-body-sm text-body-sm text-on-surface-variant pt-2 border-b border-outline-variant/30 pb-4">
            <span className="flex items-center gap-1 font-semibold text-on-surface">
              <Calendar className="w-4 h-4 text-primary" />
              <span><EditableText value={article.date} onSave={(val: string) => updateNewsField(article.id, 'date', val)} tag="span" inline /></span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-outline" />
              <span><EditableText value={article.readTime} onSave={(val: string) => updateNewsField(article.id, 'readTime', val)} tag="span" inline /></span>
            </span>
            <span>•</span>
            <span><EditableText contentKey="news_detail_byline" value="By" tag="span" inline /> <EditableText value={article.author} onSave={(val: string) => updateNewsField(article.id, 'author', val)} tag="span" inline /></span>
          </div>
        </div>

        <div className="aspect-[16/9] rounded-xl overflow-hidden shadow-md border border-outline-variant/20">
          <EditableImage value={article.image} onSave={(val: string) => updateNewsField(article.id, 'image', val)}>
            {(src: string) => <img src={src} alt={article.title} className="w-full h-full object-cover" />}
          </EditableImage>
        </div>

        <div className="prose max-w-none text-on-surface-variant text-body-md leading-relaxed space-y-4 pt-4">
          <EditableText
            value={article.excerpt}
            onSave={(val: string) => updateNewsField(article.id, 'excerpt', val)}
            className="font-bold text-on-surface text-body-lg"
            tag="p"
            multiline={true}
          />
          <EditableText value={article.content} onSave={(val: string) => updateNewsField(article.id, 'content', val)} tag="p" multiline={true} />
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
