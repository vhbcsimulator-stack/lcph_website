import { QueryClient } from '@tanstack/react-query';

/**
 * Shared client for both the public site and the admin app.
 * Content changes are pushed by Supabase realtime, so polling is off and the
 * cache is only refreshed when a channel fires (see AdminContext).
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

/** Every content table lives under the 'content' root so realtime can invalidate in one call. */
export const queryKeys = {
  all: ['content'] as const,
  pageContent: ['content', 'page_content'] as const,
  projects: ['content', 'projects'] as const,
  properties: ['content', 'properties'] as const,
  amenities: ['content', 'amenities'] as const,
  updates: ['content', 'development_updates'] as const,
  news: ['content', 'news'] as const,
  gallery: ['content', 'gallery'] as const,
};
