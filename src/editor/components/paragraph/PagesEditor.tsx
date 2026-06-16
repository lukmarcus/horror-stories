import React, { useCallback, useRef, useState } from "react";
import type { ContentBlock } from "../../../types";
import { useEditor } from "../../context/useEditor";
import * as textInsert from "../../utils/textInsert";
import { BlockToolbar } from "./BlockToolbar";
import { InlineToolbar } from "./InlineToolbar";
import { type ColorName } from "./editorPickerData";
import {
  type BlockOpts,
  type SizeName,
  EMPTY_BLOCK_OPTS,
  parseBlockPrefixes,
  buildLine,
  getCurrentLineRange,
  pageToText,
  textToPage,
} from "./pageSerializer";
import "./PagesEditor.css";

// ── PageEditor ────────────────────────────────────────

interface PagesEditorProps {
  paragraphId: string;
  pages: ContentBlock[][];
  /** If provided, called instead of dispatching SET_PARAGRAPH_PAGES */
  onPagesChange?: (pages: ContentBlock[][]) => void;
  /** Disables the "Add page" button — for single-content contexts like variant bodies */
  singlePage?: boolean;
}

export const PagesEditor: React.FC<PagesEditorProps> = ({
  paragraphId,
  pages,
  onPagesChange,
  singlePage,
}) => {
  const { dispatch } = useEditor();

  const setPages = useCallback(
    (newPages: ContentBlock[][]) => {
      if (onPagesChange) {
        onPagesChange(newPages);
      } else {
        dispatch({
          type: "SET_PARAGRAPH_PAGES",
          payload: { id: paragraphId, pages: newPages },
        });
      }
    },
    [dispatch, paragraphId, onPagesChange],
  );

  const handlePageChange = useCallback(
    (pageIndex: number, text: string) => {
      setPages(pages.map((p, i) => (i === pageIndex ? textToPage(text) : p)));
    },
    [pages, setPages],
  );

  const handleAddPage = () => setPages([...pages, []]);

  const handleRemovePage = (pageIndex: number) => {
    const next = pages.filter((_, i) => i !== pageIndex);
    setPages(next.length > 0 ? next : [[]]);
  };

  return (
    <div className="pages-editor">
      {pages.map((page, pageIndex) => (
        <PageEditor
          key={pageIndex}
          text={pageToText(page)}
          pageIndex={pageIndex}
          pageCount={pages.length}
          onChange={(t) => handlePageChange(pageIndex, t)}
          onRemove={() => handleRemovePage(pageIndex)}
        />
      ))}
      {!singlePage && (
        <button className="pages-editor__add-page" onClick={handleAddPage}>
          + Dodaj stronę
        </button>
      )}
    </div>
  );
};

// ── PageEditor ────────────────────────────────────────

interface PageEditorProps {
  text: string;
  pageIndex: number;
  pageCount: number;
  onChange: (text: string) => void;
  onRemove: () => void;
}

const PageEditor: React.FC<PageEditorProps> = ({
  text,
  pageIndex,
  pageCount,
  onChange,
  onRemove,
}) => {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [activeOpts, setActiveOpts] = useState<BlockOpts>(EMPTY_BLOCK_OPTS);

  const updateActive = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const { line } = getCurrentLineRange(el.value, el.selectionStart);
    const { styles, color, size, spacing } = parseBlockPrefixes(line);
    setActiveOpts({ styles, color, size, spacing });
  }, []);

  const wrap = (before: string, after: string) =>
    textInsert.wrapSelection(ref.current, text, onChange, before, after);

  const insertAtCursor = (snippet: string) =>
    textInsert.insertAtCursor(ref.current, text, onChange, snippet);

  const insertBlockImage = (id: string) => {
    const el = ref.current;
    if (!el) return;
    const pos = el.selectionStart;
    const pre = pos > 0 && text[pos - 1] !== "\n" ? "\n" : "";
    const suf = pos < text.length && text[pos] !== "\n" ? "\n" : "";
    const snippet = `[img: ${id}]`;
    onChange(text.slice(0, pos) + pre + snippet + suf + text.slice(pos));
    const newPos = pos + pre.length + snippet.length;
    requestAnimationFrame(() => {
      el.focus();
      el.selectionStart = el.selectionEnd = newPos;
    });
  };

  const insertSnippet = (snippet: string, cursorFromEnd?: number) =>
    textInsert.insertSnippet(
      ref.current,
      text,
      onChange,
      snippet,
      cursorFromEnd,
    );

  const applyToCurrentLine = (modify: (opts: BlockOpts) => BlockOpts) => {
    const el = ref.current;
    if (!el) return;
    const pos = el.selectionStart;
    const { start, end, line } = getCurrentLineRange(text, pos);
    const { styles, color, size, spacing, content } = parseBlockPrefixes(line);
    const next = modify({ styles, color, size, spacing });
    const newLine = buildLine(
      content,
      next.styles,
      next.color,
      next.size,
      next.spacing,
    );
    const delta = newLine.length - line.length;
    onChange(text.slice(0, start) + newLine + text.slice(end));
    setActiveOpts(next);
    requestAnimationFrame(() => {
      el.focus();
      el.selectionStart = el.selectionEnd = Math.max(start, pos + delta);
    });
  };

  const toggleBlockStyle = (tag: "b" | "i" | "u") =>
    applyToCurrentLine((opts) => {
      const next = new Set(opts.styles);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return { ...opts, styles: next };
    });

  const setBlockColor = (color: string) =>
    applyToCurrentLine((opts) => ({
      ...opts,
      color: opts.color === color ? null : (color as ColorName),
    }));

  const setBlockSize = (size: string) =>
    applyToCurrentLine((opts) => ({
      ...opts,
      size: opts.size === size ? null : (size as SizeName),
    }));

  const toggleBlockSpacing = () =>
    applyToCurrentLine((opts) => ({
      ...opts,
      spacing: opts.spacing === "none" ? undefined : "none",
    }));

  const clearBlock = () => applyToCurrentLine(() => ({ ...EMPTY_BLOCK_OPTS }));

  return (
    <div className="pages-editor__page">
      {pageCount > 1 && (
        <div className="pages-editor__page-header">
          <span className="pages-editor__page-label">
            Strona {pageIndex + 1}
          </span>
          <button className="pages-editor__page-remove" onClick={onRemove}>
            Usuń stronę
          </button>
        </div>
      )}

      <div className="pages-editor__toolbars" role="toolbar">
        <InlineToolbar
          onWrap={wrap}
          onInsertAtCursor={insertAtCursor}
          onInsertSnippet={insertSnippet}
        />
        <BlockToolbar
          activeOpts={activeOpts}
          onToggleStyle={toggleBlockStyle}
          onSetColor={setBlockColor}
          onSetSize={setBlockSize}
          onToggleSpacing={toggleBlockSpacing}
          onClear={clearBlock}
          onInsertBlockImage={insertBlockImage}
        />
      </div>

      <textarea
        ref={ref}
        className="pages-editor__textarea"
        value={text}
        onChange={(e) => onChange(e.target.value)}
        onSelect={updateActive}
        onClick={updateActive}
        onKeyUp={updateActive}
        placeholder={
          "Każda linia = osobny akapit\nObraz: [img: ścieżka/do/pliku.jpg lg]\nStyl akapitu: [sp:none], [b], [i], [u], [c:red], [s:xl] na początku linii"
        }
        rows={12}
        spellCheck={false}
      />
    </div>
  );
};
