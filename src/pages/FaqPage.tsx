import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { faqsData } from '../data/faqsData';
import { Search, ChevronDown } from 'lucide-react';
import { AnimatedPage } from '../components/layout/AnimatedPage';
import { accordionTransition } from '../utils/animations';
import { EditableText } from '../components/admin/EditableText';

export const FaqPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [openFaqId, setOpenFaqId] = useState<string | null>(faqsData[0]?.id || null);

  const categories = ['All', 'About LCPH', 'Property Ownership', 'Payment Terms'];

  const filteredFaqs = faqsData.filter(faq => {
    const categoryMatch = activeCategory === 'All' || faq.category === activeCategory;
    const searchMatch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });

  return (
    <AnimatedPage className="space-y-xl py-sm overflow-hidden">
      <div className="container-custom space-y-md">
        <Breadcrumbs items={[{ label: 'FAQs' }]} />

        {/* Page Header */}
        <div className="space-y-xs">
          <EditableText 
            contentKey="faq_title"
            tag="h1"
            className="font-headline-xl-mobile md:font-headline-xl text-headline-xl-mobile md:text-headline-xl text-primary font-bold"
          />
          <EditableText 
            contentKey="faq_subtitle"
            tag="p"
            className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl leading-relaxed"
          />

          <div className="relative max-w-xl pt-2">
            <Search className="w-5 h-5 text-on-surface-variant absolute left-3.5 top-5" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions (e.g. ownership, financing, timeline)..."
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-body-md focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-outline-variant/20">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded font-label-lg text-label-lg whitespace-nowrap transition-colors cursor-pointer ${
                activeCategory === cat 
                  ? 'bg-primary text-on-primary shadow-sm' 
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Accordions */}
        <div className="max-w-3xl mx-auto space-y-4">
          {filteredFaqs.map(faq => {
            const isOpen = openFaqId === faq.id;
            return (
              <div key={faq.id} className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 overflow-hidden shadow-sm">
                <button
                  onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                  className="w-full p-5 text-left flex items-center justify-between font-headline-sm text-headline-sm text-on-surface hover:text-primary transition-colors font-bold cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-on-surface-variant transition-transform ${isOpen ? 'rotate-180 text-primary' : ''}`} />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial="collapsed"
                      animate="open"
                      exit="collapsed"
                      variants={accordionTransition}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 text-body-sm text-body-sm text-on-surface-variant leading-relaxed border-t border-outline-variant/10 pt-3">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </AnimatedPage>
  );
};

export default FaqPage;

