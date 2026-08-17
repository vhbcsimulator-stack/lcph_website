import React from 'react';
import { matchPath, useLocation } from 'react-router-dom';

/**
 * Route-aware loading placeholders.
 *
 * Every skeleton below mirrors the real page it stands in for — same containers, same bands, same
 * card geometry — so the swap from placeholder to content does not move anything on screen. When a
 * page's layout changes, its skeleton here has to change with it.
 *
 * The site chrome (header, footer) is real during loading, since none of it reads CMS data; only
 * the routed body is faked.
 */

const Bone: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div aria-hidden className={`skeleton-bone ${className}`} />
);

/** Text line. `w-*` comes from the caller so a paragraph can look ragged rather than blocked. */
const Line: React.FC<{ className?: string }> = ({ className = '' }) => (
  <Bone className={`h-3 rounded-full ${className}`} />
);

/** Bones on a dark photo/primary background need to be light, not the surface tint. */
const DarkBone: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div aria-hidden className={`bg-white/20 ${className}`} />
);

const SHELL = 'w-full max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop';

/** Matches `Breadcrumbs`: a py-3 row of Home › current. */
const BreadcrumbsBone: React.FC = () => (
  <div className="flex items-center gap-1.5 py-3">
    <Bone className="h-3.5 w-3.5 rounded" />
    <Bone className="h-3 w-10 rounded-full" />
    <Bone className="h-3 w-3 rounded-full" />
    <Bone className="h-3 w-28 rounded-full" />
  </div>
);

/** The `h1` + lead paragraph pair that opens most listing pages. */
const PageHeadingBone: React.FC<{ centered?: boolean }> = ({ centered = false }) => (
  <div className={`space-y-xs ${centered ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}`}>
    <Bone className={`h-9 w-3/4 rounded-lg md:h-12 ${centered ? 'mx-auto' : ''}`} />
    <div className={`space-y-2 pt-3 ${centered ? 'mx-auto max-w-2xl' : ''}`}>
      <Line className="w-full" />
      <Line className={`w-4/5 ${centered ? 'mx-auto' : ''}`} />
    </div>
  </div>
);

/** Stacked listing card: 16/10 image over a body. Used by project/amenity/update grids. */
const CardBone: React.FC<{ className?: string; rounded?: string }> = ({
  className = '',
  rounded = 'rounded-lg',
}) => (
  <div className={`overflow-hidden border border-outline-variant/20 bg-surface-container-lowest shadow-sm ${rounded} ${className}`}>
    <Bone className="aspect-[16/10] w-full" />
    <div className="space-y-3 p-5">
      <Line className="w-24" />
      <Bone className="h-6 w-4/5 rounded-md" />
      <Line className="w-full" />
      <Line className="w-2/3" />
      <Bone className="mt-4 h-10 w-full rounded" />
    </div>
  </div>
);

/** Pill row used by the category filters on news, gallery, amenities and FAQs. */
const ChipsBone: React.FC<{ count?: number; className?: string }> = ({ count = 5, className = '' }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    {['w-16', 'w-28', 'w-20', 'w-24', 'w-16', 'w-20'].slice(0, count).map((width, index) => (
      <Bone key={index} className={`h-10 shrink-0 rounded-full ${width}`} />
    ))}
  </div>
);

/** Label + control pair, as used in every form on the site. */
const FieldBone: React.FC<{ labelWidth?: string }> = ({ labelWidth = 'w-24' }) => (
  <div className="space-y-1.5">
    <Line className={labelWidth} />
    <Bone className="h-11 w-full rounded" />
  </div>
);

/* ── Home ─────────────────────────────────────────────────────────────────── */

const HomeSkeleton: React.FC = () => (
  <div className="overflow-x-clip bg-surface">
    {/* Hero */}
    <section className="relative flex min-h-[560px] w-full items-center justify-center overflow-hidden bg-slate-900 sm:h-[600px] lg:h-[900px]">
      <div className={`${SHELL} relative z-10 flex h-full min-h-[560px] flex-col justify-center py-10 pb-20 sm:min-h-0 sm:py-0`}>
        <div className="flex max-w-[672px] flex-col items-center gap-4 text-center sm:items-start sm:text-left">
          <DarkBone className="h-3 w-40 rounded-full" />
          <DarkBone className="h-9 w-full max-w-[560px] rounded-lg md:h-14" />
          <DarkBone className="h-9 w-2/3 max-w-[420px] rounded-lg md:h-14" />
          <div className="w-full max-w-[560px] space-y-2 pt-2">
            <DarkBone className="h-4 w-full rounded-full" />
            <DarkBone className="h-4 w-4/5 rounded-full" />
          </div>
          <div className="flex w-full max-w-[300px] flex-col gap-3 pt-4 sm:max-w-none sm:flex-row">
            <DarkBone className="h-12 w-full rounded sm:w-44" />
            <DarkBone className="h-12 w-full rounded sm:w-52" />
          </div>
        </div>
      </div>
    </section>

    {/* Introduction */}
    <section className={`${SHELL} py-xl text-center`}>
      <Bone className="mx-auto h-3 w-28 rounded-full" />
      <Bone className="mx-auto mt-4 h-8 w-full max-w-lg rounded-lg md:h-10" />
      <div className="mx-auto mt-6 max-w-[768px] space-y-2">
        <Line className="w-full" />
        <Line className="w-full" />
        <Line className="mx-auto w-3/4" />
      </div>
    </section>

    {/* Flagship spotlight — image panel with an overlapping detail card */}
    <section className={`${SHELL} pb-xl`}>
      <div className="relative lg:flex lg:items-center">
        <Bone className="h-[320px] w-full lg:h-[460px] lg:w-[58%]" />
        <div className="relative z-10 -mt-10 mx-4 space-y-4 rounded-tl-lg border border-outline-variant/20 bg-surface-container-lowest p-8 shadow-[0_20px_40px_-10px_rgba(0,67,33,0.14)] lg:-ml-16 lg:mr-0 lg:mt-0 lg:w-[48%] lg:p-10">
          <div className="flex gap-2">
            <Bone className="h-6 w-24 rounded" />
            <Bone className="h-6 w-24 rounded" />
          </div>
          <Bone className="h-8 w-3/4 rounded-lg" />
          <Line className="w-1/2" />
          <div className="space-y-2">
            <Line className="w-full" />
            <Line className="w-full" />
            <Line className="w-2/3" />
          </div>
          <div className="space-y-2 pt-2">
            {[0, 1, 2].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <Bone className="h-5 w-5 shrink-0 rounded-full" />
                <Line className="w-2/3" />
              </div>
            ))}
          </div>
          <Bone className="ml-auto h-10 w-40 rounded" />
        </div>
      </div>
    </section>

    {/* Featured developments */}
    <section className="section-band section-grid py-16">
      <div className={`${SHELL} space-y-10`}>
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="space-y-2">
            <Line className="w-32" />
            <Bone className="h-7 w-72 rounded-lg" />
          </div>
          <Line className="w-40" />
        </div>
        <div className="mx-auto grid max-w-[960px] grid-cols-1 gap-gutter md:grid-cols-2">
          {[0, 1].map((item) => (
            <CardBone key={item} rounded="rounded-tr-[13rem]" />
          ))}
        </div>
      </div>
    </section>

    {/* Amenities rail */}
    <section className="py-16">
      <div className={`${SHELL} space-y-10`}>
        <div className="mx-auto max-w-[768px] space-y-3 text-center">
          <Bone className="mx-auto h-3 w-28 rounded-full" />
          <Bone className="mx-auto h-8 w-2/3 rounded-lg md:h-10" />
          <Line className="mx-auto w-4/5" />
        </div>
        <div className="flex gap-gutter overflow-hidden">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="w-[280px] shrink-0 sm:w-[320px] lg:w-[360px]">
              <CardBone />
            </div>
          ))}
        </div>
      </div>
    </section>

    <div className={`${SHELL} pb-16 text-center`}>
      <Bone className="mx-auto h-12 w-64 rounded" />
    </div>

    {/* Development updates */}
    <section className="section-band section-diagonal py-16">
      <div className={`${SHELL} space-y-10`}>
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="space-y-2">
            <Line className="w-32" />
            <Bone className="h-7 w-80 rounded-lg" />
          </div>
          <Line className="w-44" />
        </div>
        <div className="grid grid-cols-1 gap-gutter md:grid-cols-2">
          {[0, 1].map((item) => (
            <CardBone key={item} />
          ))}
        </div>
      </div>
    </section>

    {/* FAQs */}
    <section className="section-band section-dots py-16">
      <div className={`${SHELL} space-y-8`}>
        <div className="mx-auto max-w-[672px] space-y-3 text-center">
          <Bone className="mx-auto h-3 w-28 rounded-full" />
          <Bone className="mx-auto h-8 w-2/3 rounded-lg md:h-10" />
        </div>
        <div className="mx-auto max-w-[768px] space-y-3">
          {[0, 1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 rounded-xl border border-outline-variant/20 bg-surface-container-lowest px-5 py-4 shadow-sm"
            >
              <Bone className="h-5 w-5 shrink-0 rounded-full" />
              <Line className="w-2/3 flex-1" />
              <Bone className="h-4 w-4 shrink-0 rounded" />
            </div>
          ))}
        </div>
        <div className="pt-2 text-center">
          <Line className="mx-auto w-56" />
        </div>
      </div>
    </section>

    {/* Inquiry form */}
    <section className="section-grid pattern-on-dark bg-primary py-16">
      <div className={SHELL}>
        <div className="grid grid-cols-1 items-center gap-lg lg:grid-cols-2">
          <div className="space-y-6">
            <DarkBone className="h-3 w-32 rounded-full" />
            <DarkBone className="h-9 w-full max-w-md rounded-lg md:h-12" />
            <div className="space-y-2">
              <DarkBone className="h-4 w-full rounded-full" />
              <DarkBone className="h-4 w-3/4 rounded-full" />
            </div>
            <div className="space-y-3 pt-2">
              {[0, 1, 2].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <DarkBone className="h-5 w-5 shrink-0 rounded" />
                  <DarkBone className="h-4 w-64 max-w-full rounded-full" />
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4 rounded-2xl border border-outline-variant/15 bg-surface-container-lowest p-8 shadow-2xl">
            <Bone className="h-7 w-56 rounded-lg" />
            <FieldBone labelWidth="w-20" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FieldBone labelWidth="w-28" />
              <FieldBone labelWidth="w-28" />
            </div>
            <FieldBone labelWidth="w-32" />
            <div className="space-y-1.5">
              <Line className="w-20" />
              <Bone className="h-20 w-full rounded" />
            </div>
            <Bone className="h-12 w-full rounded" />
          </div>
        </div>
      </div>
    </section>
  </div>
);

/* ── About ────────────────────────────────────────────────────────────────── */

const AboutSkeleton: React.FC = () => (
  <div className="overflow-hidden bg-background pb-xl pt-lg">
    <div className="container-custom max-w-[1120px]">
      <BreadcrumbsBone />
      <div className="relative flex h-[300px] w-full flex-col items-center justify-center gap-4 overflow-hidden rounded-lg bg-slate-800 px-6 shadow-sm md:h-[390px]">
        <DarkBone className="h-8 w-full max-w-md rounded-lg md:h-11" />
        <div className="w-full max-w-2xl space-y-2">
          <DarkBone className="h-4 w-full rounded-full" />
          <DarkBone className="mx-auto h-4 w-3/4 rounded-full" />
        </div>
      </div>
    </div>

    {/* Company overview */}
    <section className="mx-auto max-w-[1040px] px-4 py-16 md:px-8 md:py-20">
      <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-[0.95fr_1.05fr] md:gap-16">
        <div className="space-y-5">
          <Bone className="h-8 w-3/4 rounded-lg md:h-9" />
          <div className="space-y-2">
            <Line className="w-full" />
            <Line className="w-full" />
            <Line className="w-5/6" />
          </div>
          <div className="space-y-2">
            <Line className="w-full" />
            <Line className="w-2/3" />
          </div>
        </div>
        <div className="relative mx-auto w-[92%] md:w-full">
          <Bone className="h-[300px] w-full rounded-lg shadow-md md:h-[350px]" />
        </div>
      </div>
    </section>

    {/* Core principles */}
    <section className="section-band section-dots px-4 pb-20 pt-16 md:px-8">
      <div className="mx-auto max-w-[1120px]">
        <div className="mb-10 text-center">
          <Bone className="mx-auto h-8 w-64 rounded-lg md:h-9" />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div
              key={item}
              className="flex min-h-[285px] flex-col items-center gap-5 border border-outline-variant/20 bg-surface-container-lowest px-7 py-9 shadow-sm"
            >
              <Bone className="h-10 w-10 rounded" />
              <Bone className="h-6 w-40 rounded-md" />
              <div className="w-full space-y-2">
                <Line className="w-full" />
                <Line className="w-full" />
                <Line className="mx-auto w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="px-4 pt-16 md:px-8">
      <div className="section-diagonal pattern-on-dark mx-auto max-w-[1120px] space-y-3 bg-primary px-6 py-10 text-center md:py-12">
        <DarkBone className="mx-auto h-8 w-full max-w-xl rounded-lg md:h-9" />
        <DarkBone className="mx-auto h-4 w-64 rounded-full" />
        <div className="flex flex-col justify-center gap-4 pt-3 sm:flex-row">
          <DarkBone className="h-12 w-full rounded sm:w-48" />
          <DarkBone className="h-12 w-full rounded sm:w-60" />
        </div>
      </div>
    </section>
  </div>
);

/* ── Projects ─────────────────────────────────────────────────────────────── */

const ProjectsSkeleton: React.FC = () => (
  <div className="space-y-xl">
    <div className="container-custom space-y-lg">
      <BreadcrumbsBone />

      <section className="space-y-md">
        <PageHeadingBone />

        {/* Filter bar */}
        <div className="flex flex-col items-end gap-sm rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-md shadow-sm md:flex-row md:flex-wrap">
          {[0, 1, 2].map((item) => (
            <div key={item} className="w-full space-y-xs md:flex-1">
              <Line className="w-24" />
              <Bone className="h-12 w-full rounded-lg" />
            </div>
          ))}
        </div>
      </section>

      {/* Featured bento */}
      <section className="grid grid-cols-1 gap-5 md:auto-rows-[238px] md:grid-cols-12 md:grid-rows-2">
        <div className="relative flex h-[320px] items-end overflow-hidden rounded-xl bg-slate-800 p-lg shadow-lg md:col-span-8 md:row-span-2 md:h-100">
          <div className="w-full space-y-3">
            <DarkBone className="h-7 w-40 rounded-full" />
            <DarkBone className="h-9 w-3/4 max-w-lg rounded-lg md:h-11" />
            <DarkBone className="h-4 w-64 rounded-full" />
            <DarkBone className="h-12 w-44 rounded" />
          </div>
        </div>
        <div className="flex min-h-[220px] flex-col justify-center gap-3 rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-md shadow-sm md:col-span-4 md:min-h-0">
          <Bone className="h-6 w-2/3 rounded-md" />
          <Line className="w-full" />
          <Line className="w-full" />
          <Line className="w-1/2" />
        </div>
        <Bone className="min-h-[220px] rounded-xl md:col-span-4 md:min-h-0" />
      </section>
    </div>

    {/* All projects grid */}
    <div className="section-band section-grid py-16">
      <div className="container-custom">
        <section className="space-y-md">
          <div className="flex items-end justify-between border-b border-outline-variant/30 pb-sm">
            <Bone className="h-8 w-48 rounded-lg" />
            <Line className="w-32" />
          </div>
          <div className="flex flex-wrap justify-center gap-gutter">
            {[0, 1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="w-full max-w-[410px] md:w-[calc(50%_-_12px)] lg:w-[calc(33.333%_-_16px)]">
                <CardBone rounded="rounded-tr-[13rem]" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  </div>
);

/* ── Project & property detail ────────────────────────────────────────────── */

/** The 3-up hero bento both detail pages open with. */
const DetailHeroBone: React.FC = () => (
  <section className="w-full">
    <div className="grid h-[400px] grid-cols-1 gap-xs overflow-hidden rounded-xl border border-outline-variant/20 bg-surface shadow-lg md:h-[600px] md:grid-cols-4 md:grid-rows-2 md:gap-sm">
      <div className="relative flex items-end bg-slate-800 p-md md:col-span-3 md:row-span-2">
        <div className="w-full space-y-3">
          <DarkBone className="h-7 w-36 rounded-full" />
          <DarkBone className="h-10 w-3/4 max-w-xl rounded-lg md:h-14" />
          <DarkBone className="h-5 w-56 rounded-full" />
        </div>
      </div>
      <Bone className="hidden md:block" />
      <Bone className="hidden md:block" />
    </div>
  </section>
);

/** Sticky lead-capture form that fills the right column of both detail pages. */
const DetailSidebarBone: React.FC = () => (
  <div className="lg:col-span-4">
    <div className="space-y-4 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-lg">
      <Bone className="h-7 w-3/4 rounded-lg" />
      <div className="space-y-2">
        <Line className="w-full" />
        <Line className="w-2/3" />
      </div>
      <FieldBone labelWidth="w-20" />
      <FieldBone labelWidth="w-28" />
      <FieldBone labelWidth="w-28" />
      <FieldBone labelWidth="w-40" />
      <Bone className="h-14 w-full rounded-lg" />
      <Bone className="h-12 w-full rounded-lg" />
    </div>
  </div>
);

const ProjectDetailSkeleton: React.FC = () => (
  <div className="space-y-xl py-sm">
    <div className="container-custom space-y-md">
      <BreadcrumbsBone />
      <DetailHeroBone />

      {/* Section tabs */}
      <div className="w-full border-y border-outline-variant/30 bg-surface-container-lowest shadow-sm">
        <div className="mx-auto flex max-w-[1280px] gap-6 px-margin-mobile py-4 md:px-margin-desktop">
          {['w-24', 'w-24', 'w-28', 'w-20'].map((width, index) => (
            <Bone key={index} className={`h-4 shrink-0 rounded-full ${width}`} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-gutter py-md lg:grid-cols-12">
        <div className="space-y-xl lg:col-span-8">
          {/* Overview */}
          <section className="space-y-md">
            <Bone className="h-9 w-64 rounded-lg" />
            <div className="space-y-2">
              <Line className="w-full" />
              <Line className="w-full" />
              <Line className="w-full" />
              <Line className="w-3/4" />
            </div>
            <div className="grid grid-cols-2 gap-md rounded-xl border border-outline-variant/30 bg-surface-container-low/50 p-md shadow-sm md:grid-cols-4">
              {[0, 1, 2, 3].map((item) => (
                <div key={item} className="space-y-2">
                  <Line className="w-20" />
                  <Bone className="h-6 w-28 rounded-md" />
                </div>
              ))}
            </div>
          </section>

          {/* Amenities */}
          <section className="section-band-inset section-dots space-y-md p-6 md:p-8">
            <Bone className="h-8 w-56 rounded-lg" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[0, 1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <Bone className="h-5 w-5 shrink-0 rounded-full" />
                  <Line className="w-2/3" />
                </div>
              ))}
            </div>
          </section>

          {/* Walkthrough video */}
          <section className="space-y-md">
            <Bone className="h-8 w-64 rounded-lg" />
            <Bone className="aspect-video w-full rounded-xl" />
          </section>

          {/* Photo gallery */}
          <section className="space-y-md">
            <Bone className="h-8 w-48 rounded-lg" />
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {[0, 1, 2, 3, 4, 5].map((item) => (
                <Bone key={item} className="aspect-[4/3] w-full rounded-lg" />
              ))}
            </div>
          </section>
        </div>

        <DetailSidebarBone />
      </div>
    </div>
  </div>
);

const PropertyDetailSkeleton: React.FC = () => (
  <div className="space-y-xl py-sm">
    <div className="container-custom space-y-md">
      <BreadcrumbsBone />
      <DetailHeroBone />

      <div className="grid grid-cols-1 gap-gutter py-md lg:grid-cols-12">
        <div className="space-y-xl lg:col-span-8">
          <section className="space-y-md">
            <Bone className="h-9 w-72 rounded-lg" />
            <div className="space-y-2">
              <Line className="w-full" />
              <Line className="w-full" />
              <Line className="w-4/5" />
            </div>
            <div className="grid grid-cols-2 gap-md rounded-xl border border-outline-variant/30 bg-surface-container-low/50 p-md shadow-sm md:grid-cols-3">
              {[0, 1, 2].map((item) => (
                <div key={item} className="space-y-2">
                  <Line className="w-20" />
                  <Bone className="h-6 w-28 rounded-md" />
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-md">
            <Bone className="h-8 w-56 rounded-lg" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[0, 1, 2, 3].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <Bone className="h-5 w-5 shrink-0 rounded-full" />
                  <Line className="w-2/3" />
                </div>
              ))}
            </div>
          </section>
        </div>

        <DetailSidebarBone />
      </div>
    </div>
  </div>
);

/* ── Amenities ────────────────────────────────────────────────────────────── */

const AmenitiesSkeleton: React.FC = () => (
  <div className="overflow-hidden">
    <div className="container-custom pb-5 pt-sm md:pb-5">
      <BreadcrumbsBone />
      <div className="pt-8 md:pt-12">
        <PageHeadingBone />
      </div>
    </div>

    <div className="section-band section-grid pb-16">
      <div className="container-custom space-y-8">
        {/* Filter panel */}
        <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-5 md:p-6">
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <Bone className="h-8 w-8 shrink-0 rounded-lg" />
            <Line className="w-32" />
            <Bone className="h-12 w-full rounded-xl sm:w-72" />
          </div>
          <div className="mt-5 border-t border-outline-variant/20 pt-5">
            <ChipsBone count={6} />
          </div>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-3 px-1">
          <div className="space-y-2">
            <Line className="w-32" />
            <Bone className="h-7 w-56 rounded-lg" />
          </div>
          <Line className="w-32" />
        </div>

        <div className="grid grid-cols-1 gap-gutter sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((item) => (
            <CardBone key={item} />
          ))}
        </div>
      </div>
    </div>
  </div>
);

/* ── Updates ──────────────────────────────────────────────────────────────── */

const UpdatesSkeleton: React.FC = () => (
  <div className="space-y-l">
    <div className="container-custom max-w-[1120px] space-y-md">
      <BreadcrumbsBone />
      <PageHeadingBone />
    </div>

    <div className="section-band section-dots py-16">
      <div className="container-custom max-w-[1120px] space-y-md">
        {/* Featured update — image with an overlapping panel */}
        <div className="relative md:pb-10">
          <Bone className="aspect-[16/10] w-full rounded-lg shadow-sm md:aspect-[16/9] md:w-[62%]" />
          <div className="relative z-10 -mt-6 mx-4 space-y-3 rounded-lg border border-outline-variant/20 border-t-2 border-t-emerald-500 bg-surface-container-lowest p-6 shadow-xl md:absolute md:right-0 md:top-1/2 md:mx-0 md:mt-0 md:w-[52%] md:-translate-y-1/2 md:p-8">
            <div className="flex gap-3">
              <Bone className="h-6 w-28 rounded" />
              <Bone className="h-6 w-24 rounded" />
            </div>
            <Bone className="h-7 w-3/4 rounded-lg" />
            <Line className="w-full" />
            <Line className="w-2/3" />
            <Bone className="h-1.5 w-full rounded-full" />
            <div className="flex items-center justify-between border-t border-outline-variant/20 pt-3">
              <Line className="w-32" />
              <Line className="w-40" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-gutter md:grid-cols-2">
          {[0, 1, 2, 3].map((item) => (
            <CardBone key={item} />
          ))}
        </div>
      </div>
    </div>

    {/* CTA banner */}
    <section className="section-diagonal pattern-on-dark grid w-full items-center gap-6 overflow-hidden bg-primary px-6 py-6 md:grid-cols-[1.2fr_1fr] md:px-10 md:py-7">
      <div className="space-y-3 md:ml-[10vh]">
        <DarkBone className="h-8 w-full max-w-md rounded-lg md:h-9" />
        <DarkBone className="h-4 w-full max-w-lg rounded-full" />
        <DarkBone className="h-4 w-2/3 rounded-full" />
        <div className="flex flex-col gap-4 pt-3 sm:flex-row">
          <DarkBone className="h-12 w-full rounded sm:w-40" />
          <DarkBone className="h-12 w-full rounded sm:w-44" />
        </div>
      </div>
      <DarkBone className="h-[240px] w-full rounded-[24px] sm:h-[270px] md:h-[300px]" />
    </section>
  </div>
);

/* ── Article-style detail pages (news + updates) ──────────────────────────── */

const UpdateDetailSkeleton: React.FC = () => (
  <div className="space-y-xl py-sm">
    <div className="container-custom mx-auto max-w-4xl space-y-md">
      <BreadcrumbsBone />

      <div className="space-y-sm">
        <div className="flex flex-wrap gap-2">
          <Bone className="h-7 w-44 rounded" />
          <Bone className="h-7 w-40 rounded" />
        </div>
        <Bone className="h-9 w-full rounded-lg md:h-11" />
        <Bone className="h-9 w-2/3 rounded-lg md:h-11" />
        <Line className="w-56" />
      </div>

      <Bone className="aspect-[16/9] w-full rounded-xl border border-outline-variant/20 shadow-md" />

      <div className="space-y-4 rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-8 shadow-sm">
        <Bone className="h-7 w-72 rounded-lg" />
        <div className="space-y-2">
          <Line className="w-full" />
          <Line className="w-full" />
          <Line className="w-full" />
          <Line className="w-4/5" />
        </div>
      </div>

      <div className="section-band-inset section-grid space-y-4 p-6 md:p-8">
        <Bone className="h-7 w-64 rounded-lg" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {[0, 1, 2, 3].map((item) => (
            <Bone key={item} className="aspect-[4/3] w-full rounded-lg" />
          ))}
        </div>
      </div>

      <div className="border-t border-outline-variant/30 pt-sm">
        <Line className="w-40" />
      </div>
    </div>
  </div>
);

const NewsDetailSkeleton: React.FC = () => (
  <div className="space-y-xl py-sm">
    <div className="container-custom mx-auto max-w-4xl space-y-md">
      <BreadcrumbsBone />

      <div className="space-y-sm">
        <Bone className="h-6 w-32 rounded" />
        <Bone className="h-9 w-full rounded-lg md:h-11" />
        <Bone className="h-9 w-3/4 rounded-lg md:h-11" />
        <div className="flex flex-wrap items-center gap-4 border-b border-outline-variant/30 pb-4 pt-2">
          <Line className="w-32" />
          <Line className="w-24" />
          <Line className="w-40" />
        </div>
      </div>

      <Bone className="aspect-[16/9] w-full rounded-xl border border-outline-variant/20 shadow-md" />
    </div>

    <div className="section-band section-dots py-16">
      <div className="container-custom mx-auto max-w-4xl space-y-md">
        <div className="space-y-3">
          <Bone className="h-4 w-full rounded-full" />
          <Bone className="h-4 w-5/6 rounded-full" />
        </div>
        <div className="space-y-2 pt-2">
          {['w-full', 'w-full', 'w-full', 'w-4/5', 'w-full', 'w-full', 'w-2/3'].map((width, index) => (
            <Line key={index} className={width} />
          ))}
        </div>
        <div className="border-t border-outline-variant/30 pt-sm">
          <Line className="w-48" />
        </div>
      </div>
    </div>
  </div>
);

/* ── News listing ─────────────────────────────────────────────────────────── */

const NewsSkeleton: React.FC = () => (
  <div className="overflow-hidden">
    <div className="container-custom pt-sm">
      <BreadcrumbsBone />
      <div className="pt-8 md:pt-12">
        <PageHeadingBone />
      </div>
    </div>

    <div className="section-band section-dots pb-16 pt-10 md:pt-12">
      <div className="container-custom space-y-9">
        <div className="flex items-center justify-between gap-4 border-b border-outline-variant/20 pb-4">
          <ChipsBone count={4} />
          <Line className="hidden w-20 sm:block" />
        </div>

        {/* Featured story */}
        <div className="grid overflow-hidden rounded-2xl border border-outline-variant/20 bg-surface-container-lowest shadow-[0_20px_50px_-34px_rgba(0,67,33,0.55)] lg:grid-cols-[1.15fr_0.85fr]">
          <Bone className="min-h-[300px] lg:min-h-[420px]" />
          <div className="flex flex-col justify-center gap-4 p-7 md:p-10 lg:p-12">
            <Bone className="h-6 w-28 rounded-full" />
            <div className="flex gap-3">
              <Line className="w-28" />
              <Line className="w-24" />
            </div>
            <Bone className="h-8 w-full rounded-lg md:h-9" />
            <Bone className="h-8 w-3/4 rounded-lg md:h-9" />
            <div className="space-y-2">
              <Line className="w-full" />
              <Line className="w-full" />
              <Line className="w-2/3" />
            </div>
            <Bone className="mt-3 h-12 w-52 rounded-lg" />
          </div>
        </div>

        {/* Latest stories */}
        <div>
          <div className="mb-5 flex items-center gap-4">
            <Bone className="h-7 w-40 shrink-0 rounded-lg" />
            <div className="h-px flex-1 bg-outline-variant/25" />
          </div>
          <div className="grid grid-cols-1 gap-gutter md:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-xl border border-outline-variant/20 bg-surface-container-lowest shadow-sm"
              >
                <Bone className="aspect-[16/9] w-full" />
                <div className="space-y-3 p-5">
                  <div className="flex gap-3">
                    <Line className="w-24" />
                    <Line className="w-20" />
                  </div>
                  <Bone className="h-6 w-4/5 rounded-md" />
                  <Line className="w-full" />
                  <Line className="w-2/3" />
                  <div className="border-t border-outline-variant/20 pt-2">
                    <Line className="w-32" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

/* ── Gallery ──────────────────────────────────────────────────────────────── */

/** Column spans of the editorial bento, in the order the real grid lays them out. */
const GALLERY_TILES = [
  'lg:col-span-7 lg:row-span-2',
  'lg:col-span-5 lg:row-span-1',
  'lg:col-span-5 lg:row-span-1',
  'lg:col-span-4 lg:row-span-1',
  'lg:col-span-4 lg:row-span-1',
  'lg:col-span-4 lg:row-span-1',
];

const GallerySkeleton: React.FC = () => (
  <div className="overflow-hidden">
    <div className="container-custom pt-sm">
      <BreadcrumbsBone />
      <div className="pt-8 md:pt-12">
        <PageHeadingBone />
      </div>
    </div>

    <div className="section-band section-grid pb-16 pt-10 md:pt-12">
      <div className="container-custom space-y-8">
        <div className="flex items-center justify-between gap-4 border-b border-outline-variant/20 pb-4">
          <ChipsBone count={5} />
          <Line className="hidden w-20 sm:block" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:auto-rows-[270px] lg:grid-cols-12">
          {GALLERY_TILES.map((span, index) => (
            <Bone key={index} className={`aspect-[4/3] w-full rounded-2xl lg:aspect-auto ${span}`} />
          ))}
        </div>
      </div>
    </div>
  </div>
);

/* ── Contact ──────────────────────────────────────────────────────────────── */

const ContactSkeleton: React.FC = () => (
  <div className="space-y-xl py-sm">
    <div className="container-custom space-y-md">
      <BreadcrumbsBone />
      <PageHeadingBone />

      <div className="grid grid-cols-1 items-stretch gap-gutter lg:grid-cols-3">
        <div className="space-y-6 rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-sm md:p-8 lg:col-span-2">
          <Bone className="h-7 w-56 rounded-lg" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FieldBone labelWidth="w-20" />
            <FieldBone labelWidth="w-28" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FieldBone labelWidth="w-28" />
            <FieldBone labelWidth="w-24" />
          </div>
          <div className="space-y-1.5">
            <Line className="w-20" />
            <Bone className="h-28 w-full rounded" />
          </div>
          <Bone className="h-12 w-40 rounded" />
        </div>

        <div className="h-full">
          <div className="section-diagonal pattern-on-dark flex h-full min-h-[440px] flex-col overflow-hidden rounded-xl border border-primary-container bg-primary p-6 shadow-md md:p-8">
            <DarkBone className="mb-7 h-7 w-48 rounded-lg" />
            <div className="flex flex-1 flex-col justify-center gap-3">
              {[0, 1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-4 rounded-lg border border-white/10 bg-white/[0.07] p-4"
                >
                  <DarkBone className="h-10 w-10 shrink-0 rounded-lg" />
                  <DarkBone className="h-4 flex-1 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>

    <section className="section-band relative h-96 w-full overflow-hidden">
      <Bone className="h-full w-full" />
    </section>
  </div>
);

/* ── Schedule a site visit ────────────────────────────────────────────────── */

const ScheduleVisitSkeleton: React.FC = () => (
  <div className="space-y-xl py-sm">
    <div className="container-custom space-y-md">
      <BreadcrumbsBone />
      <PageHeadingBone />
    </div>

    <div className="section-band section-dots py-16">
      <div className="container-custom space-y-md">
        {/* Step indicator */}
        <div className="mx-auto flex max-w-2xl items-center justify-between border-b border-outline-variant/30 pb-4">
          {['w-24', 'w-24', 'w-28'].map((width, index) => (
            <div key={index} className="flex items-center gap-2">
              <Bone className="h-8 w-8 rounded-full" />
              <Bone className={`h-3 rounded-full ${width}`} />
            </div>
          ))}
        </div>

        {/* Step 1 form */}
        <div className="mx-auto max-w-2xl space-y-6 rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-8 shadow-md">
          <Bone className="h-7 w-2/3 rounded-lg" />
          <div className="space-y-2">
            <Line className="w-40" />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[0, 1, 2, 3].map((item) => (
                <div key={item} className="space-y-2 rounded-xl border border-outline-variant p-4">
                  <Bone className="h-4 w-3/4 rounded-md" />
                  <Line className="w-1/2" />
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FieldBone labelWidth="w-28" />
            <FieldBone labelWidth="w-36" />
          </div>
          <div className="flex justify-end">
            <Bone className="h-12 w-36 rounded" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

/* ── FAQs ─────────────────────────────────────────────────────────────────── */

const FaqSkeleton: React.FC = () => (
  <div className="overflow-hidden pb-xl">
    <div className="container-custom pb-12 pt-sm md:pb-16">
      <BreadcrumbsBone />
      <div className="mx-auto max-w-3xl pt-8 text-center md:pt-12">
        <Bone className="mx-auto mb-5 h-12 w-12 rounded-full" />
        <PageHeadingBone centered />
      </div>
    </div>

    <div className="section-band section-dots">
      <div className="container-custom space-y-8">
        <ChipsBone count={5} className="pb-2 sm:flex-wrap sm:justify-center" />

        <div className="mx-auto max-w-4xl">
          <div className="mb-4 flex items-center justify-between gap-4 px-1">
            <Line className="w-32" />
          </div>
          <div className="space-y-3">
            {[0, 1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="flex items-center gap-4 rounded-2xl border border-outline-variant/25 bg-surface-container-lowest p-5 shadow-sm md:p-6"
              >
                <Bone className="h-8 w-8 shrink-0 rounded-full" />
                <Line className="w-3/4 flex-1" />
                <Bone className="h-9 w-9 shrink-0 rounded-full" />
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-5 rounded-2xl bg-primary p-7 shadow-lg sm:flex-row md:p-8">
          <div className="flex items-center gap-4">
            <DarkBone className="hidden h-11 w-11 shrink-0 rounded-full sm:block" />
            <div className="space-y-2">
              <DarkBone className="h-6 w-56 rounded-lg" />
              <DarkBone className="h-3 w-64 rounded-full" />
            </div>
          </div>
          <DarkBone className="h-12 w-40 shrink-0 rounded-lg" />
        </div>
      </div>
    </div>
  </div>
);

/* ── Careers ──────────────────────────────────────────────────────────────── */

const CareersSkeleton: React.FC = () => (
  <div className="space-y-xl py-sm">
    <div className="container-custom space-y-md">
      <BreadcrumbsBone />
      <div className="mx-auto flex min-h-[50vh] max-w-[672px] flex-col items-center justify-center space-y-6 py-12 text-center">
        <Bone className="h-28 w-28 rounded-full" />
        <Bone className="h-9 w-3/4 rounded-lg md:h-12" />
        <Bone className="h-8 w-44 rounded-full" />
        <div className="w-full space-y-2">
          <Line className="w-full" />
          <Line className="w-full" />
          <Line className="mx-auto w-2/3" />
        </div>
      </div>
    </div>
  </div>
);

/* ── Partner with us ──────────────────────────────────────────────────────── */

const PartnerSkeleton: React.FC = () => (
  <div className="space-y-xl py-sm">
    <div className="container-custom space-y-lg">
      <BreadcrumbsBone />

      <section className="relative overflow-hidden rounded-2xl bg-slate-900 shadow-md">
        <div className="max-w-[720px] space-y-4 p-8 md:p-12 lg:py-16">
          <DarkBone className="h-3 w-40 rounded-full" />
          <DarkBone className="h-9 w-full rounded-lg md:h-14" />
          <DarkBone className="h-9 w-2/3 rounded-lg md:h-14" />
          <div className="max-w-2xl space-y-2">
            <DarkBone className="h-4 w-full rounded-full" />
            <DarkBone className="h-4 w-4/5 rounded-full" />
          </div>
          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <DarkBone className="h-12 w-full rounded sm:w-56" />
            <DarkBone className="h-12 w-full rounded sm:w-60" />
          </div>
        </div>
      </section>
    </div>

    {/* Partnership tracks */}
    <div className="section-band section-grid">
      <div className="container-custom">
        <section className="space-y-6">
          <div className="space-y-2">
            <Line className="w-40" />
            <Bone className="h-7 w-80 max-w-full rounded-lg" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[0, 1, 2, 3].map((item) => (
              <div
                key={item}
                className="space-y-3 rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-sm"
              >
                <Bone className="h-10 w-10 rounded-lg" />
                <Bone className="h-6 w-2/3 rounded-md" />
                <Line className="w-full" />
                <Line className="w-4/5" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>

    {/* Application form + sidebar */}
    <div className="container-custom">
      <div className="grid grid-cols-1 gap-gutter lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="space-y-4 rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-sm md:p-8">
            <Bone className="h-7 w-64 rounded-lg" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FieldBone labelWidth="w-24" />
              <FieldBone labelWidth="w-28" />
              <FieldBone labelWidth="w-28" />
              <FieldBone labelWidth="w-32" />
            </div>
            <div className="space-y-1.5">
              <Line className="w-24" />
              <Bone className="h-28 w-full rounded" />
            </div>
            <Bone className="h-12 w-48 rounded" />
          </div>

          {/* Accreditation timeline */}
          <div className="space-y-4 rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-sm md:p-8">
            <Bone className="h-7 w-56 rounded-lg" />
            {[0, 1, 2, 3].map((item) => (
              <div key={item} className="flex gap-4">
                <Bone className="h-9 w-9 shrink-0 rounded-full" />
                <div className="flex-1 space-y-2 pb-2">
                  <Bone className="h-4 w-1/3 rounded-md" />
                  <Line className="w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="section-diagonal pattern-on-dark space-y-4 rounded-xl bg-primary p-6 shadow-md md:p-8">
            <DarkBone className="h-7 w-44 rounded-lg" />
            {[0, 1, 2, 3].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <DarkBone className="h-5 w-5 shrink-0 rounded-full" />
                <DarkBone className="h-4 flex-1 rounded-full" />
              </div>
            ))}
          </div>
          <div className="space-y-3 rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-sm">
            <Bone className="h-6 w-48 rounded-lg" />
            <Line className="w-full" />
            <Line className="w-2/3" />
            <Bone className="h-11 w-full rounded" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

/* ── Policy pages ─────────────────────────────────────────────────────────── */

const PolicySkeleton: React.FC = () => (
  <div className="container-custom max-w-4xl space-y-6 py-8">
    <BreadcrumbsBone />
    <Bone className="h-9 w-2/3 rounded-lg md:h-10" />
    <div className="space-y-6 rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-8 shadow-sm">
      <div className="space-y-2">
        <Line className="w-full" />
        <Line className="w-full" />
        <Line className="w-3/4" />
      </div>
      {[0, 1].map((item) => (
        <div key={item} className="space-y-3">
          <Bone className="h-6 w-56 rounded-md" />
          <Line className="w-full" />
          <Line className="w-full" />
          <Line className="w-4/5" />
        </div>
      ))}
    </div>
  </div>
);

/* ── Not found ────────────────────────────────────────────────────────────── */

const NotFoundSkeleton: React.FC = () => (
  <div className="container-custom flex min-h-[60vh] items-center justify-center py-16 text-center">
    <div className="w-full max-w-[448px] space-y-4">
      <Bone className="mx-auto h-16 w-40 rounded-lg" />
      <Bone className="mx-auto h-7 w-56 rounded-lg" />
      <Line className="mx-auto w-full" />
      <Line className="mx-auto w-3/4" />
      <div className="flex justify-center pt-4">
        <Bone className="h-12 w-48 rounded" />
      </div>
    </div>
  </div>
);

/* ── Chrome ───────────────────────────────────────────────────────────────── */

/**
 * Stand-in for `AnnouncementBar`, whose copy is CMS-backed and so renders empty while loading.
 * The header and footer are static, so those render for real and need no placeholder.
 */
export const AnnouncementBarSkeleton: React.FC = () => (
  <div className="relative bg-primary px-margin-desktop py-xs text-center">
    <p className="font-body-sm text-body-sm">
      <DarkBone className="mx-auto inline-block h-4 w-80 max-w-full rounded-full align-middle" />
    </p>
  </div>
);

/* ── Route table ──────────────────────────────────────────────────────────── */

/** Ordered most specific first, so `/projects/:slug` never falls through to `/projects`. */
const ROUTE_SKELETONS: Array<[string, React.FC]> = [
  ['/', HomeSkeleton],
  ['/about', AboutSkeleton],
  ['/projects/:slug', ProjectDetailSkeleton],
  ['/projects', ProjectsSkeleton],
  ['/properties/:slug', PropertyDetailSkeleton],
  ['/amenities', AmenitiesSkeleton],
  ['/updates/:slug', UpdateDetailSkeleton],
  ['/updates', UpdatesSkeleton],
  ['/news/:slug', NewsDetailSkeleton],
  ['/news', NewsSkeleton],
  ['/gallery', GallerySkeleton],
  ['/contact', ContactSkeleton],
  ['/schedule-site-visit', ScheduleVisitSkeleton],
  ['/faqs', FaqSkeleton],
  ['/careers', CareersSkeleton],
  ['/partner-with-us', PartnerSkeleton],
  ['/privacy-policy', PolicySkeleton],
  ['/terms', PolicySkeleton],
  ['/cookie-policy', PolicySkeleton],
];

/**
 * The placeholder for whichever route is currently open. Rendered inside the real page chrome, so
 * it only stands in for the routed body.
 */
export const RouteSkeleton: React.FC = () => {
  const { pathname } = useLocation();
  const match = ROUTE_SKELETONS.find(([path]) => matchPath({ path, end: true }, pathname));
  const Skeleton = match?.[1] ?? NotFoundSkeleton;

  return (
    <div role="status" aria-live="polite" aria-label="Loading page content">
      <span className="sr-only">Loading page content…</span>
      <Skeleton />
    </div>
  );
};

export default RouteSkeleton;
