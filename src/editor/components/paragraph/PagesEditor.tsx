import React, { useCallback, useRef } from "react";
import type { ContentBlock } from "../../../types";
import { useEditor } from "../../context/useEditor";
import "./PagesEditor.css";

function pageToText(page: ContentBlock[]): string {
  return page
    .map((b) => {
      if (b.type === "image")
        return `[img: ${b.image ?? ""}${b.size ? ` ${b.size}` : ""}]`;
      return b.text ?? "";
    })
    .join("\n");
}

function textToPage(text: string): ContentBlock[] {
  if (!text) return [];
  return text.split("\n").map((line) => {
    const m = line.match(/^\[img:\s*(.*?)(?:\s+(xs|sm|lg|xl))?\]$/);
    if (m) {
      const block: ContentBlock = { type: "image", image: m[1].trim() };
      if (m[2]) block.size = m[2] as ContentBlock["size"];
      return block;
    }
    return { type: "text" as const, text: line };
  });
}

interface PagesEditorProps {
  paragraphId: string;
  pages: ContentBlock[][];
}

export const PagesEditor: React.FC<PagesEditorProps> = ({
  paragraphId,
  pages,
}) => {
  const { dispatch } = useEditor();

  const setPages = useCallback(
    (newPages: ContentBlock[][]) => {
      dispatch({
        type: "SET_PARAGRAPH_PAGES",
        payload: { id: paragraphId, pages: newPages },
      });
    },
    [dispatch, paragraphId],
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
      <button className="pages-editor__add-page" onClick={handleAddPage}>
        + Dodaj stronę
      </button>
    </div>
  );
};

const COLORS = ["yellow", "red", "purple", "green", "blue"] as const;

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

  const wrap = (before: string, after: string) => {
    const el = ref.current;
    if (!el) return;
    const s = el.selectionStart;
    const e = el.selectionEnd;
    const sel = text.slice(s, e);
    onChange(text.slice(0, s) + before + sel + after + text.slice(e));
    requestAnimationFrame(() => {
      el.focus();
      el.selectionStart = s + before.length;
      el.selectionEnd = e + before.length;
    });
  };

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

      <div className="pages-editor__toolbar" role="toolbar">
        <div className="pages-editor__toolbar-group">
          <button
            className="pages-editor__toolbar-btn"
            onMouseDown={(e) => { e.preventDefault(); wrap("<b>", "</b>"); }}
            title="Pogrubienie"
          >
            <b>B</b>
          </button>
          <button
            className="pages-editor__toolbar-btn"
            onMouseDown={(e) => { e.preventDefault(); wrap("<em>", "</em>"); }}
            title="Kursywa"
          >
            <em>I</em>
          </button>
          <button
            className="pages-editor__toolbar-btn"
            onMouseDown={(e) => { e.preventDefault(); wrap("<u>", "</u>"); }}
            title="Podkreślenie"
          >
            <u>U</u>
          </button>
        </div>

        <div className="pages-editor__toolbar-sep" />

        <div className="pages-editor__toolbar-group">
          {COLORS.map((color) => (
            <button
              key={color}
              className={`pages-editor__toolbar-btn pages-editor__color-btn pages-editor__color-btn--${color}`}
              onMouseDown={(e) => {
                e.preventDefault();
                wrap(`<span class='color-${color}'>`, "</span>");
              }}
              title={`Kolor: ${color}`}
            >
              A
            </button>
          ))}
        </div>

        <div className="pages-editor__toolbar-sep" />

        <div className="pages-editor__toolbar-group">
          <button
            className="pages-editor__toolbar-btn"
            onMouseDown={(e) => { e.preventDefault(); insertLine("[img: ]", 6); }}
            title="Wstaw blok obrazu"
          >
            🖼
          </button>
        </div>
      </div>

      <textarea
        ref={ref}
        className="pages-editor__textarea"
        value={text}
        onChange={(e) => onChange(e.target.value)}
        placeholder={"Każda linia = osobny akapit\nObraz: [img: ścieżka/do/pliku.jpg lg]"}
        rows={12}
        spellCheck={false}
      />
    </div>
  );
};
