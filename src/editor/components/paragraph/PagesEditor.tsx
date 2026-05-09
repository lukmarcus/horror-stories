import React, { useCallback, useEffect, useRef, useState } from "react";
import type { ContentBlock } from "../../../types";
import { useEditor } from "../../context/useEditor";
import "./PagesEditor.css";

// ── block prefix helpers ────────────────────────────────────

const COLORS = ["yellow", "red", "purple", "green", "blue"] as const;
type ColorName = (typeof COLORS)[number];

const BLOCK_PREFIX_RE = /^(\[(?:b|i|u|c:[a-z]+)\])*/;

function parseBlockPrefixes(line: string): {
  style: "b" | "i" | "u" | null;
  color: ColorName | null;
  content: string;
} {
  const prefixStr = line.match(BLOCK_PREFIX_RE)?.[0] ?? "";
  const content = line.slice(prefixStr.length);
  let style: "b" | "i" | "u" | null = null;
  if (prefixStr.includes("[b]")) style = "b";
  else if (prefixStr.includes("[i]")) style = "i";
  else if (prefixStr.includes("[u]")) style = "u";
  const colorM = prefixStr.match(/\[c:([a-z]+)\]/);
  const color =
    colorM && (COLORS as readonly string[]).includes(colorM[1])
      ? (colorM[1] as ColorName)
      : null;
  return { style, color, content };
}

function buildLine(
  content: string,
  style: "b" | "i" | "u" | null,
  color: ColorName | null,
): string {
  let prefix = "";
  if (style) prefix += `[${style}]`;
  if (color) prefix += `[c:${color}]`;
  return prefix + content;
}

function getCurrentLineRange(
  text: string,
  pos: number,
): { start: number; end: number; line: string } {
  const start = text.lastIndexOf("\n", pos - 1) + 1;
  const rawEnd = text.indexOf("\n", pos);
  const end = rawEnd === -1 ? text.length : rawEnd;
  return { start, end, line: text.slice(start, end) };
}

function pageToText(page: ContentBlock[]): string {
  return page
    .map((b) => {
      if (b.type === "image")
        return `[img: ${b.image ?? ""}${b.size ? ` ${b.size}` : ""}]`;
      let prefix = "";
      if (b.style === "bold") prefix += "[b]";
      else if (b.style === "italic") prefix += "[i]";
      else if (b.style === "underline") prefix += "[u]";
      if (b.color) prefix += `[c:${b.color}]`;
      return prefix + (b.text ?? "");
    })
    .join("\n");
}

function textToPage(text: string): ContentBlock[] {
  if (!text) return [];
  return text.split("\n").map((line) => {
    const imgM = line.match(/^\[img:\s*(.*?)(?:\s+(xs|sm|lg|xl))?\]$/);
    if (imgM) {
      const block: ContentBlock = { type: "image", image: imgM[1].trim() };
      if (imgM[2]) block.size = imgM[2] as ContentBlock["size"];
      return block;
    }
    const { style, color, content } = parseBlockPrefixes(line);
    const block: ContentBlock = { type: "text", text: content };
    if (style === "b") block.style = "bold";
    else if (style === "i") block.style = "italic";
    else if (style === "u") block.style = "underline";
    if (color) block.color = color;
    return block;
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

interface ColorPickerProps {
  onSelect: (color: string) => void;
  label?: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ onSelect, label = "A" }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className="pages-editor__color-picker" ref={containerRef}>
      <button
        className="pages-editor__toolbar-btn pages-editor__color-picker-toggle"
        onMouseDown={(e) => {
          e.preventDefault();
          setOpen((o) => !o);
        }}
        title="Kolor tekstu"
      >
        {label}&#x25BE;
      </button>
      {open && (
        <div className="pages-editor__color-dropdown">
          {COLORS.map((color) => (
            <button
              key={color}
              className={`pages-editor__toolbar-btn pages-editor__color-btn pages-editor__color-btn--${color}`}
              onMouseDown={(e) => {
                e.preventDefault();
                onSelect(color);
                setOpen(false);
              }}
              title={`Kolor: ${color}`}
            >
              A
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

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

  // ── block-level formatting ───────────────────────────────

  const applyToCurrentLine = (
    modify: (
      style: "b" | "i" | "u" | null,
      color: ColorName | null,
    ) => { style: "b" | "i" | "u" | null; color: ColorName | null },
  ) => {
    const el = ref.current;
    if (!el) return;
    const pos = el.selectionStart;
    const { start, end, line } = getCurrentLineRange(text, pos);
    const { style, color, content } = parseBlockPrefixes(line);
    const next = modify(style, color);
    const newLine = buildLine(content, next.style, next.color);
    const delta = newLine.length - line.length;
    onChange(text.slice(0, start) + newLine + text.slice(end));
    requestAnimationFrame(() => {
      el.focus();
      el.selectionStart = el.selectionEnd = Math.max(start, pos + delta);
    });
  };

  const toggleBlockStyle = (tag: "b" | "i" | "u") =>
    applyToCurrentLine((style, color) => ({
      style: style === tag ? null : tag,
      color,
    }));

  const setBlockColor = (color: string) =>
    applyToCurrentLine((style, oldColor) => ({
      style,
      color: oldColor === color ? null : (color as ColorName),
    }));

  const clearBlock = () =>
    applyToCurrentLine(() => ({ style: null, color: null }));

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
        </div>

        {/* row 2: block */}
        <div className="pages-editor__toolbar pages-editor__toolbar--block">
          <span className="pages-editor__toolbar-label">Akapit:</span>
          <div className="pages-editor__toolbar-group">
            <button
              className="pages-editor__toolbar-btn"
              onMouseDown={(e) => {
                e.preventDefault();
                toggleBlockStyle("b");
              }}
              title="Pogrubienie całego akapitu"
            >
              <b>B</b>
            </button>
            <button
              className="pages-editor__toolbar-btn"
              onMouseDown={(e) => {
                e.preventDefault();
                toggleBlockStyle("i");
              }}
              title="Kursywa całego akapitu"
            >
              <em>I</em>
            </button>
            <button
              className="pages-editor__toolbar-btn"
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
            <ColorPicker onSelect={setBlockColor} label="¶A" />
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
        placeholder={
          "Każda linia = osobny akapit\nObraz: [img: ścieżka/do/pliku.jpg lg]\nStyl akapitu: [b], [i], [u], [c:red] na początku linii"
        }
        rows={12}
        spellCheck={false}
      />
    </div>
  );
};
