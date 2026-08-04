import type { FAQItem } from '../types';
import { faqsData } from './faqsData';

/** page_content keys used to store admin edits for the static FAQ list. */
export const faqQuestionKey = (id: string) => `faq_${id}_question`;
export const faqAnswerKey = (id: string) => `faq_${id}_answer`;

/** Applies saved admin edits on top of the bundled FAQ data, so search and filters see the edited copy. */
export const resolveFaqs = (pageContent: Record<string, string>): FAQItem[] =>
  faqsData.map((faq) => ({
    ...faq,
    question: pageContent[faqQuestionKey(faq.id)] ?? faq.question,
    answer: pageContent[faqAnswerKey(faq.id)] ?? faq.answer,
  }));
