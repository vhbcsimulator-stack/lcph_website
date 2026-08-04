import React from 'react';

const Bone: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`skeleton-bone ${className}`} />
);

/** Responsive full-page placeholder shown while the CMS data is loading. */
export const PageSkeleton: React.FC = () => (
  <div className="min-h-screen bg-surface" role="status" aria-live="polite" aria-label="Loading page content">
    <span className="sr-only">Loading page content…</span>

    <div className="h-8 bg-primary/95" />
    <header className="border-b border-outline-variant/15 bg-surface-container-lowest">
      <div className="mx-auto flex h-20 max-w-[1280px] items-center justify-between px-margin-mobile md:px-margin-desktop">
        <Bone className="h-10 w-36 rounded-lg" />
        <div className="hidden items-center gap-7 md:flex">
          {['w-16', 'w-20', 'w-14', 'w-24', 'w-16'].map((width, index) => <Bone key={index} className={`h-3 rounded-full ${width}`} />)}
        </div>
        <Bone className="h-10 w-32 rounded-lg" />
      </div>
    </header>

    <main>
      <section className="bg-surface-container-low py-14 md:py-20">
        <div className="mx-auto max-w-[1280px] px-margin-mobile md:px-margin-desktop">
          <Bone className="mb-6 h-3 w-28 rounded-full" />
          <Bone className="h-10 w-full max-w-2xl rounded-lg md:h-14" />
          <Bone className="mt-5 h-4 w-full max-w-xl rounded-full" />
          <Bone className="mt-2 h-4 w-4/5 max-w-lg rounded-full" />
          <div className="mt-8 flex gap-3">
            <Bone className="h-11 w-36 rounded-lg" />
            <Bone className="h-11 w-40 rounded-lg" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] space-y-8 px-margin-mobile py-12 md:px-margin-desktop md:py-16">
        <div className="flex items-end justify-between gap-6">
          <div className="w-full max-w-md">
            <Bone className="h-3 w-24 rounded-full" />
            <Bone className="mt-3 h-8 w-3/4 rounded-lg" />
          </div>
          <Bone className="hidden h-4 w-24 rounded-full sm:block" />
        </div>

        <div className="grid grid-cols-1 gap-gutter md:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="overflow-hidden rounded-xl border border-outline-variant/15 bg-surface-container-lowest shadow-sm">
              <Bone className="aspect-[16/10] w-full" />
              <div className="space-y-3 p-5">
                <Bone className="h-3 w-24 rounded-full" />
                <Bone className="h-6 w-4/5 rounded-md" />
                <Bone className="h-3 w-full rounded-full" />
                <Bone className="h-3 w-2/3 rounded-full" />
                <Bone className="mt-5 h-10 w-full rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  </div>
);

