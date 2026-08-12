import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { useAdmin } from '../context/AdminContext';
import { EditableText } from '../components/admin/EditableText';
import { EditableRichText } from '../components/admin/EditableRichText';
import { EditableImage } from '../components/admin/EditableImage';
import {
  ArrowRight,
  Award,
  BadgeCheck,
  Briefcase,
  Building2,
  CheckCircle,
  FileText,
  Gem,
  Handshake,
  HardHat,
  Landmark,
  Mail,
  Package,
  Phone,
  Plus,
  ShieldCheck,
  Store,
  Trash2,
  TrendingUp,
  Truck,
  Users,
  Wrench,
} from 'lucide-react';

/** Small green eyebrow label above a section heading â€” matches the homepage treatment. */
const EYEBROW = 'font-label-lg text-[12px] font-bold uppercase tracking-[0.18em] text-primary';

/** Field label shared by every input on the application form. */
const FIELD_LABEL = 'mb-1.5 block font-label-lg text-label-lg font-bold uppercase tracking-wide text-on-surface-variant';

/** Input, select and textarea share one shell so the form reads as a single control set. */
const FIELD =
  'w-full rounded border border-outline-variant bg-surface px-3.5 py-2.5 text-body-md outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary';

/**
 * Icons an admin can pick for a partnership track. Only these are offered, so a stored icon name
 * always resolves to a real component â€” 'none' renders the card without an icon badge.
 */
const TRACK_ICONS = {
  BadgeCheck,
  Users,
  Package,
  HardHat,
  Handshake,
  ShieldCheck,
  Briefcase,
  Building2,
  Landmark,
  Store,
  Truck,
  Wrench,
  Gem,
  TrendingUp,
  Award,
} as const;

type TrackIconName = keyof typeof TRACK_ICONS | 'none';

const ICON_OPTIONS: TrackIconName[] = ['none', ...(Object.keys(TRACK_ICONS) as (keyof typeof TRACK_ICONS)[])];

interface PartnerTrack {
  id: string;
  icon: TrackIconName;
  title: string;
  desc: string;
}

/**
 * Tracks used until an admin saves their own. The picker cards and the form's category dropdown
 * both render from the same list, so the two can never drift apart.
 */
const DEFAULT_TRACKS: PartnerTrack[] = [
  {
    id: 'broker',
    icon: 'BadgeCheck',
    title: 'Licensed Broker',
    desc: 'PRC-licensed brokers accrediting their own sales organisation.',
  },
  {
    id: 'agent',
    icon: 'Users',
    title: 'Sales Agent',
    desc: 'Individual agents selling under an accredited broker.',
  },
  {
    id: 'supplier',
    icon: 'Package',
    title: 'Supplier',
    desc: 'Material providers serving our township build-out.',
  },
  {
    id: 'contractor',
    icon: 'HardHat',
    title: 'Civil Contractor',
    desc: 'Earthworks, roads and utilities contractors.',
  },
];

/** page_content keys holding the JSON arrays. Absent until an admin adds or removes an entry. */
const TRACKS_KEY = 'partner_tracks_json';
const BENEFITS_KEY = 'partner_benefits_json';

/** Stored as a JSON string so no schema change is needed. */
const parseTracks = (raw: string | undefined): PartnerTrack[] => {
  if (!raw) return DEFAULT_TRACKS;
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return DEFAULT_TRACKS;
    return parsed
      .filter((t) => t && typeof t === 'object')
      .map((t, i) => ({
        id: String(t.id ?? `track-${i}`),
        icon: (t.icon in TRACK_ICONS ? t.icon : 'none') as TrackIconName,
        title: String(t.title ?? ''),
        desc: String(t.desc ?? ''),
      }));
  } catch {
    return DEFAULT_TRACKS;
  }
};

const parseBenefits = (raw: string | undefined, fallback: string[]): string[] => {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(String) : fallback;
  } catch {
    return fallback;
  }
};

/** The three stages an application moves through, shown as a vertical timeline. */
const PARTNER_STEPS = [
  {
    icon: FileText,
    titleKey: 'partner_step1_title',
    title: 'Submit Your Application',
    descKey: 'partner_step1_desc',
    desc: 'Send the form with your licence or registration details.',
  },
  {
    icon: ShieldCheck,
    titleKey: 'partner_step2_title',
    title: 'Document Verification',
    descKey: 'partner_step2_desc',
    desc: 'Our Broker Network Relations desk reviews your credentials.',
  },
  {
    icon: Handshake,
    titleKey: 'partner_step3_title',
    title: 'Accreditation & Onboarding',
    descKey: 'partner_step3_desc',
    desc: 'Receive your terms, sales kit and a dedicated relations officer.',
  },
];

const BENEFIT_KEYS = ['partner_benefit1', 'partner_benefit2', 'partner_benefit3'];

/**
 * Input placeholders and <option> labels can't host an EditableText field, so they read from
 * page content directly â€” that keeps them editable from the admin like everything else on the page.
 */
const PLACEHOLDERS = [
  { key: 'partner_placeholder_name', value: 'e.g. Juan Dela Cruz / Apex Realty' },
  { key: 'partner_placeholder_license', value: 'PRC Reg. No.' },
  { key: 'partner_placeholder_email', value: 'broker@agency.com' },
  { key: 'partner_placeholder_mobile', value: '+63 917 000 0000' },
] as const;

export const PartnerPage: React.FC = () => {
  const { isAdmin, pageContent, updateText } = useAdmin();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [category, setCategory] = useState<string>(DEFAULT_TRACKS[0].id);
  const formRef = useRef<HTMLDivElement>(null);

  const copy = (key: string, _fallback: string) => pageContent[key] ?? '';
  const placeholder = (index: number) => copy(PLACEHOLDERS[index].key, PLACEHOLDERS[index].value);

  const tracks = parseTracks(pageContent[TRACKS_KEY]);

  /**
   * Benefits start from the original three single-key fields, so any copy an admin already edited
   * there carries over. The JSON key takes over once they add or remove an entry.
   */
  const benefits = parseBenefits(
    pageContent[BENEFITS_KEY],
    BENEFIT_KEYS.map((key) => pageContent[key] ?? '').filter(Boolean),
  );

  /** A removed track must not leave the form pointing at a category that no longer exists. */
  const activeCategory = tracks.some((t) => t.id === category) ? category : (tracks[0]?.id ?? '');

  const writeTracks = (next: PartnerTrack[]) => updateText(TRACKS_KEY, JSON.stringify(next));
  const writeBenefits = (next: string[]) => updateText(BENEFITS_KEY, JSON.stringify(next));

  const patchTrack = (index: number, changes: Partial<PartnerTrack>) =>
    writeTracks(tracks.map((track, i) => (i === index ? { ...track, ...changes } : track)));

  const addTrack = () =>
    writeTracks([
      ...tracks,
      { id: `track-${Date.now()}`, icon: 'Handshake', title: 'New Track', desc: 'Describe this partnership track.' },
    ]);

  const removeTrack = (index: number) => {
    if (!window.confirm(`Remove the "${tracks[index].title}" track?`)) return;
    writeTracks(tracks.filter((_, i) => i !== index));
  };

  const addBenefit = () => writeBenefits([...benefits, 'New benefit']);

  const removeBenefit = (index: number) => {
    if (!window.confirm('Remove this benefit?')) return;
    writeBenefits(benefits.filter((_, i) => i !== index));
  };

  const setBenefit = (index: number, text: string) =>
    writeBenefits(benefits.map((b, i) => (i === index ? text : b)));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  /** Picking a card pre-fills the dropdown, so the choice carries into the form. */
  const handleCategoryPick = (value: string) => {
    setCategory(value);
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div data-page-motion="custom" className="simple-page-enter space-y-xl py-sm">
      <div className="container-custom space-y-lg">
        <Breadcrumbs items={[{ label: 'Partner With Us' }]} />

        {/* Hero band â€” mirrors the dark photo-and-gradient treatment used on the homepage */}
        <section className="relative isolate overflow-hidden rounded-2xl bg-surface-variant shadow-md">
          <div className="absolute inset-0 z-0">
            <EditableImage
              contentKey="partner_hero_image"
              value="/src/assets/lcngate.png"
              overlayClassName="p-6 flex items-start justify-end"
            >
              {(src) => (
                <div className="relative h-full w-full">
                  <img
                    src={src}
                    alt="Lakeshore Community North entrance gate"
                    loading="eager"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-slate-950/95 from-10% via-slate-900/80 via-45% to-slate-900/30 to-95%" />
                </div>
              )}
            </EditableImage>
          </div>

          {/* z-40 keeps the copy above the image's admin hover overlay */}
          <div className="relative z-40 max-w-[720px] space-y-4 p-8 md:p-12 lg:py-16">
            <EditableText
              contentKey="partner_eyebrow"
              value="Partner Program"
              className="block font-label-lg text-[12px] font-bold uppercase tracking-[0.18em] text-primary-fixed"
              tag="span"
            />
            <EditableText
              contentKey="partner_title"
              tag="h1"
              className="block font-headline-xl-mobile md:font-headline-xl text-headline-xl-mobile md:text-headline-xl font-bold text-white"
            />
            <EditableRichText
              contentKey="partner_subtitle"
              className="block max-w-2xl font-body-lg text-body-lg leading-relaxed text-white/85"
              compact
            />

            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap">
              <button
                type="button"
                onClick={() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className="home-cta inline-flex min-h-12 items-center justify-center gap-2 rounded bg-primary px-6 py-3.5 font-label-lg text-[12px] uppercase tracking-wider text-on-primary shadow-md hover:bg-primary-container sm:px-8"
              >
                <EditableText contentKey="partner_cta_primary" value="Apply for Accreditation" tag="span" inline />
                <ArrowRight className="w-4 h-4" />
              </button>
              <Link
                to="/contact"
                className="home-cta inline-flex min-h-12 items-center justify-center gap-2 rounded border border-white/70 px-6 py-3.5 font-label-lg text-[12px] uppercase tracking-wider text-white hover:border-white hover:bg-white/10 sm:px-8"
              >
                <EditableText contentKey="partner_cta_secondary" value="Talk to Broker Relations" tag="span" inline />
              </Link>
            </div>
          </div>
        </section>

      </div>

      {/* Partnership categories â€” double as a picker for the form's category field */}
      <div className="section-band section-grid">
        <div className="container-custom">
        <section className="space-y-6">
          <div className="space-y-1">
            <EditableText
              contentKey="partner_categories_badge"
              value="Who We Partner With"
              className={`block ${EYEBROW}`}
              tag="span"
            />
            <EditableText
              contentKey="partner_categories_title"
              value="Choose Your Partnership Track"
              className="block font-headline-sm text-headline-sm font-bold text-on-surface"
              tag="h2"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {tracks.map((track, index) => {
              const Icon = track.icon === 'none' ? null : TRACK_ICONS[track.icon];
              const isSelected = activeCategory === track.id;
              return (
                /*
                 * A div rather than a button: admins get their own controls inside the card, and a
                 * button cannot legally contain them. Keyboard support is wired up by hand instead.
                 */
                <div
                  key={track.id}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  onClick={() => handleCategoryPick(track.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleCategoryPick(track.id);
                    }
                  }}
                  className={`interactive-card group/track relative flex h-full cursor-pointer flex-col items-start gap-3 rounded-xl border p-5 text-left shadow-sm ${
                    isSelected
                      ? 'border-primary bg-primary-container/40 ring-1 ring-primary'
                      : 'border-outline-variant/20 bg-surface-container-lowest'
                  }`}
                >
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeTrack(index);
                      }}
                      title="Remove track"
                      className="absolute right-2 top-2 cursor-pointer rounded-lg p-1.5 text-red-500 opacity-0 transition-opacity hover:bg-red-500/10 group-hover/track:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}

                  {Icon && (
                    <span
                      className={`interactive-icon flex h-11 w-11 items-center justify-center rounded-lg ${
                        isSelected ? 'bg-primary text-on-primary' : 'bg-primary-container/50 text-primary'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </span>
                  )}

                  <EditableText
                    value={track.title}
                    onSave={(val) => patchTrack(index, { title: val })}
                    className="block font-headline-sm text-body-lg font-bold text-on-surface"
                    tag="h3"
                  />
                  <EditableRichText
                    value={track.desc}
                    onSave={(val) => patchTrack(index, { desc: val })}
                    className="block font-body-sm text-body-sm leading-relaxed text-on-surface-variant"
                    compact
                  />

                  {/* Icon picker â€” 'None' drops the badge entirely */}
                  {isAdmin && (
                    <label
                      className="mt-auto flex w-full items-center gap-2 pt-2 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Icon
                      <select
                        value={track.icon}
                        onChange={(e) => patchTrack(index, { icon: e.target.value as TrackIconName })}
                        className="flex-1 cursor-pointer rounded border border-outline-variant bg-surface px-2 py-1 text-[11px] font-normal normal-case tracking-normal text-on-surface outline-none focus:border-primary"
                      >
                        {ICON_OPTIONS.map((name) => (
                          <option key={name} value={name}>
                            {name === 'none' ? 'None' : name}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}
                </div>
              );
            })}

            {isAdmin && (
              <button
                type="button"
                onClick={addTrack}
                className="flex min-h-[160px] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-outline-variant/40 p-5 text-on-surface-variant transition-colors hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
              >
                <Plus className="w-6 h-6" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Add Track</span>
              </button>
            )}
          </div>
        </section>
        </div>
      </div>

      <div className="container-custom">
        <div className="grid grid-cols-1 items-start gap-gutter lg:grid-cols-3">
          {/* Application form */}
          <div ref={formRef} className="space-y-6 lg:col-span-2 lg:scroll-mt-24">
            <div className="interactive-panel space-y-6 rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-sm md:p-8">
              <div className="space-y-1 border-b border-outline-variant/25 pb-4">
                <EditableText
                  contentKey="partner_form_title"
                  tag="h2"
                  className="block font-headline-sm text-headline-sm font-bold text-on-surface"
                />
                <EditableRichText
                  contentKey="partner_form_note"
                  className="block font-body-sm text-body-sm text-on-surface-variant"
                  compact
                />
              </div>

              {formSubmitted ? (
                <div className="space-y-3 rounded-xl bg-primary-container p-8 text-center text-on-primary-container">
                  <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-on-primary-container/10">
                    <CheckCircle className="w-8 h-8" />
                  </span>
                  <EditableText
                    contentKey="partner_success_title"
                    value="Application Submitted!"
                    className="block font-headline-sm text-headline-sm font-bold"
                    tag="h3"
                  />
                  <EditableRichText
                    contentKey="partner_success_text"
                    className="block font-body-sm text-body-sm opacity-90"
                    compact
                  />
                  <button
                    type="button"
                    onClick={() => setFormSubmitted(false)}
                    className="inline-flex cursor-pointer items-center gap-2 pt-2 font-label-lg text-label-lg font-bold uppercase tracking-wider underline underline-offset-4"
                  >
                    <EditableText
                      contentKey="partner_success_reset"
                      value="Submit Another Application"
                      tag="span"
                      inline
                    />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className={FIELD_LABEL}>
                        <EditableText contentKey="partner_label_name" value="Full Name / Agency" tag="span" inline />
                      </label>
                      <input type="text" required placeholder={placeholder(0)} className={FIELD} />
                    </div>
                    <div>
                      <label className={FIELD_LABEL}>
                        <EditableText
                          contentKey="partner_label_license"
                          value="PRC License / DHSUD Reg No."
                          tag="span"
                          inline
                        />
                      </label>
                      <input type="text" required placeholder={placeholder(1)} className={FIELD} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className={FIELD_LABEL}>
                        <EditableText contentKey="partner_label_email" value="Email Address" tag="span" inline />
                      </label>
                      <input type="email" required placeholder={placeholder(2)} className={FIELD} />
                    </div>
                    <div>
                      <label className={FIELD_LABEL}>
                        <EditableText contentKey="partner_label_mobile" value="Mobile Number" tag="span" inline />
                      </label>
                      <input type="tel" required placeholder={placeholder(3)} className={FIELD} />
                    </div>
                  </div>

                  <div>
                    <label className={FIELD_LABEL} htmlFor="partner-category">
                      <EditableText
                        contentKey="partner_label_category"
                        value="Partnership Category"
                        tag="span"
                        inline
                      />
                    </label>
                    <select
                      id="partner-category"
                      value={activeCategory}
                      onChange={(e) => setCategory(e.target.value)}
                      className={FIELD}
                    >
                      {tracks.map((track) => (
                        <option key={track.id} value={track.id}>
                          {track.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="home-cta inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded bg-primary px-6 py-3 font-label-lg text-label-lg text-on-primary shadow-sm hover:bg-primary-container hover:text-on-primary-container"
                  >
                    <EditableText contentKey="partner_submit" value="Submit Accreditation Request" tag="span" inline />
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </form>
              )}
            </div>

            {/* Accreditation process timeline */}
            <div className="interactive-panel rounded-xl border border-outline-variant/20 bg-surface-container-low p-6 shadow-sm md:p-8">
              <EditableText
                contentKey="partner_process_title"
                value="How Accreditation Works"
                className="mb-6 block font-headline-sm text-headline-sm font-bold text-on-surface"
                tag="h2"
              />
              <ol className="space-y-6">
                {PARTNER_STEPS.map((step, index) => {
                  const Icon = step.icon;
                  const isLast = index === PARTNER_STEPS.length - 1;
                  return (
                    <li key={step.titleKey} className="relative flex gap-4 pl-1">
                      {/* Connector line runs between the markers, so the last step drops it */}
                      {!isLast && (
                        <span
                          aria-hidden
                          className="absolute left-[27px] top-12 h-[calc(100%-1rem)] w-px bg-outline-variant/40"
                        />
                      )}
                      <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-primary/25 bg-primary-container/40 text-primary">
                        <Icon className="w-5 h-5" />
                      </span>
                      <div className="space-y-1 pt-1.5">
                        <span className="block font-label-lg text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
                          Step {index + 1}
                        </span>
                        <EditableText
                          contentKey={step.titleKey}
                          value={step.title}
                          className="block font-headline-sm text-body-lg font-bold text-on-surface"
                          tag="h3"
                        />
                        <EditableRichText
                          contentKey={step.descKey}
                          value={step.desc}
                          className="block font-body-sm text-body-sm leading-relaxed text-on-surface-variant"
                          compact
                        />
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Benefits sit on the dark primary panel used for the contact page info card */}
            <div className="section-diagonal pattern-on-dark overflow-hidden rounded-xl border border-primary-container bg-primary p-6 text-on-primary shadow-md md:p-8">
              <EditableText
                contentKey="partner_benefits_title"
                tag="h2"
                className="mb-5 block font-headline-md text-[22px] font-bold text-on-primary"
              />
              <ul className="space-y-3">
                {benefits.map((benefit, index) => (
                  <li
                    key={index}
                    className="group flex items-start gap-4 rounded-lg border border-white/10 bg-white/[0.07] p-4 backdrop-blur-sm transition-all hover:translate-x-1 hover:border-white/25 hover:bg-white/[0.12]"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10 text-primary-fixed">
                      <Award className="w-5 h-5 transition-transform group-hover:scale-110" />
                    </span>
                    <EditableText
                      value={benefit}
                      onSave={(val) => setBenefit(index, val)}
                      tag="span"
                      className="self-center font-body-sm text-body-sm leading-relaxed text-on-primary"
                    />
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => removeBenefit(index)}
                        title="Remove benefit"
                        className="shrink-0 cursor-pointer self-center rounded-lg p-1.5 text-red-200 opacity-0 transition-opacity hover:bg-red-500/20 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </li>
                ))}
              </ul>

              {isAdmin && (
                <button
                  type="button"
                  onClick={addBenefit}
                  className="mt-3 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-white/25 px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-on-primary/80 transition-colors hover:border-white/50 hover:bg-white/10 hover:text-on-primary"
                >
                  <Plus className="w-4 h-4" />
                  Add Benefit
                </button>
              )}
            </div>

            {/* Direct line to the broker desk, for anyone not ready to apply */}
            <div className="interactive-panel space-y-4 rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-sm">
              <EditableText
                contentKey="partner_help_title"
                value="Questions Before Applying?"
                className="block font-headline-sm text-body-lg font-bold text-on-surface"
                tag="h2"
              />
              <EditableRichText
                contentKey="partner_help_text"
                className="block font-body-sm text-body-sm leading-relaxed text-on-surface-variant"
                compact
              />
              <div className="space-y-2 font-body-sm text-body-sm text-on-surface-variant">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 shrink-0 text-primary" />
                  <EditableText contentKey="contact_info_phone" tag="span" />
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 shrink-0 text-primary" />
                  <EditableText contentKey="contact_info_email" tag="span" className="break-all" />
                </div>
              </div>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 font-label-lg text-[12px] font-bold uppercase tracking-wider text-primary hover:underline"
              >
                <EditableText contentKey="partner_help_cta" value="Contact the Team" tag="span" inline />
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
export default PartnerPage;
