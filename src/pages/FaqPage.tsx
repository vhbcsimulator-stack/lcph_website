import React, { useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { PromptDialog } from '../components/ui/PromptDialog';
import { faqsData } from '../data/faqsData';
import {
  FAQ_CATEGORIES,
  FAQ_LIST_KEY,
  type FaqCategory,
  faqAnswerKey,
  faqCategoriesInUse,
  faqCategoryOptions,
  faqQuestionKey,
  resolveFaqs,
  toFaqEntries,
} from '../data/faqContent';
import { Link } from 'react-router-dom';
import { AnimatedPage } from '../components/layout/AnimatedPage';
import { accordionTransition } from '../utils/animations';
import { EditableText } from '../components/admin/EditableText';
import { EditableRichText } from '../components/admin/EditableRichText';
import { useAdmin } from '../context/AdminContext';
import { ArrowRight, ChevronDown, HelpCircle, MessageCircle, Plus, Search, Trash2 } from 'lucide-react';

export const FaqPage: React.FC = () => {
  const { pageContent, updateText, isAdmin } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [openFaqId, setOpenFaqId] = useState<string | null>(faqsData[0]?.id || null);
  /** Admin dialogs, each holding the id of the question it was opened for. */
  const [pendingRemoveId, setPendingRemoveId] = useState<string | null>(null);
  const [namingCategoryFor, setNamingCategoryFor] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const faqs = useMemo(() => resolveFaqs(pageContent), [pageContent]);

  /**
   * Chips follow the questions that actually exist — suggested categories first, then any an admin
   * has named. A hard-coded list would strand questions filed under anything not on it.
   */
  const categories = useMemo(() => ['All', ...faqCategoriesInUse(faqs)], [faqs]);

  /** Everything offerable in the picker, whether or not it currently has questions filed under it. */
  const categoryOptions = useMemo(() => faqCategoryOptions(faqs), [faqs]);

  /*
   * Every write rebuilds the whole list, so it must start from the newest one. Read through a ref,
   * not the render's `faqs`: a card mid-exit-animation still has its old handlers bound, and those
   * closures would otherwise write back a list that silently drops anything added since.
   */
  const faqsRef = useRef(faqs);
  faqsRef.current = faqs;

  const writeFaqs = (entries: ReturnType<typeof toFaqEntries>) =>
    updateText(FAQ_LIST_KEY, JSON.stringify(entries));

  const currentEntries = () => toFaqEntries(faqsRef.current);

  const addFaq = () => {
    const id = `faq-${Date.now()}`;
    // Seeded together with the list so the new card has copy to show and to click into straight away.
    updateText(faqQuestionKey(id), 'New question');
    updateText(faqAnswerKey(id), '<p>Write the answer here.</p>');
    writeFaqs([
      ...currentEntries(),
      { id, category: activeCategory === 'All' ? FAQ_CATEGORIES[0] : (activeCategory as FaqCategory) },
    ]);
    setOpenFaqId(id);
  };

  /** The question and answer keys are left in place, so a removal can be undone from the admin bar. */
  const removeFaq = (id: string) => {
    writeFaqs(currentEntries().filter((entry) => entry.id !== id));
    if (openFaqId === id) setOpenFaqId(null);
    setPendingRemoveId(null);
  };

  const setFaqCategory = (id: string, category: FaqCategory) =>
    writeFaqs(currentEntries().map((entry) => (entry.id === id ? { ...entry, category } : entry)));

  /** Sentinel value for the picker's last option; never stored. */
  const NEW_CATEGORY = '__new__';

  const pickCategory = (id: string, choice: string) => {
    // Cancelling the dialog leaves the select showing the sentinel until the next render, which the
    // state change here guarantees — React then restores it to the entry's real category.
    if (choice === NEW_CATEGORY) setNamingCategoryFor(id);
    else setFaqCategory(id, choice);
  };

  const createCategory = (name: string) => {
    if (!namingCategoryFor) return;
    // Reuse the existing spelling on a case-insensitive match, so "payment terms" doesn't become a
    // second chip next to "Payment Terms". Read through the ref for the same reason writes do.
    const existing = faqCategoryOptions(faqsRef.current).find(
      (option) => option.toLowerCase() === name.toLowerCase(),
    );
    setFaqCategory(namingCategoryFor, existing ?? name);
    setNamingCategoryFor(null);
  };

  const filteredFaqs = faqs.filter(faq => {
    const categoryMatch = activeCategory === 'All' || faq.category === activeCategory;
    // Answers are rich text, so the markup is dropped before matching — otherwise "p" hits every tag.
    const answerText = faq.answer.replace(/<[^>]*>/g, ' ');
    const needle = searchQuery.toLowerCase();
    const searchMatch = searchQuery === '' ||
      faq.question.toLowerCase().includes(needle) ||
      answerText.toLowerCase().includes(needle);
    return categoryMatch && searchMatch;
  });

  return (
    <AnimatedPage className="overflow-hidden pb-xl">
      {/* No bottom rule here: the tinted band below already separates the header from the list. */}
      <div>
        <div className="container-custom pb-12 pt-sm md:pb-16">
        <Breadcrumbs items={[{ label: 'FAQs' }]} />

        {/* Page Header */}
        <div className="mx-auto max-w-3xl pt-8 text-center md:pt-12">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary ring-8 ring-primary/5">
            <HelpCircle className="w-6 h-6" />
          </div>
          <EditableText 
            contentKey="faq_title"
            tag="h1"
            className="font-headline-xl-mobile text-headline-xl-mobile font-bold capitalize tracking-tight text-primary md:font-headline-xl md:text-headline-xl"
          />
          <EditableText 
            contentKey="faq_subtitle"
            tag="p"
            className="mx-auto mt-3 max-w-2xl font-body-lg text-body-lg leading-relaxed text-on-surface-variant"
          />

          {/* <div className="group relative mx-auto mt-8 max-w-2xl">
            <Search className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant transition-colors group-focus-within:text-primary" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions (e.g. ownership, financing, timeline)..."
              aria-label="Search frequently asked questions"
              className="w-full rounded-2xl border border-outline-variant/60 bg-surface-container-lowest py-4 pl-14 pr-12 text-body-md text-on-surface shadow-[0_16px_40px_-24px_rgba(0,67,33,0.45)] outline-none transition-all placeholder:text-on-surface-variant/65 focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-primary/10 hover:text-primary"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div> */}
        </div>
        </div>
      </div>

      <div className="section-band section-dots">
        <div className="container-custom space-y-8">

        {/* Categories */}
        {/* Narrow screens keep the swipe scroller; from sm up the chips wrap and centre under the header.
            Centring the scroller itself would make its first chip unreachable once it overflows. */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:justify-center sm:overflow-visible">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`relative cursor-pointer whitespace-nowrap rounded-full border px-5 py-2.5 font-label-lg text-[12px] font-bold uppercase tracking-wider transition-all ${
                activeCategory === cat 
                  ? 'border-primary bg-primary text-on-primary shadow-md' 
                  : 'border-outline-variant/45 bg-surface-container-lowest text-on-surface-variant hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary hover:shadow-sm'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Accordions */}
        <div className="mx-auto max-w-4xl">
          <div className="mb-4 flex items-center justify-between gap-4 px-1">
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              <span className="font-bold text-on-surface">{filteredFaqs.length}</span>{' '}
              {filteredFaqs.length === 1 ? 'answer' : 'answers'} found
            </p>
            {activeCategory !== 'All' && <span className="text-xs font-semibold text-primary">{activeCategory}</span>}
          </div>

          <motion.div layout className="space-y-3">
          <AnimatePresence mode="popLayout" initial={false}>
          {filteredFaqs.map((faq, index) => {
            const isOpen = openFaqId === faq.id;
            return (
              <motion.article
                layout
                key={faq.id}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.28, delay: prefersReducedMotion ? 0 : Math.min(index, 5) * 0.035 }}
                className={`overflow-hidden rounded-2xl border bg-surface-container-lowest transition-colors ${
                  isOpen
                    ? 'border-primary/35 shadow-[0_16px_36px_-28px_rgba(0,67,33,0.65)]'
                    : 'border-outline-variant/25 shadow-sm hover:border-primary/25'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                  aria-expanded={isOpen}
                  className="group flex w-full cursor-pointer items-center gap-4 p-5 text-left md:p-6"
                >
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${isOpen ? 'bg-primary text-on-primary' : 'bg-primary/8 text-primary group-hover:bg-primary/14'}`}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className={`flex-1 font-headline-sm text-body-md font-bold transition-colors md:text-headline-sm ${isOpen ? 'text-primary' : 'text-on-surface group-hover:text-primary'}`}>
                    <EditableText
                      contentKey={faqQuestionKey(faq.id)}
                      value={faq.question}
                      tag="span"
                      inline
                    />
                  </span>
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all ${isOpen ? 'bg-primary/10 text-primary' : 'bg-surface-container-low text-on-surface-variant group-hover:bg-primary/10 group-hover:text-primary'}`}>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </span>
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
                      <div className="ml-[4.25rem] border-t border-outline-variant/15 pb-6 pr-6 pt-4 font-body-md text-body-md leading-relaxed text-on-surface-variant">
                        <EditableRichText
                          contentKey={faqAnswerKey(faq.id)}
                          value={faq.answer}
                          compact
                        />

                        {/* Sits inside the panel because the header is a <button> and cannot hold controls. */}
                        {isAdmin && (
                          <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-outline-variant/15 pt-3">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                              Category
                            </label>
                            <select
                              value={faq.category}
                              onChange={(e) => pickCategory(faq.id, e.target.value)}
                              className="cursor-pointer rounded border border-outline-variant bg-surface px-2 py-1 text-body-sm text-on-surface outline-none focus:border-primary"
                            >
                              {categoryOptions.map((category) => (
                                <option key={category} value={category}>
                                  {category}
                                </option>
                              ))}
                              <option value={NEW_CATEGORY}>+ New category…</option>
                            </select>
                            <button
                              type="button"
                              onClick={() => setPendingRemoveId(faq.id)}
                              className="ml-auto inline-flex cursor-pointer items-center gap-1.5 rounded border border-outline-variant px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant transition-colors hover:border-error/50 hover:text-error"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Remove
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.article>
            );
          })}
          </AnimatePresence>
          </motion.div>

          {isAdmin && (
            <button
              type="button"
              onClick={addFaq}
              className="mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-outline-variant/50 bg-surface-container-lowest px-6 py-6 text-on-surface-variant transition-colors hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
            >
              <Plus className="h-5 w-5" />
              <span className="text-[11px] font-bold uppercase tracking-wider">Add Question</span>
            </button>
          )}

          {filteredFaqs.length === 0 && (
            <div className="rounded-2xl border border-dashed border-outline-variant/60 bg-surface-container-lowest px-6 py-14 text-center">
              <Search className="w-8 h-8 mx-auto mb-4 text-primary/60" />
              <EditableText
                contentKey="faq_empty_title"
                value="No matching questions"
                className="block font-headline-sm text-headline-sm font-bold text-on-surface"
                tag="h2"
              />
              <EditableText
                contentKey="faq_empty_text"
                value="Try another keyword or browse all categories."
                className="mt-2 block text-body-sm text-on-surface-variant"
                tag="p"
              />
              <button
                type="button"
                onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                className="mt-5 cursor-pointer rounded-full bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-on-primary hover:bg-primary-container"
              >
                <EditableText contentKey="faq_empty_cta" value="Reset filters" tag="span" inline />
              </button>
            </div>
          )}
        </div>

        <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-5 rounded-2xl bg-primary p-7 text-on-primary shadow-lg sm:flex-row md:p-8">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <span className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 sm:flex">
              <MessageCircle className="w-5 h-5 text-primary-fixed" />
            </span>
            <div>
              <EditableText
                contentKey="faq_cta_title"
                value="Still have a question?"
                className="block font-headline-sm text-headline-sm font-bold text-white"
                tag="h2"
              />
              <EditableText
                contentKey="faq_cta_text"
                value="Our property specialists are ready to help."
                className="mt-1 block text-body-sm text-white/75"
                tag="p"
              />
            </div>
          </div>
          <Link to="/contact" className="home-cta group inline-flex shrink-0 items-center gap-2 rounded-lg bg-white px-5 py-3 text-xs font-bold uppercase tracking-wider text-primary">
            <EditableText contentKey="faq_cta_button" value="Contact us" tag="span" inline />
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={pendingRemoveId !== null}
        title="Remove this question?"
        message="It disappears from the FAQ list."
        confirmLabel="Remove"
        onConfirm={() => pendingRemoveId && removeFaq(pendingRemoveId)}
        onCancel={() => setPendingRemoveId(null)}
      />

      <PromptDialog
        isOpen={namingCategoryFor !== null}
        title="New category"
        message="Questions filed under it get their own filter chip."
        label="Category name"
        placeholder="e.g. Turnover & Handover"
        confirmLabel="Create"
        onSubmit={createCategory}
        onCancel={() => setNamingCategoryFor(null)}
      />
    </AnimatedPage>
  );
};

export default FaqPage;

