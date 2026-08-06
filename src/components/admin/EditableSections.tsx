import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import { EditableText } from './EditableText';
import { Plus, Trash2 } from 'lucide-react';

/** A section is an ordered list of these, so paragraphs and bullets can be interleaved freely. */
export interface SectionBlock {
  type: 'paragraph' | 'bullet';
  text: string;
}

export interface ContentSection {
  id: string;
  heading: string;
  blocks: SectionBlock[];
}

interface EditableSectionsProps {
  /** page_content key holding the JSON array of sections. */
  contentKey: string;
  /** Sections used until an admin saves their own. */
  defaultSections: ContentSection[];
}

/**
 * Sections are stored as a JSON string so no schema change is needed.
 *
 * Two older shapes are still read: a single `description` string, and separate `descriptions` /
 * `bullets` arrays. Those are flattened into blocks in the order they used to render — every
 * paragraph first, then every bullet — so existing records come through looking unchanged.
 */
export const parseSections = (raw: string | undefined, fallback: ContentSection[]): ContentSection[] => {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return fallback;
    return parsed
      .filter((s) => s && typeof s === 'object')
      .map((s, i) => ({
        id: String(s.id ?? `section-${i}`),
        heading: String(s.heading ?? ''),
        blocks: Array.isArray(s.blocks)
          ? s.blocks
              .filter((b: unknown) => b && typeof b === 'object')
              .map((b: { type?: unknown; text?: unknown }) => ({
                type: b.type === 'bullet' ? ('bullet' as const) : ('paragraph' as const),
                text: String(b.text ?? ''),
              }))
          : [
              ...(Array.isArray(s.descriptions)
                ? s.descriptions
                : s.description
                  ? [s.description]
                  : []
              ).map((text: unknown) => ({ type: 'paragraph' as const, text: String(text) })),
              ...(Array.isArray(s.bullets) ? s.bullets : []).map((text: unknown) => ({
                type: 'bullet' as const,
                text: String(text),
              })),
            ],
      }));
  } catch {
    return fallback;
  }
};

/**
 * Runs of consecutive bullets are drawn inside one <ul>; a paragraph between them closes that list
 * and opens a new one after. Indices point back into the section's flat block list.
 */
const groupBlocks = (blocks: SectionBlock[]) => {
  const groups: Array<{ kind: 'paragraph'; index: number } | { kind: 'bullets'; indices: number[] }> = [];
  blocks.forEach((block, index) => {
    if (block.type === 'paragraph') {
      groups.push({ kind: 'paragraph', index });
      return;
    }
    const last = groups[groups.length - 1];
    if (last && last.kind === 'bullets') {
      last.indices.push(index);
    } else {
      groups.push({ kind: 'bullets', indices: [index] });
    }
  });
  return groups;
};

/**
 * A list of policy-style sections (heading plus interleaved paragraphs and bullets) that admins can
 * edit, add to and remove. Visitors just see the rendered content.
 */
export const EditableSections: React.FC<EditableSectionsProps> = ({ contentKey, defaultSections }) => {
  const { isAdmin, pageContent, updateText } = useAdmin();

  const sections = parseSections(pageContent[contentKey], defaultSections);

  const write = (next: ContentSection[]) => updateText(contentKey, JSON.stringify(next));

  const patch = (index: number, changes: Partial<ContentSection>) =>
    write(sections.map((section, i) => (i === index ? { ...section, ...changes } : section)));

  const addSection = () =>
    write([
      ...sections,
      {
        id: `section-${Date.now()}`,
        heading: `${sections.length + 1}. New Section`,
        blocks: [{ type: 'paragraph', text: 'Describe this section here.' }],
      },
    ]);

  const removeSection = (index: number) => {
    if (!window.confirm('Remove this section and everything in it?')) return;
    write(sections.filter((_, i) => i !== index));
  };

  /** New blocks always land at the end, so they appear in the order they were added. */
  const addBlock = (index: number, type: SectionBlock['type']) =>
    patch(index, {
      blocks: [
        ...sections[index].blocks,
        { type, text: type === 'bullet' ? 'New bullet point' : 'New paragraph.' },
      ],
    });

  const setBlock = (index: number, blockIndex: number, text: string) =>
    patch(index, {
      blocks: sections[index].blocks.map((block, i) => (i === blockIndex ? { ...block, text } : block)),
    });

  const removeBlock = (index: number, blockIndex: number) =>
    patch(index, { blocks: sections[index].blocks.filter((_, i) => i !== blockIndex) });

  const adminButton =
    'inline-flex items-center gap-1.5 rounded-lg border border-outline-variant px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant transition-colors hover:border-primary hover:text-primary cursor-pointer';

  return (
    <div className="space-y-6">
      {sections.map((section, index) => (
        <section key={section.id} className="group/section space-y-2">
          <div className="flex items-start justify-between gap-3">
            <EditableText
              value={section.heading}
              onSave={(val) => patch(index, { heading: val })}
              className="font-bold text-headline-sm text-sm text-on-surface"
              tag="h3"
            />
            {isAdmin && (
              <button
                type="button"
                onClick={() => removeSection(index)}
                title="Remove section"
                className="shrink-0 cursor-pointer rounded-lg p-1.5 text-red-500 opacity-0 transition-opacity hover:bg-red-500/10 group-hover/section:opacity-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {groupBlocks(section.blocks).map((group) =>
            group.kind === 'paragraph' ? (
              <div key={group.index} className="group/para flex items-start gap-2">
                <EditableText
                  value={section.blocks[group.index].text}
                  onSave={(val) => setBlock(index, group.index, val)}
                  className="flex-1 text-body-sm leading-relaxed text-on-surface-variant"
                  tag="p"
                  multiline={true}
                />
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => removeBlock(index, group.index)}
                    title="Remove paragraph"
                    className="mt-0.5 shrink-0 cursor-pointer rounded p-1 text-red-500 opacity-0 transition-opacity hover:bg-red-500/10 group-hover/para:opacity-100"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            ) : (
              <ul key={`bullets-${group.indices[0]}`} className="ml-1 space-y-1.5">
                {group.indices.map((blockIndex) => (
                  <li
                    key={blockIndex}
                    className="group/bullet flex items-start gap-2 text-body-sm text-on-surface-variant"
                  >
                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <EditableText
                      value={section.blocks[blockIndex].text}
                      onSave={(val) => setBlock(index, blockIndex, val)}
                      tag="span"
                      inline
                    />
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => removeBlock(index, blockIndex)}
                        title="Remove bullet"
                        className="cursor-pointer rounded p-1 text-red-500 opacity-0 transition-opacity hover:bg-red-500/10 group-hover/bullet:opacity-100"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            ),
          )}

          {isAdmin && (
            <div className="flex flex-wrap gap-2 pt-1">
              <button type="button" onClick={() => addBlock(index, 'paragraph')} className={adminButton}>
                <Plus className="w-3 h-3" />
                Add Paragraph
              </button>
              <button type="button" onClick={() => addBlock(index, 'bullet')} className={adminButton}>
                <Plus className="w-3 h-3" />
                Add Bullet
              </button>
            </div>
          )}
        </section>
      ))}

      {isAdmin && (
        <button
          type="button"
          onClick={addSection}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-colors hover:bg-emerald-500 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Section
        </button>
      )}
    </div>
  );
};

export default EditableSections;
