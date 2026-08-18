import React, { useEffect, useRef, useState } from 'react';
import Quill from 'quill';
// Imported here rather than from index.css so the theme travels with the component through the JS
// module graph — a PostCSS @import of a node_modules file is not reliably re-resolved by the dev server.
import 'quill/dist/quill.snow.css';
import { useAdmin } from '../../context/AdminContext';
import { Check, Edit3, X } from 'lucide-react';

interface EditableRichTextProps {
  /** Used when editing static page content stored in `pageContent`. */
  contentKey?: string;
  /** Used when editing a value that comes from the database. */
  value?: string;
  onSave?: (newValue: string) => void;
  className?: string;
  placeholder?: string;
  /** Shorter editor for short blurbs — card descriptions, captions and stat copy. */
  compact?: boolean;
}

/** Deliberately small — headings, emphasis, lists, quotes and links cover everything the site publishes. */
const TOOLBAR = [
  [{ header: [3, 4, false] }],
  ['bold', 'italic', 'underline'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['blockquote', 'link'],
  ['clean'],
];

const HTML_TAG = /<\/?[a-z][\s\S]*>/i;

/** Escapes a plain-text value so legacy content can be fed to Quill without being parsed as markup. */
const escapeHtml = (text: string) =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

/**
 * Older records were saved as plain text with real newlines. Wrapping each line in a paragraph keeps
 * the author's line breaks intact when the value is opened in the editor for the first time.
 */
const toHtml = (raw: string) => {
  if (!raw) return '';
  if (HTML_TAG.test(raw)) return raw;
  return raw
    .split(/\n{2,}/)
    .map((block) => `<p>${escapeHtml(block).replace(/\n/g, '<br>')}</p>`)
    .join('');
};

/**
 * Quill only ever emits a small set of tags, but the value is stored in the database and rendered with
 * dangerouslySetInnerHTML, so scripts, embedded frames and event handlers are stripped on the way out.
 */
const sanitize = (html: string) => {
  if (typeof window === 'undefined') return html;
  const template = document.createElement('template');
  template.innerHTML = html;
  template.content.querySelectorAll('script, style, iframe, object, embed, form').forEach((el) => el.remove());
  template.content.querySelectorAll('*').forEach((el) => {
    for (const attr of Array.from(el.attributes)) {
      const name = attr.name.toLowerCase();
      const value = attr.value.replace(/\s/g, '').toLowerCase();
      if (name.startsWith('on') || (name === 'href' && value.startsWith('javascript:'))) {
        el.removeAttribute(attr.name);
      }
    }
  });
  return template.innerHTML;
};

const isEmptyHtml = (html: string) => !html.replace(/<(p|br|div|span)[^>]*>|<\/(p|div|span)>|&nbsp;|\s/gi, '').length;

export const EditableRichText: React.FC<EditableRichTextProps> = ({
  contentKey,
  value,
  onSave,
  className = '',
  placeholder = 'Write the article body…',
  compact = false,
}) => {
  const { isAdmin, pageContent, updateText } = useAdmin();
  const [isEditing, setIsEditing] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);

  // A key with no row yet falls back to `value`; an admin-cleared key stores '', which still wins.
  const currentValue = contentKey ? (pageContent[contentKey] ?? value ?? '') : (value || '');
  // The editor is uncontrolled once mounted, so the latest saved value is read at mount time only.
  const currentValueRef = useRef(currentValue);
  currentValueRef.current = currentValue;

  useEffect(() => {
    const host = editorRef.current;
    if (!isEditing || !host) return;

    /*
     * Quill mutates its container and injects a toolbar sibling, and it cannot be un-initialised.
     * Mounting it on a throwaway child that the cleanup deletes keeps every mount a clean slate —
     * without this, StrictMode's double effect (and any cancel/reopen) stacks a second toolbar.
     */
    const container = document.createElement('div');
    host.replaceChildren(container);

    const quill = new Quill(container, {
      theme: 'snow',
      placeholder,
      modules: { toolbar: TOOLBAR },
    });
    quillRef.current = quill;

    // Quill puts its toolbar next to the container, so teardown has to account for both.
    const toolbar = (quill.getModule('toolbar') as { container?: HTMLElement } | undefined)?.container;

    const initial = toHtml(currentValueRef.current);
    if (initial) {
      quill.clipboard.dangerouslyPasteHTML(initial, 'silent');
    }
    quill.setSelection(quill.getLength(), 0);

    /*
     * Remove exactly the nodes Quill created, never the host's children wholesale: React reuses this
     * DOM node for the display field once editing ends, and effect cleanup runs *after* that new
     * content is committed — clearing the host here would wipe the value that was just saved.
     */
    return () => {
      quillRef.current = null;
      toolbar?.remove();
      container.remove();
    };
  }, [isEditing, placeholder]);

  const handleSave = () => {
    const quill = quillRef.current;
    const raw = quill ? quill.root.innerHTML : '';
    const next = isEmptyHtml(raw) ? '' : sanitize(raw);
    setIsEditing(false);
    if (next !== currentValue) {
      if (contentKey) updateText(contentKey, next);
      onSave?.(next);
    }
  };

  const rendered = HTML_TAG.test(currentValue) ? sanitize(currentValue) : '';

  if (!isAdmin) {
    return rendered ? (
      <div className={`rich-content ${className}`} dangerouslySetInnerHTML={{ __html: rendered }} />
    ) : (
      /* Plain-text values keep their line breaks rather than collapsing into one paragraph. */
      <div className={`rich-content whitespace-pre-line ${className}`}>{currentValue}</div>
    );
  }

  if (isEditing) {
    return (
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative z-20 rounded-xl border border-primary/50 bg-surface-container-lowest p-2 shadow-md"
      >
        {/* Quill takes over this node's children entirely — see the mount effect. */}
        <div className={`rich-editor ${compact ? 'rich-editor-compact' : ''}`} ref={editorRef} />
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="inline-flex items-center gap-1.5 rounded border border-outline-variant bg-surface-container px-3 py-1.5 text-xs font-semibold text-on-surface-variant hover:bg-surface-container-high cursor-pointer"
          >
            <X className="h-3.5 w-3.5" /> Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 rounded bg-primary px-3 py-1.5 text-xs font-semibold text-on-primary hover:bg-primary-container cursor-pointer"
          >
            <Check className="h-3.5 w-3.5" /> Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className="group/edit relative block w-full cursor-pointer rounded border border-dashed border-transparent p-1 transition-all duration-150 hover:border-primary/50 hover:bg-primary/5"
    >
      {rendered ? (
        <div className={`rich-content pr-6 ${className}`} dangerouslySetInnerHTML={{ __html: rendered }} />
      ) : (
        <div className={`rich-content whitespace-pre-line pr-6 ${className}`}>
          {currentValue || <span className="text-on-surface-variant/60 italic">{placeholder}</span>}
        </div>
      )}
      <span className="pointer-events-none absolute right-1.5 top-2 rounded-md border border-outline-variant/30 bg-surface-container p-1 opacity-0 shadow-sm transition-opacity duration-150 group-hover/edit:opacity-100">
        <Edit3 className="h-3.5 w-3.5 text-primary" />
      </span>
    </div>
  );
};
