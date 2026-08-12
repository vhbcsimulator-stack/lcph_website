import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import type { DevelopmentUpdate } from '../types';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { UpdateCard } from '../components/cards/UpdateCard';
import { AnimatedPage } from '../components/layout/AnimatedPage';
import { UpdateFormModal } from '../components/admin/UpdateFormModal';
import { EditableText } from '../components/admin/EditableText';
import { EditableRichText } from '../components/admin/EditableRichText';
import { EditableImage } from '../components/admin/EditableImage';
import { useAdmin } from '../context/AdminContext';
import { fadeInUp, staggerContainer } from '../utils/animations';

/** Blocks below the fold rise in as they are scrolled to, once each. */
const REVEAL_ON_SCROLL = {
  variants: fadeInUp(0.6),
  initial: 'hidden',
  whileInView: 'visible',
  viewport: { once: true, amount: 0.14, margin: '0px 0px -14% 0px' },
} as const;

export const UpdatesPage: React.FC = () => {
  const { updates, isAdmin, updateUpdateField } = useAdmin();
  // `null` means "create"; an update means "edit that one". Undefined keeps the modal closed.
  const [editing, setEditing] = useState<DevelopmentUpdate | null | undefined>(undefined);

  // An explicitly flagged update wins; otherwise the newest entry headlines the page.
  // The grid below stays the full list, so the featured one is a highlight rather than a removal.
  const featured = updates.find((u) => u.featured) ?? updates[0];

  const setFeatured = (id: string) => {
    if (!isAdmin) return;
    updates.forEach((update) => {
      const shouldBeFeatured = update.id === id;
      if (!!update.featured !== shouldBeFeatured) {
        updateUpdateField(update.id, 'featured', shouldBeFeatured);
      }
    });
  };

  return (
    <AnimatedPage className="space-y-l">
      <div className="container-custom max-w-[1120px] space-y-md">
        <Breadcrumbs items={[{ label: 'Development Updates' }]} />

        {/* Page Header â€” animates on mount, so the page opens with the reveal */}
        <motion.div
          variants={staggerContainer(0.12, 0.05)}
          initial="hidden"
          animate="visible"
          className="grid items-end gap-4 md:grid-cols-[1fr_auto]"
        >
          <motion.div variants={fadeInUp(0.55)} className="space-y-xs">
            <EditableText
              contentKey="updates_title"
              tag="h1"
              className="font-headline-xl-mobile md:font-headline-xl text-headline-xl-mobile md:text-headline-xl text-primary font-bold"
            />
            <EditableText
              contentKey="updates_subtitle"
              tag="p"
              className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl leading-relaxed"
            />
          </motion.div>
        </motion.div>

      </div>

      {/* Report feed â€” banded so the reports read as one zone under the page header */}
      <div className="section-band section-dots py-16">
        <div className="container-custom max-w-[1120px] space-y-md">
          {/* Featured update */}
          {featured && (
            <motion.div {...REVEAL_ON_SCROLL}>
              <UpdateCard update={featured} variant="featured" onEdit={setEditing} onSetFeatured={setFeatured} />
            </motion.div>
          )}

          {/* Empty state â€” the band would otherwise read as a broken/blank section */}
          {updates.length === 0 && (
            <motion.div
              {...REVEAL_ON_SCROLL}
              className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-outline-variant bg-surface/60 px-6 py-16 text-center"
            >
              {/* rounded-[50%]: this theme redefines --radius-full to 0.75rem, so `rounded-full` is not a circle */}
              <span className="flex h-14 w-14 items-center justify-center rounded-[50%] bg-primary/10 text-primary">
                <FileText className="h-7 w-7" aria-hidden="true" />
              </span>
              <h2 className="font-headline-sm text-headline-sm text-primary font-semibold">
                No progress reports yet
              </h2>
              {/* Explicit ch width: `max-w-md` would resolve against this theme's --spacing-md (24px) */}
              <p className="font-body-md text-body-md text-on-surface-variant max-w-[52ch] leading-relaxed">
                   Construction milestones and site photos will be posted here as soon as they are available. Please check back soon.
              </p>
                <Link
                  to="/projects"
                  className="mt-2 rounded border border-primary/40 px-6 py-2.5 font-label-lg text-label-lg text-primary transition-colors hover:bg-primary/5"
                >
                  View Projects
                </Link>
            </motion.div>
          )}

          {/* All updates */}
          {updates.length > 0 && (
            <motion.div
              variants={staggerContainer(0.1, 0.05)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1, margin: '0px 0px -12% 0px' }}
              className="grid grid-cols-1 gap-gutter md:grid-cols-2"
            >
              {updates.map((update) => (
                <motion.div key={update.id} variants={fadeInUp(0.45)}>
                  <UpdateCard update={update} onEdit={setEditing} onSetFeatured={setFeatured} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      <div className="w-full">
        {/* CTA banner */}
        <motion.section {...REVEAL_ON_SCROLL} className="section-diagonal pattern-on-dark grid w-full items-center gap-6 overflow-hidden bg-primary px-6 py-6 text-on-primary md:grid-cols-[1.2fr_1fr] md:px-10 md:py-7">
          <div className="space-y-3 ">
            <EditableText
              contentKey="updates_cta_title"
              value="Build Your Legacy With LCPH"
              className="block font-headline-lg text-[26px] font-medium text-on-primary md:text-[30px] ml-[10vh]"
              tag="h2"
            />
            <EditableRichText
              contentKey="updates_cta_text"
              className="block font-body-sm text-[15px] leading-relaxed text-on-primary/90 ml-[10vh]"
              compact
            />
            <div className="flex flex-col gap-4 pt-3 sm:flex-row ml-[10vh]">
              <Link
                to="/contact"
                className="rounded bg-[#002f1a] px-7 py-3 text-center font-label-lg text-label-lg text-on-primary transition-colors hover:bg-[#002715]"
              >
                <EditableText contentKey="updates_cta_primary" value="Inquire Now" tag="span" inline />
              </Link>
              <Link
                to="/projects"
                className="rounded border border-on-primary/70 px-7 py-3 text-center font-label-lg text-label-lg text-on-primary transition-colors hover:bg-white/10"
              >
                <EditableText contentKey="updates_cta_secondary" value="View Projects" tag="span" inline />
              </Link>
            </div>
          </div>

          <div className="relative isolate h-[240px] w-auto sm:h-[270px] md:h-[300px]">
            <div aria-hidden="true" className="absolute -bottom-8 -right-8 h-36 w-36 rotate-12 rounded-3xl bg-primary-fixed/25" />
            <div aria-hidden="true" className="absolute -right-5 -top-7 h-24 w-24 rounded-full border-[14px] border-white/10" />
            <div aria-hidden="true" className="absolute -bottom-4 left-8 h-16 w-44 -rotate-6 rounded-full bg-white/[0.07]" />
            <div
              className="group relative z-10 h-full overflow-hidden rounded-[24px] transition-shadow duration-500 hover:shadow-2xl hover:shadow-black/30"
              style={{ clipPath: 'inset(0 round 24px)' }}
            >
              <EditableImage contentKey="updates_cta_image" value="">
                {(src) => (
                  <img
                    src={src}
                    alt="LCPH residence"
                    className="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                )}
              </EditableImage>
            </div>
          </div>
        </motion.section>
      </div>

      <UpdateFormModal
        isOpen={editing !== undefined}
        update={editing}
        onClose={() => setEditing(undefined)}
      />
    </AnimatedPage>
  );
};
export default UpdatesPage;
