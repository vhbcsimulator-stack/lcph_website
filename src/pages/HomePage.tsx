import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar, ArrowRight, MapPin,
  CheckCircle2, Phone, Mail, HelpCircle
} from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { faqsData } from '../data/faqsData';
import { ProjectCard } from '../components/cards/ProjectCard';
import { AmenityCard } from '../components/cards/AmenityCard';
import { UpdateCard } from '../components/cards/UpdateCard';
import { useAdmin } from '../context/AdminContext';
import { EditableText } from '../components/admin/EditableText';
import { EditableImage } from '../components/admin/EditableImage';
import { AnimatedPage } from '../components/layout/AnimatedPage';
import { fadeInUp, fadeInLeft, fadeInRight, staggerContainer, scaleUp } from '../utils/animations';

export const HomePage: React.FC = () => {
  const { projects, amenities, updates } = useAdmin();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const { scrollY } = useScroll();
  const yBg = useTransform(scrollY, [0, 700], [0, 100]);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <AnimatedPage className="space-y-xl overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative w-full h-[600px] lg:h-[700px] flex items-center justify-center bg-surface-variant overflow-hidden">
        {/* Background Image Overlay with Parallax */}
        <motion.div style={{ y: yBg }} className="absolute inset-0 z-0 h-[120%] -top-[10%]">
          <EditableImage
            contentKey="home_hero_image"
            value="/src/assets/herolcn.jpeg"
            overlayClassName="p-6 pt-24 flex items-start justify-end"
          >
            {(src) => (
              <div className="relative w-full h-full">
                <img
                  src={src}
                  alt="Lakeshore Central Aerial View"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  className="w-full h-full object-cover opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-on-background/85 to-transparent pointer-events-none" />
              </div>
            )}
          </EditableImage>
        </motion.div>

        <div className="w-full max-w-[1280px] mx-auto px-margin-desktop md:px-margin-desktop relative z-10 flex flex-col justify-center h-full pointer-events-none">
          <motion.div 
            variants={staggerContainer(0.12, 0.1)}
            initial="hidden"
            animate="visible"
            className="max-w-[672px] text-on-primary pointer-events-auto"
          >
            <motion.div variants={fadeInUp(0.5)}>
              <EditableText
                contentKey="home_hero_tagline"
                className="font-label-lg text-label-lg uppercase tracking-wider text-primary-fixed mb-4 block"
                tag="span"
              />
            </motion.div>

            <motion.div variants={fadeInUp(0.5)}>
              <EditableText
                contentKey="home_hero_title"
                className="font-headline-xl-mobile md:font-headline-xl text-headline-xl-mobile md:text-headline-xl text-white mb-sm leading-tight"
                tag="h1"
              />
            </motion.div>

            <motion.p variants={fadeInUp(0.5)} className="font-body-lg text-body-lg text-white/90 mb-lg">
              Experience the perfect blend of nature, comfort, and investment potential in the heart of the Philippines.
            </motion.p>

            {/* Hero CTAs */}
            <motion.div variants={fadeInUp(0.5)} className="flex flex-wrap gap-sm">
              <Link
                to="/projects"
                className="bg-primary text-on-primary font-label-lg text-label-lg px-8 py-4 rounded hover:bg-primary-container transition-colors shadow-md inline-flex items-center gap-2"
              >
                <span>Explore Projects</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/schedule-site-visit"
                className="bg-transparent border border-white text-white font-label-lg text-label-lg px-8 py-4 rounded hover:bg-white/10 transition-colors inline-flex items-center gap-2"
              >
                <Calendar className="w-4 h-4 text-primary-fixed" />
                <span>Schedule a Site Visit</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 3. LCPH INTRODUCTION */}
      <motion.section 
        variants={fadeInUp(0.6)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="w-full max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-xl text-center"
      >
        <EditableText
          contentKey="home_intro_badge"
          className="text-tertiary font-label-lg text-[12px] uppercase tracking-wider block mb-1"
          tag="span"
        />
        <EditableText
          contentKey="home_intro_title"
          className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-md font-bold"
          tag="h2"
        />
        <EditableText
          contentKey="home_intro_text"
          className="font-body-lg text-body-lg text-on-surface-variant max-w-[768px] mx-auto leading-relaxed"
          tag="p"
          multiline={true}
        />
      </motion.section>

      {/* 4. FEATURED FLAGSHIP SPOTLIGHT */}
      <motion.section 
        variants={fadeInUp(0.6)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="w-full max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop pb-xl"
      >
        <div className="flex flex-col lg:flex-row gap-lg rounded-xl overflow-hidden bg-surface-container-lowest border border-outline-variant/20 soft-shadow">
          <motion.div variants={fadeInLeft(0.6)} className="lg:w-3/5 h-[400px] lg:h-auto relative overflow-hidden">
            <EditableImage contentKey="home_spotlight_image" value="/src/assets/masterplan.jpg">
              {(src) => (
                <img
                  src={src}
                  alt="Lakeshore Community North Aerial View"
                  className="w-full h-full object-cover hover:scale-102 transition-transform duration-500"
                />
              )}
            </EditableImage>
            <div className="absolute top-4 left-4 bg-primary-container text-on-primary-container font-label-lg text-label-lg px-3 py-1 rounded shadow-sm font-bold pointer-events-none">
              Pre-selling
            </div>
          </motion.div>
          
          <motion.div variants={fadeInRight(0.6)} className="lg:w-2/5 p-lg flex flex-col justify-center">
            <div className="flex gap-2 mb-4">
              <span className="bg-surface-container text-on-surface-variant font-label-lg text-[12px] px-2 py-1 rounded font-bold">Residential</span>
              <span className="bg-surface-container text-on-surface-variant font-label-lg text-[12px] px-2 py-1 rounded font-bold">Commercial</span>
            </div>
            
            <EditableText
              contentKey="home_spotlight_title"
              className="font-headline-md text-headline-md text-on-surface mb-2 font-bold"
              tag="h3"
            />
            
            <p className="flex items-center text-on-surface-variant font-body-md text-body-md mb-md gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <EditableText
                contentKey="home_spotlight_location"
                className="font-semibold"
                tag="span"
              />
            </p>
            
            <EditableText
              contentKey="home_spotlight_description"
              className="font-body-md text-body-md text-on-surface-variant mb-lg line-clamp-4"
              tag="p"
              multiline={true}
            />
            
            <ul className="space-y-2 mb-lg">
              <li className="flex items-center gap-2 text-on-surface-variant font-body-md">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span>300 - 800 sqm Lot Sizes</span>
              </li>
              <li className="flex items-center gap-2 text-on-surface-variant font-body-md">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span>Clubhouse & Infinity Lakeside Pool</span>
              </li>
              <li className="flex items-center gap-2 text-on-surface-variant font-body-md">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span>24/7 Premium Security</span>
              </li>
            </ul>
            <Link
              to="/projects/lakeshore-community-north"
              className="self-start border border-tertiary-container text-tertiary font-label-lg text-label-lg px-6 py-3 rounded hover:bg-tertiary-container hover:text-on-tertiary-container transition-colors font-bold"
            >
              Explore Project
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* 5. ALL PROJECTS GRID */}
      <motion.section 
        variants={fadeInUp(0.6)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="bg-surface-container-low py-16 border-y border-outline-variant/20"
      >
        <div className="w-full max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary font-label-lg">Flagship Townships</span>
              <h2 className="font-headline-lg text-on-background mt-1">Featured Master Developments</h2>
            </div>
            <Link to="/projects" className="inline-flex items-center gap-2 text-sm font-bold font-heading text-primary hover:underline">
              <span>View All Projects</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <motion.div 
            variants={staggerContainer(0.1, 0.1)}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter"
          >
            {projects.slice(0, 3).map(project => (
              <motion.div key={project.id} variants={scaleUp(0.4)}>
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
        viewport={{ once: true, margin: "-80px" }}
        className="bg-primary text-on-primary py-16"
      >
        <div className="w-full max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop space-y-10">
          <div className="text-center max-w-[672px] mx-auto space-y-3">
            <EditableText
              contentKey="home_amenities_badge"
              className="text-xs font-bold uppercase tracking-wider text-on-primary-container font-label-lg"
              tag="span"
            />
            <EditableText
              contentKey="home_amenities_title"
              className="font-headline-lg text-white font-bold"
              tag="h2"
            />
            <EditableText
              contentKey="home_amenities_description"
              className="text-slate-300 font-body-sm text-body-sm"
              tag="p"
            />
          </div>

          <motion.div 
            variants={staggerContainer(0.08, 0.1)}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter"
          >
            {amenities.slice(0, 4).map(amenity => (
              <motion.div key={amenity.id} variants={scaleUp(0.4)}>
                <AmenityCard amenity={amenity} />
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center pt-4">
            <Link
              to="/amenities"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-surface-container-lowest text-primary font-heading font-bold text-sm hover:bg-surface-container-low transition-all"
            >
              <span>Explore All Amenities</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </motion.section>

      {/* 8. DEVELOPMENT PROGRESS UPDATES */}
      <motion.section 
        variants={fadeInUp(0.6)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="w-full max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop space-y-10 py-8"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <EditableText
              contentKey="home_updates_badge"
              value="Site Engineering"
              className="text-xs font-bold uppercase tracking-wider text-primary font-label-lg block"
              tag="span"
            />
            <EditableText
              contentKey="home_updates_title"
              value="Recent Construction Progress"
              className="font-headline-lg text-on-background mt-1 block"
              tag="h2"
            />
          </div>
          <Link to="/updates" className="inline-flex items-center gap-2 text-sm font-bold font-heading text-primary hover:underline">
            <span>All Progress Reports</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <motion.div 
          variants={staggerContainer(0.12, 0.1)}
          className="grid grid-cols-1 md:grid-cols-2 gap-gutter"
        >
          {updates.slice(0, 2).map(update => (
            <motion.div key={update.id} variants={fadeInUp(0.4)}>
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
        viewport={{ once: true, margin: "-80px" }}
        className="w-full max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop space-y-8 py-8"
      >
        <div className="text-center max-w-[672px] mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-primary font-label-lg">Buyer Guidance</span>
          <h2 className="font-headline-lg text-on-background">Frequently Asked Questions</h2>
        </div>

        <motion.div 
          variants={staggerContainer(0.08, 0.1)}
          className="max-w-[768px] mx-auto space-y-4"
        >
          {faqsData.map(faq => (
            <motion.div 
              key={faq.id} 
              variants={fadeInUp(0.4)}
              className="p-5 rounded-xl bg-surface-container-lowest border border-outline-variant/20 shadow-sm space-y-2"
            >
              <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2 font-bold">
                <HelpCircle className="w-5 h-5 text-primary shrink-0" />
                <span>{faq.question}</span>
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant pl-7 leading-relaxed">
                {faq.answer}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center pt-2">
          <Link to="/faqs" className="text-sm font-bold font-heading text-primary hover:underline">
            View All Frequently Asked Questions →
          </Link>
        </div>
      </motion.section>

      {/* 11. INQUIRY & CONTACT FORM SECTION */}
      <motion.section 
        variants={fadeInUp(0.6)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="bg-primary text-on-primary py-16"
      >
        <div className="w-full max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg items-center">
            <motion.div variants={fadeInLeft(0.6)} className="space-y-6">
              <EditableText
                contentKey="home_contact_badge"
                value="Get in Touch"
                className="text-xs font-bold uppercase tracking-wider text-on-primary-container font-label-lg block"
                tag="span"
              />
              <EditableText
                contentKey="home_contact_title"
                value="Reserve Your Lakeside Legacy Lot Today."
                className="font-headline-lg text-white block"
                tag="h2"
              />
              <EditableText
                contentKey="home_contact_desc"
                value="Connect with our certified property specialists for custom sample computations, site tour arrangements, or master plan inquiries."
                className="text-slate-200 font-body-md text-body-md leading-relaxed block"
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

            <motion.div variants={fadeInRight(0.6)} className="bg-surface-container-lowest text-on-surface p-8 rounded-2xl shadow-2xl border border-outline-variant/15">
              <h3 className="font-headline-md text-headline-md text-on-surface mb-4">Send a Direct Inquiry</h3>

              {formSubmitted ? (
                <div className="p-6 bg-primary-container text-on-primary-container rounded-xl text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 mx-auto" />
                  <h4 className="font-headline-sm text-headline-sm font-bold">Thank You for Reaching Out!</h4>
                  <p className="font-body-sm text-body-sm opacity-90">
                    Your inquiry has been logged. An LCPH Property Specialist will reach out to you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-on-surface-variant mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Maria Santos"
                      className="w-full px-3.5 py-2.5 rounded border border-outline-variant bg-surface text-body-md focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-on-surface-variant mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="maria@example.com"
                        className="w-full px-3.5 py-2.5 rounded border border-outline-variant bg-surface text-body-md focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-on-surface-variant mb-1">Mobile Number</label>
                      <input
                        type="tel"
                        required
                        placeholder="+63 917 000 0000"
                        className="w-full px-3.5 py-2.5 rounded border border-outline-variant bg-surface text-body-md focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-on-surface-variant mb-1">Preferred Project</label>
                    <select className="w-full px-3.5 py-2.5 rounded border border-outline-variant bg-surface text-body-md focus:ring-1 focus:ring-primary focus:border-primary outline-none text-on-background">
                      {projects.map(proj => (
                        <option key={proj.id} value={proj.slug}>
                          {proj.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-on-surface-variant mb-1">Message</label>
                    <textarea
                      rows={3}
                      placeholder="Tell us about your lot requirements or scheduled visit preference..."
                      className="w-full px-3.5 py-2.5 rounded border border-outline-variant bg-surface text-body-md focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-primary hover:bg-primary-container text-on-primary hover:text-on-primary-container font-label-lg text-label-lg transition-colors flex items-center justify-center gap-2 shadow-md rounded cursor-pointer"
                  >
                    <span>Send Inquiry</span>
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

