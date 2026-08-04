import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { faqAnswerKey, faqQuestionKey, resolveFaqs } from '../data/faqContent';
import { ProjectCard } from '../components/cards/ProjectCard';
import { AmenityCard } from '../components/cards/AmenityCard';
import { UpdateCard } from '../components/cards/UpdateCard';
import { useAdmin } from '../context/AdminContext';
import { EditableText } from '../components/admin/EditableText';
import { EditableImage } from '../components/admin/EditableImage';
import { AnimatedPage } from '../components/layout/AnimatedPage';
import { fadeInUp, fadeInLeft, fadeInRight, staggerContainer, scaleUp } from '../utils/animations';
import { ArrowRight, CheckCircle2, ChevronDown, HelpCircle, Mail, MapPin, Phone } from 'lucide-react';

/** Title-case treatment used throughout the design. Drop this constant to revert to sentence case. */
const TITLE_CASE = 'capitalize';

/** Small green eyebrow label that sits above every section heading. */
const EYEBROW = 'font-label-lg text-[12px] font-bold uppercase tracking-[0.18em] text-primary';

/** Section heading shared across the page. */
const SECTION_HEADING = `font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg font-bold text-primary ${TITLE_CASE}`;

const SECTION_SHELL = 'w-full max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop';

export const HomePage: React.FC = () => {
  const { projects, amenities, updates, pageContent } = useAdmin();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<string | number | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 700], [0, 100]);
  const yBg = prefersReducedMotion ? 0 : parallaxY;

  const faqs = useMemo(() => resolveFaqs(pageContent), [pageContent]);

  const handleScrollCueClick = () => {
    document.getElementById('featured')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <AnimatedPage className="overflow-hidden bg-surface">
      {/* 1. HERO SECTION */}
      <section className="relative flex min-h-[560px] w-full items-center justify-center overflow-hidden bg-surface-variant sm:h-[600px] lg:h-[900px]">
        {/* Background Image Overlay with Parallax */}
        <motion.div style={{ y: yBg }} className="absolute -top-[10%] inset-0 z-0 h-[120%]">
          <EditableImage
            contentKey="home_hero_image"
            value="/src/assets/herolcn.png"
            overlayClassName="p-6 pr-8 flex items-center justify-end"
          >
            {(src) => (
              <div className="relative h-full w-full">
                <img
                  src={src}
                  alt="Lakeshore Central Aerial View"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  className="h-full w-full object-cover opacity-85"
                />
                <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-slate-950/95 from-10% via-slate-900/80 via-35% to-transparent to-90%" />
              </div>
            )}
          </EditableImage>
        </motion.div>

        {/* z-40 keeps the hero copy (and its edit affordances) above the image hover overlay */}
        <div className={`${SECTION_SHELL} pointer-events-none relative z-40 flex h-full min-h-[560px] flex-col justify-center py-10 pb-20 sm:min-h-0 sm:py-0`}>
          <motion.div
            variants={staggerContainer(0.12, 0.1)}
            initial="hidden"
            animate="visible"
            className="pointer-events-auto flex max-w-[672px] flex-col items-center text-center text-on-primary sm:items-start sm:text-left"
          >
            <motion.div variants={fadeInUp(0.5)}>
              <EditableText
                contentKey="home_hero_tagline"
                className="mb-3 block font-label-lg text-[12px] uppercase tracking-[0.18em] text-primary-fixed sm:mb-4 sm:text-label-lg"
                tag="span"
              />
            </motion.div>

            <motion.div variants={fadeInUp(0.5)}>
              <EditableText
                contentKey="home_hero_title"
                className={`mb-3 font-headline-xl-mobile text-[26px] leading-[1.2] text-white sm:mb-sm sm:text-headline-xl-mobile md:font-headline-xl md:text-headline-xl ${TITLE_CASE}`}
                tag="h1"
              />
            </motion.div>

            <motion.div variants={fadeInUp(0.5)} className="mb-7 max-w-[560px] sm:mb-lg">
              <EditableText
                contentKey="home_hero_subtitle"
                value="Experience the perfect blend of nature, comfort, and investment potential in the heart of the Philippines."
                className="font-body-lg text-[15px] leading-relaxed text-white/90 sm:text-body-lg"
                tag="p"
                multiline={true}
              />
            </motion.div>

            {/* Hero CTAs */}
            <motion.div variants={fadeInUp(0.5)} className="flex w-full max-w-[300px] flex-col gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:gap-sm">
              <Link
                to="/projects"
                className="home-cta group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded bg-primary px-6 py-3.5 text-center font-label-lg text-[12px] uppercase tracking-wider text-on-primary shadow-md hover:bg-primary-container sm:w-auto sm:px-8 sm:py-4 sm:text-label-lg"
              >
                <EditableText contentKey="home_hero_cta_primary" value="Explore Projects" tag="span" inline />
                {/* <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" /> */}
              </Link>

              <Link
                to="/schedule-site-visit"
                className="home-cta inline-flex min-h-12 w-full items-center justify-center gap-2 rounded border border-white/70 bg-transparent px-6 py-3.5 text-center font-label-lg text-[12px] uppercase tracking-wider text-white hover:border-white hover:bg-white/10 sm:w-auto sm:px-8 sm:py-4 sm:text-label-lg"
              >
                {/* <Calendar className="h-4 w-4 text-primary-fixed" /> */}
                <EditableText contentKey="home_hero_cta_secondary" value="Schedule a Site Visit" tag="span" inline />
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.button
          type="button"
          onClick={handleScrollCueClick}
          aria-label="Scroll to featured project"
          animate={prefersReducedMotion ? undefined : { opacity: [0.65, 1, 0.65] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}
          whileHover={prefersReducedMotion ? undefined : { scale: 1.1 }}
          whileTap={{ scale: 0.94 }}
          className="absolute bottom-4 left-1/2 z-40 -translate-x-1/2 cursor-pointer sm:bottom-6"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/50 bg-white/15 backdrop-blur-sm transition-colors hover:bg-white/25">
            <ChevronDown className="w-4 h-4 text-white" />
          </span>
        </motion.button>
      </section>

      {/* 3. LCPH INTRODUCTION */}
      <motion.section
        variants={fadeInUp(0.6)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.14, margin: '0px 0px -14% 0px' }}
        className={`${SECTION_SHELL} py-xl text-center`}
      >
        <EditableText contentKey="home_intro_badge" className={`mb-2 block ${EYEBROW}`} tag="span" />
        <EditableText contentKey="home_intro_title" className={`mb-md block ${SECTION_HEADING}`} tag="h2" />
        <EditableText
          contentKey="home_intro_text"
          className={`mx-auto max-w-[768px] font-body-md text-body-md leading-relaxed text-on-surface-variant ${TITLE_CASE}`}
          tag="p"
          multiline={true}
        />
      </motion.section>

      {/* 4. FEATURED FLAGSHIP SPOTLIGHT */}
      <motion.section
        variants={fadeInUp(0.6)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.14, margin: '0px 0px -14% 0px' }}
        className={`${SECTION_SHELL} pb-xl`}
      >
        <div className="relative lg:flex lg:items-center" id="featured">
          {/* Image panel */}
          <motion.div
            variants={fadeInLeft(0.6)}
            whileHover={prefersReducedMotion ? undefined : { scale: 1.01 }}
            transition={{ duration: 0.45, ease: [0.2, 0, 0, 1] }}
            className="group relative h-[320px] overflow-hidden lg:h-[460px] lg:w-[58%]"
          >
            <EditableImage contentKey="home_spotlight_image" value="/src/assets/masterplan.jpg">
              {(src) => (
                <img
                  src={src}
                  alt="Lakeshore Community North Aerial View"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                />
              )}
            </EditableImage>
            <div className="absolute left-4 top-4 z-40 rounded bg-primary/90 px-3 py-1 font-label-lg text-[11px] font-bold uppercase tracking-wider text-on-primary backdrop-blur-md">
              <EditableText contentKey="home_spotlight_badge" value="Pre-selling" tag="span" inline />
            </div>
          </motion.div>

          {/* Overlapping detail card */}
          <motion.div
            variants={fadeInRight(0.6)}
              className="relative z-10 -mt-10 mx-4 flex flex-col justify-center rounded-tl-lg border border-outline-variant/20 bg-surface-container-lowest p-8 shadow-[0_20px_40px_-10px_rgba(0,67,33,0.14)] lg:-ml-16 lg:mt-0 lg:mr-0 lg:w-[48%] lg:p-10"
        >
            <div className="mb-4 flex gap-2">
              <span className="rounded bg-tertiary-container px-2.5 py-1 font-label-lg text-[10px] font-bold uppercase tracking-wider text-on-primary">
                <EditableText contentKey="home_spotlight_tag_1" value="Residential" tag="span" inline />
              </span>
              <span className="rounded bg-tertiary-container px-2.5 py-1 font-label-lg text-[10px] font-bold uppercase tracking-wider text-on-primary">
                <EditableText contentKey="home_spotlight_tag_2" value="Commercial" tag="span" inline />
              </span>
            </div>

            <EditableText
              contentKey="home_spotlight_title"
              className={`mb-2 font-headline-md text-headline-md font-bold text-on-surface ${TITLE_CASE}`}
              tag="h3"
            />

            <p className="mb-md flex items-center gap-2 font-body-md text-body-md text-on-surface-variant">
              <MapPin className="w-4 h-4 text-primary" />
              <EditableText contentKey="home_spotlight_location" className="font-semibold" tag="span" />
            </p>

            <EditableText
              contentKey="home_spotlight_description"
              className={`mb-lg line-clamp-4 font-body-sm text-body-sm leading-relaxed text-on-surface-variant ${TITLE_CASE}`}
              tag="p"
              multiline={true}
            />

            <ul className="mb-lg space-y-2">
              {[
                { key: 'home_spotlight_feature_1', value: '300 - 800 sqm Lot Sizes' },
                { key: 'home_spotlight_feature_2', value: 'Clubhouse & Infinity Lakeside Pool' },
                { key: 'home_spotlight_feature_3', value: '24/7 Premium Security' },
              ].map((item) => (
                <li key={item.key} className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface-variant">
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-primary" />
                  <EditableText contentKey={item.key} value={item.value} tag="span" inline />
                </li>
              ))}
            </ul>

            <Link
              to="/projects/lakeshore-community-north"
              className="home-cta group inline-flex w-fit items-center gap-2 self-end rounded border border-tertiary-container px-6 py-2.5 font-label-lg text-[12px] font-bold uppercase tracking-wider text-tertiary hover:bg-tertiary-container hover:text-on-primary"
            >
              <EditableText contentKey="home_spotlight_cta" value="Explore Project" tag="span" inline />
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* 5. ALL PROJECTS GRID */}
      <motion.section
        variants={fadeInUp(0.6)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.14, margin: '0px 0px -14% 0px' }}
        className="py-16"
      >
        <div className={`${SECTION_SHELL} space-y-10`}>
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div className="space-y-1">
              <EditableText
                contentKey="home_projects_badge"
                value="Flagship Townships"
                className={`block ${EYEBROW}`}
                tag="span"
              />
              <EditableText
                contentKey="home_projects_title"
                value="Featured Master Developments"
                className="block font-headline-sm text-headline-sm font-bold uppercase tracking-wide text-on-surface"
                tag="h2"
              />
            </div>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 font-label-lg text-[12px] font-bold uppercase tracking-wider text-primary hover:underline"
            >
              <EditableText contentKey="home_projects_cta" value="View All Projects" tag="span" inline />
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <motion.div
            variants={staggerContainer(0.1, 0.1)}
            className="mx-auto grid max-w-[960px] grid-cols-1 gap-gutter md:grid-cols-2"
          >
            {projects.slice(0, 3).map((project) => (
              <motion.div key={project.id} variants={scaleUp(0.5)}>
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* 7. AMENITIES PREVIEW */}
      <motion.section
        variants={fadeInUp(0.6)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.14, margin: '0px 0px -14% 0px' }}
        className="py-16"
      >
        <div className={`${SECTION_SHELL} space-y-10`}>
          <div className="mx-auto max-w-[768px] space-y-3 text-center">
            <EditableText contentKey="home_amenities_badge" className={`block ${EYEBROW}`} tag="span" />
            <EditableText contentKey="home_amenities_title" className={`block ${SECTION_HEADING}`} tag="h2" />
            <EditableText
              contentKey="home_amenities_description"
              className={`block font-body-md text-body-md text-on-surface-variant ${TITLE_CASE}`}
              tag="p"
            />
          </div>

          <motion.div variants={staggerContainer(0.08, 0.1)} className="mx-auto max-w-[1100px] space-y-6">
            {amenities.slice(0, 4).map((amenity, index) => (
              <motion.div key={amenity.id} variants={fadeInUp(0.4)}>
                <AmenityCard amenity={amenity} variant="row" reverse={index % 2 === 1} />
              </motion.div>
            ))}
          </motion.div>

          <div className="pt-4 text-center">
            <Link
              to="/amenities"
              className="home-cta group inline-flex items-center gap-2 rounded bg-primary px-8 py-3.5 font-label-lg text-label-lg uppercase tracking-wider text-on-primary shadow-sm hover:bg-primary-container"
            >
              <EditableText contentKey="home_amenities_cta" value="Explore All Amenities" tag="span" inline />
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </motion.section>

      {/* 8. DEVELOPMENT PROGRESS UPDATES */}
      <motion.section
        variants={fadeInUp(0.6)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.14, margin: '0px 0px -14% 0px' }}
        className={`${SECTION_SHELL} space-y-10 py-16`}
      >
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="space-y-1">
            <EditableText
              contentKey="home_updates_badge"
              value="Site Engineering"
              className={`block ${EYEBROW}`}
              tag="span"
            />
            <EditableText
              contentKey="home_updates_title"
              value="Recent Construction Progress"
              className="block font-headline-sm text-headline-sm font-bold text-on-surface"
              tag="h2"
            />
          </div>
          <Link
            to="/updates"
            className="inline-flex items-center gap-2 font-label-lg text-[12px] font-bold uppercase tracking-wider text-primary hover:underline"
          >
            <EditableText contentKey="home_updates_cta" value="All Progress Reports" tag="span" inline />
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <motion.div variants={staggerContainer(0.12, 0.1)} className="grid grid-cols-1 gap-gutter md:grid-cols-2">
          {updates.slice(0, 2).map((update) => (
            <motion.div
              key={update.id}
              variants={fadeInUp(0.4)}
              whileHover={prefersReducedMotion ? undefined : { y: -6 }}
              transition={{ duration: 0.28, ease: [0.2, 0, 0, 1] }}
            >
              <UpdateCard update={update} />
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* 10. FREQUENTLY ASKED QUESTIONS */}
      <motion.section
        variants={fadeInUp(0.6)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.14, margin: '0px 0px -14% 0px' }}
        className={`${SECTION_SHELL} space-y-8 py-16`}
      >
        <div className="mx-auto max-w-[672px] space-y-2 text-center">
          <EditableText
            contentKey="home_faq_badge"
            value="Buyer Guidance"
            className={`block ${EYEBROW}`}
            tag="span"
          />
          <EditableText
            contentKey="home_faq_title"
            value="Frequently Asked Questions"
            className={`block ${SECTION_HEADING}`}
            tag="h2"
          />
        </div>

        <motion.div variants={staggerContainer(0.08, 0.1)} className="mx-auto max-w-[768px] space-y-3">
          {faqs.map((faq) => {
            const isOpen = openFaq === faq.id;
            return (
              <motion.div
                key={faq.id}
                variants={fadeInUp(0.4)}
                whileHover={prefersReducedMotion ? undefined : { y: -2, borderColor: 'rgba(0, 67, 33, 0.28)' }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden rounded-xl border border-outline-variant/20 bg-surface-container-lowest shadow-sm transition-shadow hover:shadow-md"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                  aria-expanded={isOpen}
                  className="group flex w-full cursor-pointer items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-surface-container-low"
                >
                  <HelpCircle className="w-5 h-5 shrink-0 text-primary transition-transform duration-300 group-hover:scale-110" />
                  <span className={`flex-1 font-headline-sm text-body-md font-semibold text-on-surface ${TITLE_CASE}`}>
                    <EditableText
                      contentKey={faqQuestionKey(faq.id)}
                      value={faq.question}
                      tag="span"
                      inline
                    />
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 text-on-surface-variant transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`} />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: prefersReducedMotion ? 0 : 0.2, ease: [0.2, 0, 0, 1] }}
                    >
                      <EditableText
                        contentKey={faqAnswerKey(faq.id)}
                        value={faq.answer}
                        className="px-5 pb-5 pl-13 font-body-sm text-body-sm leading-relaxed text-on-surface-variant"
                        tag="p"
                        multiline={true}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="pt-2 text-center">
          <Link
            to="/faqs"
            className="inline-flex items-center gap-2 font-label-lg text-[12px] font-bold uppercase tracking-wider text-primary hover:underline"
          >
            <EditableText
              contentKey="home_faq_cta"
              value="View All Frequently Asked Questions"
              tag="span"
              inline
            />
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </motion.section>

      {/* 11. INQUIRY & CONTACT FORM SECTION */}
      <motion.section
        variants={fadeInUp(0.6)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.14, margin: '0px 0px -14% 0px' }}
        className="bg-primary py-16 text-on-primary"
      >
        <div className={SECTION_SHELL}>
          <div className="grid grid-cols-1 items-center gap-lg lg:grid-cols-2">
            <motion.div variants={fadeInLeft(0.6)} className="space-y-6">
              <EditableText
                contentKey="home_contact_badge"
                value="Get in Touch"
                className="block font-label-lg text-[12px] font-bold uppercase tracking-[0.18em] text-on-primary-container"
                tag="span"
              />
              <EditableText
                contentKey="home_contact_title"
                value="Reserve Your Lakeside Legacy Lot Today."
                className={`block font-headline-lg text-headline-lg text-white ${TITLE_CASE}`}
                tag="h2"
              />
              <EditableText
                contentKey="home_contact_desc"
                value="Connect with our certified property specialists for custom sample computations, site tour arrangements, or master plan inquiries."
                className="block font-body-md text-body-md leading-relaxed text-slate-200"
                tag="p"
                multiline={true}
              />

              <div className="space-y-3 pt-2 font-body-sm text-body-sm text-slate-200">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary-fixed" />
                  <EditableText
                    contentKey="home_contact_phone"
                    value="Sales Hotline: +63 (917) 123-4567"
                    tag="span"
                    className="block"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary-fixed" />
                  <EditableText
                    contentKey="home_contact_email"
                    value="Email: inquire@lcphrealty.com"
                    tag="span"
                    className="block"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary-fixed" />
                  <EditableText
                    contentKey="home_contact_address"
                    value="Location: KM 71 NLEX Interchange, Mexico, Pampanga"
                    tag="span"
                    className="block"
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={fadeInRight(0.6)}
              className="rounded-2xl border border-outline-variant/15 bg-surface-container-lowest p-8 text-on-surface shadow-2xl"
            >
              <EditableText
                contentKey="home_form_title"
                value="Send a Direct Inquiry"
                className="mb-4 block font-headline-md text-headline-md text-on-surface"
                tag="h3"
              />

              {formSubmitted ? (
                <div className="space-y-3 rounded-xl bg-primary-container p-6 text-center text-on-primary-container">
                  <CheckCircle2 className="w-10 h-10 mx-auto" />
                  <EditableText
                    contentKey="home_form_success_title"
                    value="Thank You for Reaching Out!"
                    className="block font-headline-sm text-headline-sm font-bold"
                    tag="h4"
                  />
                  <EditableText
                    contentKey="home_form_success_text"
                    value="Your inquiry has been logged. An LCPH Property Specialist will reach out to you within 24 hours."
                    className="block font-body-sm text-body-sm opacity-90"
                    tag="p"
                    multiline={true}
                  />
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label className="mb-1 block text-xs font-bold uppercase text-on-surface-variant">
                      <EditableText contentKey="home_form_label_name" value="Full Name" tag="span" inline />
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Maria Santos"
                      className="w-full rounded border border-outline-variant bg-surface px-3.5 py-2.5 text-body-md outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-bold uppercase text-on-surface-variant">
                        <EditableText contentKey="home_form_label_email" value="Email Address" tag="span" inline />
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="maria@example.com"
                        className="w-full rounded border border-outline-variant bg-surface px-3.5 py-2.5 text-body-md outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-bold uppercase text-on-surface-variant">
                        <EditableText contentKey="home_form_label_mobile" value="Mobile Number" tag="span" inline />
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+63 917 000 0000"
                        className="w-full rounded border border-outline-variant bg-surface px-3.5 py-2.5 text-body-md outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold uppercase text-on-surface-variant">
                      <EditableText contentKey="home_form_label_project" value="Preferred Project" tag="span" inline />
                    </label>
                    <select className="w-full rounded border border-outline-variant bg-surface px-3.5 py-2.5 text-body-md text-on-background outline-none focus:border-primary focus:ring-1 focus:ring-primary">
                      {projects.map((proj) => (
                        <option key={proj.id} value={proj.slug}>
                          {proj.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold uppercase text-on-surface-variant">
                      <EditableText contentKey="home_form_label_message" value="Message" tag="span" inline />
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Tell us about your lot requirements or scheduled visit preference..."
                      className="w-full rounded border border-outline-variant bg-surface px-3.5 py-2.5 text-body-md outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <button
                    type="submit"
                    className="home-cta flex w-full cursor-pointer items-center justify-center gap-2 rounded bg-primary py-3 font-label-lg text-label-lg text-on-primary shadow-md hover:bg-primary-container hover:text-on-primary-container"
                  >
                    <EditableText contentKey="home_form_submit" value="Send Inquiry" tag="span" inline />
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </motion.section>
    </AnimatedPage>
  );
};
