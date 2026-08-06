import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { EditableText } from '../components/admin/EditableText';
import { EditableImage } from '../components/admin/EditableImage';
import { AnimatedPage } from '../components/layout/AnimatedPage';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { fadeInUp, fadeInLeft, fadeInRight, staggerContainer, scaleUp } from '../utils/animations';
import { Eye, Gem, Target } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { scrollY } = useScroll();
  const yAboutBg = useTransform(scrollY, [0, 350], [0, 70]);

  return (
    <AnimatedPage className="overflow-hidden bg-background pb-xl pt-lg">
      <div className="container-custom max-w-[1120px]">
        <Breadcrumbs items={[{ label: 'About Us' }]} />

        {/* Page Hero */}
        <motion.div
          variants={scaleUp(0.6)}
          initial="hidden"
          animate="visible"
          className="relative flex h-[300px] w-full items-center justify-center overflow-hidden rounded-lg shadow-sm md:h-[390px]"
        >
          {/* Background Image Overlay with Parallax */}
          <motion.div style={{ y: yAboutBg }} className="absolute inset-0 h-[120%] -top-[10%]">
            <EditableImage
              contentKey="about_hero_image"
              value=""
              overlayClassName="p-6 pr-8 flex items-center justify-end"
            >
              {(src) => (
                <img
                  src={src}
                  alt="Lakeshore Estate landscape"
                  className="w-full h-full object-cover"
                />
              )}
            </EditableImage>
            {/* pointer-events-none so the scrim can't swallow clicks meant for the image editor */}
            <div className="pointer-events-none absolute inset-0 bg-black/45" />
          </motion.div>
          {/* The copy layer sits above the image, so it stays click-through except on the text itself */}
          <motion.div
            variants={staggerContainer(0.12, 0.15)}
            className="pointer-events-none relative z-10 mx-auto w-full max-w-[680px] px-6 text-center text-white"
          >
            <motion.div variants={fadeInUp(0.4)} className="pointer-events-auto">
              <EditableText
                contentKey="about_hero_title"
                className="mb-4 font-headline-xl text-[32px] font-bold leading-tight text-white md:text-[42px]"
                tag="h1"
              />
            </motion.div>
            <motion.div variants={fadeInUp(0.4)} className="pointer-events-auto">
              <EditableText
                contentKey="about_hero_text"
                className="mx-auto max-w-2xl font-body-lg text-[14px] leading-relaxed text-white/90 md:text-[15px]"
                tag="p"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Company Overview */}
      <motion.section
        variants={fadeInUp(0.6)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.14, margin: '0px 0px -14% 0px' }}
        className="mx-auto max-w-[1040px] px-4 py-16 md:px-8 md:py-20"
      >
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-[0.95fr_1.05fr] md:gap-16">
          <motion.div variants={fadeInLeft(0.6)} className="space-y-5">
            <EditableText
              contentKey="about_story_title"
              className="font-headline-lg text-[28px] font-semibold leading-tight text-primary md:text-[32px]"
              tag="h2"
            />
            <EditableText
              contentKey="about_story_p1"
              className="font-body-sm text-[14px] leading-relaxed text-on-surface-variant"
              tag="p"
              multiline={true}
            />
            <EditableText
              contentKey="about_story_p2"
              className="font-body-sm text-[14px] leading-relaxed text-on-surface-variant"
              tag="p"
              multiline={true}
            />
          </motion.div>

          <motion.div variants={fadeInRight(0.6)} className="relative mx-auto w-[92%] md:w-full">
            <div className="absolute -left-7 -top-5 h-[calc(100%+10px)] w-[62%] rounded-lg border border-primary/70" />
            <div className="absolute -bottom-5 -left-3 h-[72%] w-[58%] rounded-lg border border-secondary/50" />
            <div className="relative h-[300px] overflow-hidden rounded-lg shadow-md md:h-[350px]">
              <EditableImage contentKey="about_story_image" value="">
                {(src) => (
                  <img
                    src={src}
                    alt="Lakeshore modern clubhouse in forest"
                    className="h-full w-full object-cover"
                  />
                )}
              </EditableImage>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Mission, Vision, Values (Bento Grid Style) */}
      <motion.section
        variants={fadeInUp(0.6)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.14, margin: '0px 0px -14% 0px' }}
        className="px-4 pb-20 pt-6 md:px-8"
      >
        <div className="mx-auto max-w-[1120px]">
          <div className="mb-10 text-center">
            <EditableText
              contentKey="about_principles_title"
              value="Core Principles"
              className="block font-headline-lg text-[28px] font-medium text-primary md:text-[32px]"
              tag="h2"
            />
          </div>
          <motion.div
            variants={staggerContainer(0.1, 0.1)}
            className="grid grid-cols-1 gap-4 md:grid-cols-3"
          >
            {/* Mission */}
            <motion.div variants={scaleUp(0.4)} className="interactive-panel group flex min-h-[285px] flex-col items-center border border-outline-variant/20 bg-surface-container-lowest px-7 py-9 text-center shadow-sm">
              <div className="interactive-icon mb-6 text-on-background">
                <Target className="h-10 w-10" strokeWidth={1.8} />
              </div>
              <EditableText
                contentKey="about_mission_title"
                value="Our Mission"
                className="mb-5 block font-headline-md text-[20px] font-medium uppercase text-on-background"
                tag="h3"
              />
              <EditableText
                contentKey="about_mission_text"
                value="To develop exceptional, nature-integrated properties that elevate the standard of living while preserving the ecological heritage of the land."
                className="block font-body-sm text-[14px] leading-relaxed text-on-surface-variant"
                tag="p"
                multiline={true}
              />
            </motion.div>
            {/* Vision */}
            <motion.div variants={scaleUp(0.4)} className="interactive-panel group flex min-h-[285px] flex-col items-center border border-outline-variant/20 bg-surface-container-lowest px-7 py-9 text-center shadow-sm">
              <div className="interactive-icon mb-6 text-on-background">
                <Eye className="h-10 w-10" strokeWidth={1.8} />
              </div>
              <EditableText
                contentKey="about_vision_title"
                value="Our Vision"
                className="mb-5 block font-headline-md text-[20px] font-medium uppercase text-on-background"
                tag="h3"
              />
              <EditableText
                contentKey="about_vision_text"
                value="To be the premier developer recognized for creating timeless, sustainable communities that define premium heritage living."
                className="block font-body-sm text-[14px] leading-relaxed text-on-surface-variant"
                tag="p"
                multiline={true}
              />
            </motion.div>
            {/* Values */}
            <motion.div variants={scaleUp(0.4)} className="interactive-panel group flex min-h-[285px] flex-col items-center border border-outline-variant/20 bg-surface-container-lowest px-7 py-9 text-center shadow-sm">
              <div className="interactive-icon mb-6 text-on-background">
                <Gem className="h-10 w-10" strokeWidth={1.8} />
              </div>
              <EditableText
                contentKey="about_values_title"
                value="Our Values"
                className="mb-5 block font-headline-md text-[20px] font-medium uppercase text-on-background"
                tag="h3"
              />
              <ul className="w-full space-y-2 font-body-sm text-[14px] text-on-surface-variant">
                {[
                  { key: 'about_value_1', value: 'Sustainability First' },
                  { key: 'about_value_2', value: 'Architectural Excellence' },
                  { key: 'about_value_3', value: 'Community Focus' },
                ].map((item) => (
                  <li key={item.key} className="flex items-center justify-center gap-2">
                    <span aria-hidden="true">✓</span>
                    <EditableText contentKey={item.key} value={item.value} tag="span" inline />
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        variants={fadeInUp(0.6)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.14, margin: '0px 0px -14% 0px' }}
        className="px-4 md:px-8"
      >
        <div className="mx-auto max-w-[1120px] space-y-3 bg-primary px-6 py-10 text-center text-on-primary md:py-12">
          <EditableText
            contentKey="about_cta_title"
            value="Partner and Build Your Dream Home with LCPH"
            className="block font-headline-lg text-[26px] font-medium text-on-primary md:text-[30px]"
            tag="h2"
          />
          <EditableText
            contentKey="about_cta_text"
            value="Discover our active project sites."
            className="block font-body-sm text-[15px] text-on-primary/90"
            tag="p"
          />
          <div className="flex flex-col justify-center gap-4 pt-3 sm:flex-row">
            <Link to="/projects" className="rounded bg-[#002f1a] px-7 py-3 font-label-lg text-label-lg text-on-primary transition-colors hover:bg-[#002715]">
              <EditableText contentKey="about_cta_primary" value="Browse Projects" tag="span" inline />
            </Link>
            <Link to="/contact" className="rounded border border-on-primary/70 px-7 py-3 font-label-lg text-label-lg text-on-primary transition-colors hover:bg-white/10">
              <EditableText contentKey="about_cta_secondary" value="Contact Corporate Office" tag="span" inline />
            </Link>
          </div>
        </div>
      </motion.section>
    </AnimatedPage>
  );
};

