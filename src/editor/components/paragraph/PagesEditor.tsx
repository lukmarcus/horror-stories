import React, { useCallback, useEffect, useRef, useState } from "react";
import type { ContentBlock } from "../../../types";
import { useEditor } from "../../context/useEditor";
import {
  symbols,
  roomItems,
  getSymbol,
  getRoomItem,
} from "../../../data/items";
import "./PagesEditor.css";

// ── block prefix helpers ────────────────────────────────────

const COLORS = ["yellow", "red", "purple", "green", "blue"] as const;
type ColorName = (typeof COLORS)[number];
const SIZES = ["xs", "sm", "lg", "xl"] as const;
type SizeName = (typeof SIZES)[number];

interface BlockOpts {
  styles: ReadonlySet<"b" | "i" | "u">;
  color: ColorName | null;
  size: SizeName | null;
}
const EMPTY_OPTS: BlockOpts = { styles: new Set(), color: null, size: null };

const BLOCK_PREFIX_RE = /^(\[(?:b|i|u|c:[a-z]+|s:[a-z]+)\])*/;

function parseBlockPrefixes(line: string): BlockOpts & { content: string } {
  const prefixStr = line.match(BLOCK_PREFIX_RE)?.[0] ?? "";
  const content = line.slice(prefixStr.length);
  const styles = new Set<"b" | "i" | "u">();
  if (prefixStr.includes("[b]")) styles.add("b");
  if (prefixStr.includes("[i]")) styles.add("i");
  if (prefixStr.includes("[u]")) styles.add("u");
  const colorM = prefixStr.match(/\[c:([a-z]+)\]/);
  const color =
    colorM && (COLORS as readonly string[]).includes(colorM[1])
      ? (colorM[1] as ColorName)
      : null;
  const sizeM = prefixStr.match(/\[s:([a-z]+)\]/);
  const size =
    sizeM && (SIZES as readonly string[]).includes(sizeM[1])
      ? (sizeM[1] as SizeName)
      : null;
  return { styles, color, size, content };
}

function buildLine(
  content: string,
  styles: ReadonlySet<"b" | "i" | "u">,
  color: ColorName | null,
  size: SizeName | null,
): string {
  let prefix = "";
  if (styles.has("b")) prefix += "[b]";
  if (styles.has("i")) prefix += "[i]";
  if (styles.has("u")) prefix += "[u]";
  if (color) prefix += `[c:${color}]`;
  if (size) prefix += `[s:${size}]`;
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
      const styles = Array.isArray(b.style)
        ? b.style
        : b.style
          ? [b.style]
          : [];
      if (styles.includes("bold")) prefix += "[b]";
      if (styles.includes("italic")) prefix += "[i]";
      if (styles.includes("underline")) prefix += "[u]";
      if (b.color) prefix += `[c:${b.color}]`;
      if (b.size) prefix += `[s:${b.size}]`;
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
    const { styles: style, color, size, content } = parseBlockPrefixes(line);
    const block: ContentBlock = { type: "text", text: content };
    const styleArr: ("bold" | "italic" | "underline")[] = [];
    if (style.has("b")) styleArr.push("bold");
    if (style.has("i")) styleArr.push("italic");
    if (style.has("u")) styleArr.push("underline");
    if (styleArr.length === 1) block.style = styleArr[0];
    else if (styleArr.length > 1) block.style = styleArr;
    if (color) block.color = color;
    if (size) block.size = size;
    return block;
  });
}

// ── image picker data ────────────────────────────────────────

const SYMBOL_PICKER_ITEMS = symbols.map((s) => ({
  id: s.id,
  imagePath: getSymbol(s.id)!.imagePath,
  label: s.name,
}));

const ROOM_PICKER_ITEMS = roomItems.map((r) => ({
  id: String(r.id),
  imagePath: getRoomItem(r.id)!.imagePath,
  label: `Pomieszczenie §${r.id}`,
}));

// ── PagesEditor ──────────────────────────────────────

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

// ── ColorPicker ──────────────────────────────────────

interface ColorPickerProps {
  onSelect: (color: string) => void;
  label?: string;
  activeColor?: ColorName | null;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  onSelect,
  label = "A",
  activeColor,
}) => {
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
        className={`pages-editor__toolbar-btn pages-editor__color-picker-toggle${activeColor ? ` pages-editor__color-btn--${activeColor} pages-editor__toolbar-btn--active` : ""}`}
        onMouseDown={(e) => {
          e.preventDefault();
          setOpen((o) => !o);
        }}
        title="Kolor"
      >
        {label}▾
      </button>
      {open && (
        <div className="pages-editor__color-dropdown">
          {COLORS.map((color) => (
            <button
              key={color}
              className={`pages-editor__toolbar-btn pages-editor__color-btn pages-editor__color-btn--${color}${activeColor === color ? " pages-editor__toolbar-btn--active" : ""}`}
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

// ── ImagePicker ──────────────────────────────────────

interface ImagePickerItem {
  id: string;
  imagePath: string;
  label: string;
}

interface ImagePickerProps {
  items: ImagePickerItem[];
  onSelect: (id: string) => void;
  toggleContent: React.ReactNode;
  title?: string;
}

const ImagePicker: React.FC<ImagePickerProps> = ({
  items,
  onSelect,
  toggleContent,
  title,
}) => {
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
    <div className="pages-editor__image-picker" ref={containerRef}>
      <button
        className="pages-editor__toolbar-btn pages-editor__image-picker-toggle"
        onMouseDown={(e) => {
          e.preventDefault();
          setOpen((o) => !o);
        }}
        title={title}
      >
        {toggleContent}
      </button>
      {open && (
        <div className="pages-editor__image-dropdown">
          {items.map((item) => (
            <button
              key={item.id}
              className="pages-editor__image-btn"
              onMouseDown={(e) => {
                e.preventDefault();
                onSelect(item.id);
                setOpen(false);
              }}
              title={item.label}
            >
              <img src={item.imagePath} alt={item.label} />
            </button>
          ))}
        </div>
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
  const [activeOpts, setActiveOpts] = useState<BlockOpts>(EMPTY_OPTS);

  const updateActive = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const { line } = getCurrentLineRange(el.value, el.selectionStart);
    const { styles, color, size } = parseBlockPrefixes(line);
    setActiveOpts({ styles, color, size });
  }, []);

  // ── inline formatting ────────────────────────────────

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

  const insertAtCursor = (snippet: string) => {
    const el = ref.current;
    if (!el) return;
    const pos = el.selectionStart;
    onChange(text.slice(0, pos) + snippet + text.slice(pos));
    requestAnimationFrame(() => {
      el.focus();
      el.selectionStart = el.selectionEnd = pos + snippet.length;
    });
  };

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

  const clearBlock = () => applyToCurrentLine(() => ({ ...EMPTY_OPTS }));

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
              title="Wstaw kartę pomieszczenia"
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
