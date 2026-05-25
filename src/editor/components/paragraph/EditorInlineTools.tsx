import React, { useState } from "react";
import { useClickOutside } from "../../../hooks/useClickOutside";
import type { SnippetItem } from "./snippets";
import {
  symbols,
  roomItems,
  persons,
  enemies,
  storyItems,
  statuses,
  letters,
  randomItems,
  getSymbol,
  getRoomItem,
  getPerson,
  getEnemy,
  getStoryItem,
  getStatus,
  getLetter,
  getRandomItem,
} from "../../../data/items";

// ── Picker item data ─────────────────────────────────

export const SYMBOL_PICKER_ITEMS = symbols.map((s) => ({
  id: s.id,
  imagePath: getSymbol(s.id)!.imagePath,
  label: s.name,
}));

export const ROOM_PICKER_ITEMS = roomItems.map((r) => ({
  id: String(r.id),
  imagePath: getRoomItem(r.id)!.imagePath,
  label: `Żeton planszy §${r.id}`,
  sublabel: r.name || undefined,
}));

export const PERSON_PICKER_ITEMS = persons.map((p) => ({
  id: p.id,
  imagePath: getPerson(p.id)!.imagePath,
  label: p.id.charAt(0).toUpperCase() + p.id.slice(1),
}));

export const ENEMY_PICKER_ITEMS = enemies.map((e) => ({
  id: e.id,
  imagePath: getEnemy(e.id)!.imagePath,
  label: e.id.charAt(0).toUpperCase() + e.id.slice(1),
}));

export const STORY_PICKER_ITEMS = storyItems.map((s) => ({
  id: s.id,
  imagePath: getStoryItem(s.id)!.imagePath,
  label: `Przedmiot fabularny ${s.id.toUpperCase()}${s.paragraphId != null ? ` (§${s.paragraphId})` : ""}`,
  sublabel: s.description || undefined,
}));

export const STATUS_PICKER_ITEMS = statuses.map((s) => ({
  id: s.id,
  imagePath: getStatus(s.id)!.imagePath,
  label: s.name ? `Żeton statusu: ${s.name}` : s.id,
  sublabel: s.description || undefined,
}));

export const LETTER_PICKER_ITEMS = letters.map((l) => ({
  id: l.id,
  imagePath: getLetter(l.id)!.imagePath,
  label: `Litera ${l.id.toUpperCase()}`,
}));

export const RANDOM_PICKER_ITEMS = randomItems.map((r) => ({
  id: r.id,
  imagePath: getRandomItem(r.id)!.imagePath,
  label: `Przedmiot losowy ${r.id.toUpperCase()}`,
  sublabel: r.description || undefined,
}));

// ── ColorPicker ──────────────────────────────────────

export const COLORS = ["yellow", "red", "purple", "green", "blue"] as const;
export type ColorName = (typeof COLORS)[number];

export interface ColorPickerProps {
  onSelect: (color: string) => void;
  label?: string;
  activeColor?: ColorName | null;
  title?: string;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  onSelect,
  label = "A",
  activeColor,
  title = "Kolor",
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useClickOutside(open, () => setOpen(false));

  return (
    <div className="pages-editor__color-picker" ref={containerRef}>
      <button
        className={`pages-editor__toolbar-btn pages-editor__color-picker-toggle${activeColor ? ` pages-editor__color-btn--${activeColor} pages-editor__toolbar-btn--active` : ""}`}
        onMouseDown={(e) => {
          e.preventDefault();
          setOpen((o) => !o);
        }}
        title={title}
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

export interface ImagePickerItem {
  id: string;
  imagePath: string;
  label: string;
  sublabel?: string;
}

export interface ImagePickerProps {
  items: ImagePickerItem[];
  onSelect: (id: string) => void;
  toggleContent: React.ReactNode;
  title?: string;
}

export const ImagePicker: React.FC<ImagePickerProps> = ({
  items,
  onSelect,
  toggleContent,
  title,
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useClickOutside(open, () => setOpen(false));

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
              title={
                item.sublabel ? `${item.label}\n${item.sublabel}` : item.label
              }
            >
              <img src={item.imagePath} alt={item.label} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ── SnippetPicker ─────────────────────────────────────

export type { SnippetItem } from "./snippets";

export interface SnippetPickerProps {
  items: SnippetItem[];
  toggleLabel: React.ReactNode;
  title?: string;
  onSelect: (snippet: string, cursorFromEnd?: number) => void;
}

export const SnippetPicker: React.FC<SnippetPickerProps> = ({
  items,
  toggleLabel,
  title,
  onSelect,
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useClickOutside(open, () => setOpen(false));

  return (
    <div className="pages-editor__snippet-picker" ref={containerRef}>
      <button
        className="pages-editor__toolbar-btn"
        onMouseDown={(e) => {
          e.preventDefault();
          setOpen((o) => !o);
        }}
        title={title}
      >
        {toggleLabel}
      </button>
      {open && (
        <div className="pages-editor__snippet-dropdown">
          {items.map((item) => (
            <button
              key={item.label}
              className="pages-editor__snippet-item"
              style={
                item.displayColor
                  ? { color: item.displayColor, fontWeight: 700 }
                  : undefined
              }
              onMouseDown={(e) => {
                e.preventDefault();
                onSelect(item.snippet, item.cursorFromEnd);
                setOpen(false);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export { SPAN_SNIPPETS } from "./snippets";
