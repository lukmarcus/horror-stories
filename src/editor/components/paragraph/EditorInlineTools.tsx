import React, { useState } from "react";
import { useClickOutside } from "../../../hooks/useClickOutside";
import {
  COLORS,
  type ColorName,
  type ImagePickerItem,
} from "./editorPickerData";
import type { SnippetItem } from "./snippets";

export type { ColorName, ImagePickerItem } from "./editorPickerData";
export type { SnippetItem } from "./snippets";

// ── DropdownPicker (generic toggle + dropdown shell) ─────────────────────────

interface DropdownPickerProps {
  containerClass: string;
  toggleContent: React.ReactNode;
  toggleClass: string;
  title?: string;
  children: React.ReactNode;
}

const DropdownPicker: React.FC<DropdownPickerProps> = ({
  containerClass,
  toggleContent,
  toggleClass,
  title,
  children,
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useClickOutside(open, () => setOpen(false));

  return (
    <div className={containerClass} ref={containerRef}>
      <button
        className={toggleClass}
        onMouseDown={(e) => {
          e.preventDefault();
          setOpen((o) => !o);
        }}
        title={title}
      >
        {toggleContent}
      </button>
      {open && children}
    </div>
  );
};

// ── ColorPicker ───────────────────────────────────────────────────────────────

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
}) => (
  <DropdownPicker
    containerClass="pages-editor__color-picker"
    toggleContent={<>{label}▾</>}
    toggleClass={`pages-editor__toolbar-btn pages-editor__color-picker-toggle${activeColor ? ` pages-editor__color-btn--${activeColor} pages-editor__toolbar-btn--active` : ""}`}
    title={title}
  >
    <div className="pages-editor__color-dropdown">
      {COLORS.map((color) => (
        <button
          key={color}
          className={`pages-editor__toolbar-btn pages-editor__color-btn pages-editor__color-btn--${color}${activeColor === color ? " pages-editor__toolbar-btn--active" : ""}`}
          onMouseDown={(e) => {
            e.preventDefault();
            onSelect(color);
          }}
          title={`Kolor: ${color}`}
        >
          A
        </button>
      ))}
    </div>
  </DropdownPicker>
);

// ── ImagePicker ───────────────────────────────────────────────────────────────

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
}) => (
  <DropdownPicker
    containerClass="pages-editor__image-picker"
    toggleContent={toggleContent}
    toggleClass="pages-editor__toolbar-btn pages-editor__image-picker-toggle"
    title={title}
  >
    <div className="pages-editor__image-dropdown">
      {items.map((item) => (
        <button
          key={item.id}
          className="pages-editor__image-btn"
          onMouseDown={(e) => {
            e.preventDefault();
            onSelect(item.id);
          }}
          title={item.sublabel ? `${item.label}\n${item.sublabel}` : item.label}
        >
          <img src={item.imagePath} alt={item.label} />
        </button>
      ))}
    </div>
  </DropdownPicker>
);

// ── SnippetPicker ─────────────────────────────────────────────────────────────

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
}) => (
  <DropdownPicker
    containerClass="pages-editor__snippet-picker"
    toggleContent={toggleLabel}
    toggleClass="pages-editor__toolbar-btn"
    title={title}
  >
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
          }}
        >
          {item.label}
        </button>
      ))}
    </div>
  </DropdownPicker>
);
