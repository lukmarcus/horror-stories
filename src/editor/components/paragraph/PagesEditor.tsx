import React, { useCallback, useRef, useState } from "react";
import type { ContentBlock } from "../../../types";
import { useEditor } from "../../context/useEditor";
import * as textInsert from "../../utils/textInsert";
import { ColorPicker, ImagePicker, SnippetPicker } from "./EditorInlineTools";
import {
  SPAN_SNIPPETS,
  SYMBOL_PICKER_ITEMS,
  ROOM_PICKER_ITEMS,
  PERSON_PICKER_ITEMS,
  ENEMY_PICKER_ITEMS,
  STORY_PICKER_ITEMS,
  STATUS_PICKER_ITEMS,
  LETTER_PICKER_ITEMS,
  RANDOM_PICKER_ITEMS,
  type ColorName,
} from "./editorPickerData";
import {
  SIZES,
  type SizeName,
  type BlockOpts,
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
    const { styles, color, size } = parseBlockPrefixes(line);
    setActiveOpts({ styles, color, size });
  }, []);

  // ── inline formatting ────────────────────────────────

  const wrap = (before: string, after: string) =>
    textInsert.wrapSelection(ref.current, text, onChange, before, after);

  const insertLine = (snippet: string, cursorOffset: number) => {
    const el = ref.current;
    if (!el) return;
    const pos = el.selectionStart;
    const pre = pos > 0 && text[pos - 1] !== "\n" ? "\n" : "";
    const suf = pos < text.length && text[pos] !== "\n" ? "\n" : "";
    onChange(text.slice(0, pos) + pre + snippet + suf + text.slice(pos));
    const cur = pos + pre.length + cursorOffset;
    requestAnimationFrame(() => {
      el.focus();
      el.selectionStart = el.selectionEnd = cur;
    });
  };

  const insertAtCursor = (snippet: string) =>
    textInsert.insertAtCursor(ref.current, text, onChange, snippet);

  const insertSnippet = (snippet: string, cursorFromEnd?: number) =>
    textInsert.insertSnippet(
      ref.current,
      text,
      onChange,
      snippet,
      cursorFromEnd,
    );

  // ── block-level formatting ─────────────────────────────

  const applyToCurrentLine = (modify: (opts: BlockOpts) => BlockOpts) => {
    const el = ref.current;
    if (!el) return;
    const pos = el.selectionStart;
    const { start, end, line } = getCurrentLineRange(text, pos);
    const { styles, color, size, content } = parseBlockPrefixes(line);
    const next = modify({ styles, color, size });
    const newLine = buildLine(content, next.styles, next.color, next.size);
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

  const clearBlock = () => applyToCurrentLine(() => ({ ...EMPTY_BLOCK_OPTS }));

  const btn = (active: boolean) =>
    `pages-editor__toolbar-btn${active ? " pages-editor__toolbar-btn--active" : ""}`;

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
        {/* row 1: inline */}
        <div className="pages-editor__toolbar">
          <span className="pages-editor__toolbar-label">Tekst:</span>
          <div className="pages-editor__toolbar-group">
            <button
              className="pages-editor__toolbar-btn"
              onMouseDown={(e) => {
                e.preventDefault();
                wrap("<b>", "</b>");
              }}
              title="Pogrubienie (zaznaczenie)"
            >
              <b>B</b>
            </button>
            <button
              className="pages-editor__toolbar-btn"
              onMouseDown={(e) => {
                e.preventDefault();
                wrap("<em>", "</em>");
              }}
              title="Kursywa (zaznaczenie)"
            >
              <em>I</em>
            </button>
            <button
              className="pages-editor__toolbar-btn"
              onMouseDown={(e) => {
                e.preventDefault();
                wrap("<u>", "</u>");
              }}
              title="Podkreślenie (zaznaczenie)"
            >
              <u>U</u>
            </button>
          </div>
          <div className="pages-editor__toolbar-sep" />
          <div className="pages-editor__toolbar-group">
            <ColorPicker
              onSelect={(c) => wrap(`<span class='color-${c}'>`, "</span>")}
              title="Kolor zaznaczenia"
            />
            <SnippetPicker
              items={SPAN_SNIPPETS}
              toggleLabel={"</>"}
              title="Wstaw kolorowy span"
              onSelect={insertSnippet}
            />
          </div>
          <div className="pages-editor__toolbar-sep" />
          <div className="pages-editor__toolbar-group">
            <button
              className="pages-editor__toolbar-btn"
              onMouseDown={(e) => {
                e.preventDefault();
                insertLine("[img: ]", 6);
              }}
              title="Wstaw blok obrazu"
            >
              🖼
            </button>
          </div>
          <div className="pages-editor__toolbar-sep" />
          <div className="pages-editor__toolbar-group">
            <ImagePicker
              items={SYMBOL_PICKER_ITEMS}
              onSelect={(id) => insertAtCursor(`<symbol id="${id}"/>`)}
              toggleContent={
                <img
                  src={SYMBOL_PICKER_ITEMS[0].imagePath}
                  alt="symbol"
                  className="pages-editor__picker-icon"
                />
              }
              title="Wstaw symbol gry"
            />
            <ImagePicker
              items={ROOM_PICKER_ITEMS}
              onSelect={(id) => insertAtCursor(`<room id="${id}"/>`)}
              toggleContent={
                <img
                  src={ROOM_PICKER_ITEMS[0].imagePath}
                  alt="pomieszczenie"
                  className="pages-editor__picker-icon"
                />
              }
              title="Wstaw żeton planszy"
            />
            <ImagePicker
              items={PERSON_PICKER_ITEMS}
              onSelect={(id) => insertAtCursor(`<person id="${id}"/>`)}
              toggleContent={
                <img
                  src={PERSON_PICKER_ITEMS[0].imagePath}
                  alt="postać"
                  className="pages-editor__picker-icon"
                />
              }
              title="Wstaw postać"
            />
            <ImagePicker
              items={ENEMY_PICKER_ITEMS}
              onSelect={(id) => insertAtCursor(`<enemy id="${id}"/>`)}
              toggleContent={
                <img
                  src={ENEMY_PICKER_ITEMS[0].imagePath}
                  alt="przeciwnik"
                  className="pages-editor__picker-icon"
                />
              }
              title="Wstaw przeciwnika"
            />
            <ImagePicker
              items={STORY_PICKER_ITEMS}
              onSelect={(id) => insertAtCursor(`<story id="${id}"/>`)}
              toggleContent={
                <img
                  src={STORY_PICKER_ITEMS[0].imagePath}
                  alt="przedmiot fabularny"
                  className="pages-editor__picker-icon"
                />
              }
              title="Wstaw przedmiot fabularny"
            />
            <ImagePicker
              items={STATUS_PICKER_ITEMS}
              onSelect={(id) => insertAtCursor(`<status id="${id}"/>`)}
              toggleContent={
                <img
                  src={STATUS_PICKER_ITEMS[0].imagePath}
                  alt="status"
                  className="pages-editor__picker-icon"
                />
              }
              title="Wstaw żeton statusu"
            />
            <ImagePicker
              items={LETTER_PICKER_ITEMS}
              onSelect={(id) => insertAtCursor(`<letter id="${id}"/>`)}
              toggleContent={
                <img
                  src={LETTER_PICKER_ITEMS[0].imagePath}
                  alt="litera"
                  className="pages-editor__picker-icon"
                />
              }
              title="Wstaw żeton litery"
            />
            <ImagePicker
              items={RANDOM_PICKER_ITEMS}
              onSelect={(id) => insertAtCursor(`<random id="${id}"/>`)}
              toggleContent={
                <img
                  src={`${import.meta.env.BASE_URL}assets/images/symbols/przedmiot-losowy.png`}
                  alt="przedmiot losowy"
                  className="pages-editor__picker-icon"
                />
              }
              title="Wstaw przedmiot losowy"
            />
          </div>
        </div>

        {/* row 2: block */}
        <div className="pages-editor__toolbar pages-editor__toolbar--block">
          <span className="pages-editor__toolbar-label">Akapit:</span>
          <div className="pages-editor__toolbar-group">
            <button
              className={btn(activeOpts.styles.has("b"))}
              onMouseDown={(e) => {
                e.preventDefault();
                toggleBlockStyle("b");
              }}
              title="Pogrubienie całego akapitu"
            >
              <b>B</b>
            </button>
            <button
              className={btn(activeOpts.styles.has("i"))}
              onMouseDown={(e) => {
                e.preventDefault();
                toggleBlockStyle("i");
              }}
              title="Kursywa całego akapitu"
            >
              <em>I</em>
            </button>
            <button
              className={btn(activeOpts.styles.has("u"))}
              onMouseDown={(e) => {
                e.preventDefault();
                toggleBlockStyle("u");
              }}
              title="Podkreślenie całego akapitu"
            >
              <u>U</u>
            </button>
          </div>
          <div className="pages-editor__toolbar-sep" />
          <div className="pages-editor__toolbar-group">
            <ColorPicker
              onSelect={setBlockColor}
              label="¶A"
              activeColor={activeOpts.color}
            />
          </div>
          <div className="pages-editor__toolbar-sep" />
          <div className="pages-editor__toolbar-group">
            {SIZES.map((s) => (
              <button
                key={s}
                className={btn(activeOpts.size === s)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  setBlockSize(s);
                }}
                title={`Rozmiar akapitu: ${s}`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="pages-editor__toolbar-sep" />
          <div className="pages-editor__toolbar-group">
            <button
              className="pages-editor__toolbar-btn pages-editor__clear-btn"
              onMouseDown={(e) => {
                e.preventDefault();
                clearBlock();
              }}
              title="Wyczyść styl akapitu"
            >
              ✕
            </button>
          </div>
        </div>
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
          "Każda linia = osobny akapit\nObraz: [img: ścieżka/do/pliku.jpg lg]\nStyl akapitu: [b], [i], [u], [c:red], [s:xl] na początku linii"
        }
        rows={12}
        spellCheck={false}
      />
    </div>
  );
};
