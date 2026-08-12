import type { FAQItem } from '../types';
import { faqsData } from './faqsData';

/** page_content keys used to store admin edits for the static FAQ list. */
export const faqQuestionKey = (id: string) => `faq_${id}_question`;
export const faqAnswerKey = (id: string) => `faq_${id}_answer`;

/**
 * Holds the FAQ list itself — the ids and their categories, in display order — as a JSON string, so
 * admins can add and remove entries without a schema change. Absent until the first add or remove,
 * at which point the bundled list is written out as the starting point. Question and answer copy
 * stays in its own per-id keys so the inline editors keep working unchanged.
 */
export const FAQ_LIST_KEY = 'faq_items_json';

export type FaqCategory = FAQItem['category'];

/**
 * Suggested categories, offered in the picker alongside whatever is already in use. Categories are
 * free-form — an admin can name their own — so this is a starting set, not a closed list.
 */
export const FAQ_CATEGORIES: FaqCategory[] = [
  'About LCPH',
  'Projects',
  'Properties',
  'Reservation',
  'Payment Terms',
  'Site Visits',
];

/** Suggested categories first, then any custom ones in the order they appear. Deduped case-insensitively. */
export const faqCategoryOptions = (faqs: FAQItem[]): string[] => {
  const seen = new Map<string, string>();
  for (const category of [...FAQ_CATEGORIES, ...faqs.map((faq) => faq.category)]) {
    const name = category.trim();
    if (name && !seen.has(name.toLowerCase())) seen.set(name.toLowerCase(), name);
  }
  return [...seen.values()];
};

/** Only the categories that actually have questions filed under them — used for the filter chips. */
export const faqCategoriesInUse = (faqs: FAQItem[]): string[] =>
  faqCategoryOptions(faqs).filter((category) =>
    faqs.some((faq) => faq.category.toLowerCase() === category.toLowerCase()),
  );

/** One row of the stored list: everything about an FAQ except its copy. */
export interface FaqEntry {
  id: string;
  category: FaqCategory;
}

const isCategory = (value: unknown): value is FaqCategory =>
  typeof value === 'string' && value.trim().length > 0;

/** Returns null when no admin-managed list exists yet, so the caller can fall back to the bundled one. */
const parseFaqList = (raw: string | undefined): FaqEntry[] | null => {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed
      .filter((entry) => entry && typeof entry === 'object' && typeof entry.id === 'string')
      .map((entry) => ({
        id: String(entry.id),
        category: isCategory(entry.category) ? entry.category : FAQ_CATEGORIES[0],
      }));
  } catch {
    return null;
  }
};

/**
 * Uses the bundled list only for stable IDs/categories; visible copy comes from Supabase.
 * Once an admin has added or removed a question, the stored list takes over entirely.
 */
export const resolveFaqs = (pageContent: Record<string, string>): FAQItem[] => {
  const stored = parseFaqList(pageContent[FAQ_LIST_KEY]);

  if (stored) {
    // Entries here were created deliberately, so they render even while their copy is still empty.
    return stored.map((entry) => ({
      id: entry.id,
      category: entry.category,
      question: pageContent[faqQuestionKey(entry.id)] ?? '',
      answer: pageContent[faqAnswerKey(entry.id)] ?? '',
    }));
  }

  return faqsData.flatMap((faq) => {
    const question = pageContent[faqQuestionKey(faq.id)];
    const answer = pageContent[faqAnswerKey(faq.id)];
    return question !== undefined && answer !== undefined
      ? [{ ...faq, question, answer }]
      : [];
  });
};

/** Seeds the stored list from what is currently on screen, so the first edit keeps every existing entry. */
export const toFaqEntries = (faqs: FAQItem[]): FaqEntry[] =>
  faqs.map((faq) => ({ id: faq.id, category: faq.category }));
