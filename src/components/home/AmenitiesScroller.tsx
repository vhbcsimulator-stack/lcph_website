import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import type { Amenity } from '../../types';
import { AmenityCard } from '../cards/AmenityCard';
import { fadeInUp, staggerContainer } from '../../utils/animations';

/** How the focused card compares to its neighbours: full size and opacity versus shrunk and dimmed. */
const FOCUS_SCALE = 1;
const RESTING_SCALE = 0.84;
const RESTING_OPACITY = 0.38;
/** Neighbour reach, in card widths — 1 means a card is fully rested when the next one is centred. */
const FALLOFF = 1.05;

/**
 * Card sizing, declared once on the track as custom properties.
 *
 * --card-vw is the width we would like at each breakpoint. --card-w takes that but caps it by the
 * height left over once the heading and padding are accounted for (a card is roughly its width
 * × 0.625 of image plus ~215px of text), because the pinned viewport clips anything taller.
 * 260px is the floor so very short viewports still get a usable card.
 */
const CARD_VARS = [
  '[--card-vw:80vw] sm:[--card-vw:62vw] md:[--card-vw:48vw] lg:[--card-vw:40vw] xl:[--card-vw:34vw]',
  '[--card-w:max(260px,min(var(--card-vw),calc((100svh_-_500px)_*_1.6)))]',
].join(' ');

/** Half the leftover viewport, so the first and last cards can still reach the centre. */
const EDGE_SPACER = 'w-[calc((100vw_-_var(--card-w))_/_2)]';

interface FocusCardProps {
  amenity: Amenity;
  /** The pinned section's 0→1 scroll progress, shared by every card. */
  progress: MotionValue<number>;
  /** Total horizontal travel; the divisor that turns pixel positions into progress values. */
  distance: number;
}

/**
 * One card in the horizontal track. It grows to full size and full opacity as it reaches the
 * middle of the screen and settles back down as it leaves, so attention lands on one card at a
 * time. The card measures its own layout position, so this holds for any card width or count.
 */
const FocusCard: React.FC<FocusCardProps> = ({ amenity, progress, distance }) => {
  const ref = useRef<HTMLDivElement>(null);
  /** Progress value at which this card sits dead centre, and how far either side the effect runs. */
  const [focus, setFocus] = useState<{ at: number; reach: number } | null>(null);

  useEffect(() => {
    const measure = () => {
      const el = ref.current;
      if (!el || distance <= 0) {
        setFocus(null);
        return;
      }
      // offsetLeft is a layout position, so the track's transform doesn't distort it.
      const centre = el.offsetLeft + el.offsetWidth / 2;
      setFocus({
        at: (centre - window.innerWidth / 2) / distance,
        reach: (el.offsetWidth * FALLOFF) / distance,
      });
    };

    measure();
    const observer = new ResizeObserver(measure);
    if (ref.current) observer.observe(ref.current);
    window.addEventListener('resize', measure);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [distance]);

  // Before measuring, the ranges are inert (a flat 0→1) so the card renders at rest, not mid-effect.
  const range = focus ? [focus.at - focus.reach, focus.at, focus.at + focus.reach] : [0, 0.5, 1];
  const scale = useTransform(progress, range, focus ? [RESTING_SCALE, FOCUS_SCALE, RESTING_SCALE] : [1, 1, 1]);
  const opacity = useTransform(progress, range, focus ? [RESTING_OPACITY, 1, RESTING_OPACITY] : [1, 1, 1]);
  const y = useTransform(progress, range, focus ? [24, 0, 24] : [0, 0, 0]);

  return (
    <motion.div
      ref={ref}
      style={{ scale, opacity, y }}
      className="w-[var(--card-w)] shrink-0 will-change-transform"
    >
      <AmenityCard amenity={amenity} />
    </motion.div>
  );
};

interface AmenitiesScrollerProps {
  amenities: Amenity[];
  /** Eyebrow + heading + description block, kept above the cards and pinned with them. */
  header: React.ReactNode;
}

/**
 * Amenities section with a scroll-driven horizontal pass: the section pins to the viewport and
 * vertical scrolling is translated into sideways movement, then releases back to normal
 * scrolling once the last card is reached.
 *
 * The pinned height is `100svh + distance`, so one pixel of page scroll is one pixel of travel —
 * the effect never feels faster or slower than the wheel. Small viewport units keep the pin
 * stable while a mobile URL bar collapses.
 *
 * Reduced-motion users get a plain swipe rail instead; hijacking the scroll direction is exactly
 * the kind of movement that setting asks us not to do.
 */
export const AmenitiesScroller: React.FC<AmenitiesScrollerProps> = ({ amenities, header }) => {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  /** How far the track has to travel left before the last card is fully on screen. */
  const [distance, setDistance] = useState(0);

  const pinned = !prefersReducedMotion;
  const cards = amenities.slice(0, 8);

  useEffect(() => {
    if (!pinned) {
      setDistance(0);
      return;
    }

    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      setDistance(Math.max(0, track.scrollWidth - window.innerWidth));
    };

    measure();
    // Card widths are viewport-relative and fonts/images settle after first paint, so re-measure.
    const observer = new ResizeObserver(measure);
    if (trackRef.current) observer.observe(trackRef.current);
    window.addEventListener('resize', measure);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [pinned, cards.length]);

  // 0 when the section locks to the top of the viewport, 1 when its bottom is reached.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);

  if (!pinned) {
    return (
      <section className="py-16">
        <div className="w-full max-w-[1280px] mx-auto space-y-10 px-margin-mobile md:px-margin-desktop">
          {header}

          {/* data-lenis-prevent-wheel keeps smooth scroll from swallowing sideways gestures. */}
          <motion.div
            variants={staggerContainer(0.08, 0.1)}
            data-lenis-prevent-wheel
            tabIndex={0}
            role="region"
            aria-label="Amenities"
            className="-mx-margin-mobile flex snap-x snap-mandatory gap-gutter overflow-x-auto px-margin-mobile pb-4 pt-2 md:-mx-margin-desktop md:px-margin-desktop [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {cards.map((amenity) => (
              <div key={amenity.id} className="w-[280px] shrink-0 snap-start sm:w-[320px] lg:w-[360px]">
                <AmenityCard amenity={amenity} />
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="relative" style={{ height: `calc(100svh + ${distance}px)` }}>
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center gap-8 overflow-hidden py-12 md:gap-10 md:py-16">
        <motion.div
          variants={fadeInUp(0.6)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          className="w-full max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop"
        >
          {header}
        </motion.div>

        <motion.div
          ref={trackRef}
          style={{ x }}
          className={`flex w-max items-center gap-gutter will-change-transform ${CARD_VARS}`}
        >
          {/* Card widths are viewport-relative on purpose: with only a handful of amenities,
              fixed pixel widths let the whole track fit on a wide screen — leaving a measured
              travel distance of 0, i.e. a pinned section where nothing moves. */}
          <div aria-hidden className={`${EDGE_SPACER} shrink-0`} />
          {cards.map((amenity) => (
            <FocusCard key={amenity.id} amenity={amenity} progress={scrollYProgress} distance={distance} />
          ))}
          <div aria-hidden className={`${EDGE_SPACER} shrink-0`} />
        </motion.div>
      </div>
    </section>
  );
};

export default AmenitiesScroller;
