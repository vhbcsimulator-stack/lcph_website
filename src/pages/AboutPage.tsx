import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { EditableText } from '../components/admin/EditableText';
import { EditableImage } from '../components/admin/EditableImage';
import { AnimatedPage } from '../components/layout/AnimatedPage';
import { fadeInUp, fadeInLeft, fadeInRight, staggerContainer, scaleUp } from '../utils/animations';

export const AboutPage: React.FC = () => {
  const { scrollY } = useScroll();
  const yAboutBg = useTransform(scrollY, [0, 350], [0, 70]);

  return (
    <AnimatedPage className="space-y-xl py-sm overflow-hidden">
      <div className="container-custom">
        <Breadcrumbs items={[{ label: 'About Us' }]} />

        {/* Page Hero */}
        <motion.div
          variants={scaleUp(0.6)}
          initial="hidden"
          animate="visible"
          className="mt-4 relative w-full h-[350px] flex items-center justify-center rounded-xl overflow-hidden shadow-sm"
        >
          {/* Background Image Overlay with Parallax */}
          <motion.div style={{ y: yAboutBg }} className="absolute inset-0 h-[120%] -top-[10%]">
            <EditableImage contentKey="about_hero_image" value="">
              {(src) => (
                <img
                  src={src}
                  alt="Lakeshore Estate landscape"
                  className="w-full h-full object-cover"
                />
              )}
            </EditableImage>
            <div className="absolute inset-0 bg-black/40"></div>
          </motion.div>
          <motion.div
            variants={staggerContainer(0.12, 0.15)}
            className="relative z-10 text-center px-margin-desktop text-white w-full max-w-[672px] mx-auto"
          >
            <motion.div variants={fadeInUp(0.4)}>
              <EditableText
                contentKey="about_hero_title"
                className="font-headline-xl text-headline-xl-mobile md:text-headline-xl mb-md font-bold text-white"
                tag="h1"
              />
            </motion.div>
            <motion.div variants={fadeInUp(0.4)}>
              <EditableText
                contentKey="about_hero_text"
                className="font-body-lg text-body-lg max-w-2xl mx-auto opacity-90 text-white"
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
        viewport={{ once: true, margin: "-80px" }}
        className="max-w-[1280px] mx-auto px-margin-desktop"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-xl items-center">
          <motion.div variants={fadeInLeft(0.6)} className="space-y-md">
            <EditableText
              contentKey="about_story_title"
              className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-md font-bold"
              tag="h2"
            />
            <EditableText
              contentKey="about_story_p1"
              className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed"
              tag="p"
              multiline={true}
            />
            <EditableText
              contentKey="about_story_p2"
              className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed"
              tag="p"
              multiline={true}
            />
          </motion.div>

          <motion.div variants={fadeInRight(0.6)} className="relative rounded-xl overflow-hidden h-[400px] shadow-md">
            <EditableImage contentKey="about_story_image" value="">
              {(src) => (
                <img
                  src={src}
                  alt="Lakeshore modern clubhouse in forest"
                  className="w-full h-full object-cover"
                />
              )}
            </EditableImage>
          </motion.div>
        </div>
      </motion.section>

      {/* Mission, Vision, Values (Bento Grid Style) */}
      <motion.section
        variants={fadeInUp(0.6)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="py-xl bg-surface-container-lowest px-margin-desktop"
      >
        <div className="max-w-[1280px] mx-auto space-y-md">
          <div className="text-center mb-xl">
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">Core Principles</h2>
          </div>
          <motion.div
            variants={staggerContainer(0.1, 0.1)}
            className="grid grid-cols-1 md:grid-cols-3 gap-gutter"
          >
            {/* Mission */}
            <motion.div variants={scaleUp(0.4)} className="bg-surface rounded-xl p-md border border-outline-variant/30 shadow-sm flex flex-col items-start">
              <div className="bg-primary-container text-on-primary-container p-sm rounded-lg mb-md font-bold">
                M
              </div>
              <h3 className="font-headline-md text-headline-md text-primary mb-sm font-bold">Our Mission</h3>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                To develop exceptional, nature-integrated properties that elevate the standard of living while preserving the ecological heritage of the land.
              </p>
            </motion.div>
            {/* Vision */}
            <motion.div variants={scaleUp(0.4)} className="bg-surface rounded-xl p-md border border-outline-variant/30 shadow-sm flex flex-col items-start">
              <div className="bg-primary-container text-on-primary-container p-sm rounded-lg mb-md font-bold">
                V
              </div>
              <h3 className="font-headline-md text-headline-md text-primary mb-sm font-bold">Our Vision</h3>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                To be the premier developer recognized for creating timeless, sustainable communities that define premium heritage living.
              </p>
            </motion.div>
            {/* Values */}
            <motion.div variants={scaleUp(0.4)} className="bg-surface rounded-xl p-md border border-outline-variant/30 shadow-sm flex flex-col items-start">
              <div className="bg-primary-container text-on-primary-container p-sm rounded-lg mb-md font-bold">
                ★
              </div>
              <h3 className="font-headline-md text-headline-md text-primary mb-sm font-bold">Our Values</h3>
              <ul className="font-body-md text-body-md text-on-surface-variant space-y-2 w-full">
                <li className="flex items-center gap-2">✓ Sustainability First</li>
                <li className="flex items-center gap-2">✓ Architectural Excellence</li>
                <li className="flex items-center gap-2">✓ Community Focus</li>
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
        viewport={{ once: true, margin: "-80px" }}
        className="bg-surface-container-low py-12 border-y border-outline-variant/20 text-center"
      >
        <div className="container-custom max-w-2xl space-y-4">
          <h2 className="font-headline-lg text-primary">Partner or Build Your Dream Home with LCPH</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">Discover our active project sites.</p>
          <div className="pt-2 flex justify-center gap-4">
            <Link to="/projects" className="px-6 py-3 rounded bg-primary text-on-primary font-label-lg text-label-lg">
              Browse Projects
            </Link>
            <Link to="/contact" className="px-6 py-3 rounded border border-primary text-primary font-label-lg text-label-lg hover:bg-surface-container-low">
              Contact Corporate Office
            </Link>
          </div>
        </div>
      </motion.section>
    </AnimatedPage>
  );
};

