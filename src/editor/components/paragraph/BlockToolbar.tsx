import React from "react";
import { ColorPicker } from "./EditorInlineTools";
import { SIZES, type SizeName, type BlockOpts } from "./pageSerializer";

export interface BlockToolbarProps {
  activeOpts: BlockOpts;
  onToggleStyle: (tag: "b" | "i" | "u") => void;
  onSetColor: (color: string) => void;
  onSetSize: (size: string) => void;
  onClear: () => void;
}

const btn = (active: boolean) =>
  `pages-editor__toolbar-btn${active ? " pages-editor__toolbar-btn--active" : ""}`;

export const BlockToolbar: React.FC<BlockToolbarProps> = ({
  activeOpts,
  onToggleStyle,
  onSetColor,
  onSetSize,
  onClear,
}) => (
  <div className="pages-editor__toolbar pages-editor__toolbar--block">
    <span className="pages-editor__toolbar-label">Akapit:</span>
    <div className="pages-editor__toolbar-group">
      <button
        className={btn(activeOpts.styles.has("b"))}
        onMouseDown={(e) => {
          e.preventDefault();
          onToggleStyle("b");
        }}
        title="Pogrubienie całego akapitu"
      >
        <b>B</b>
      </button>
      <button
        className={btn(activeOpts.styles.has("i"))}
        onMouseDown={(e) => {
          e.preventDefault();
          onToggleStyle("i");
        }}
        title="Kursywa całego akapitu"
      >
        <em>I</em>
      </button>
      <button
        className={btn(activeOpts.styles.has("u"))}
        onMouseDown={(e) => {
          e.preventDefault();
          onToggleStyle("u");
        }}
        title="Podkreślenie całego akapitu"
      >
        <u>U</u>
      </button>
    </div>
    <div className="pages-editor__toolbar-sep" />
    <div className="pages-editor__toolbar-group">
      <ColorPicker
        onSelect={onSetColor}
        label="¶A"
        activeColor={activeOpts.color}
      />
    </div>
    <div className="pages-editor__toolbar-sep" />
    <div className="pages-editor__toolbar-group">
      {SIZES.map((s: SizeName) => (
        <button
          key={s}
          className={btn(activeOpts.size === s)}
          onMouseDown={(e) => {
            e.preventDefault();
            onSetSize(s);
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
          onClear();
        }}
        title="Wyczyść styl akapitu"
      >
        ✕
      </button>
    </div>
  </div>
);
