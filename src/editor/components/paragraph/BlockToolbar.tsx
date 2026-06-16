import React from "react";
import { ColorPicker, ImagePicker } from "./EditorInlineTools";
import type { ImagePickerItem } from "./EditorInlineTools";
import { useEditor } from "../../context/useEditor";
import { SIZES, type SizeName, type BlockOpts } from "./pageSerializer";

export interface BlockToolbarProps {
  activeOpts: BlockOpts;
  onToggleStyle: (tag: "b" | "i" | "u") => void;
  onSetColor: (color: string) => void;
  onSetSize: (size: string) => void;
  onToggleSpacing: () => void;
  onClear: () => void;
  onInsertBlockImage?: (id: string) => void;
}

const btn = (active: boolean) =>
  `pages-editor__toolbar-btn${active ? " pages-editor__toolbar-btn--active" : ""}`;

export const BlockToolbar: React.FC<BlockToolbarProps> = ({
  activeOpts,
  onToggleStyle,
  onSetColor,
  onSetSize,
  onToggleSpacing,
  onClear,
  onInsertBlockImage,
}) => {
  const { state } = useEditor();
  const scenarioImageItems: ImagePickerItem[] = Object.entries(
    state.scenario?.images ?? {},
  ).map(([id, data]) => ({ id, label: id, imagePath: data }));

  return (
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
          className={btn(activeOpts.spacing === "none")}
          onMouseDown={(e) => {
            e.preventDefault();
            onToggleSpacing();
          }}
          title="Bez przerwy względem poprzedniego akapitu"
        >
          ⏶
        </button>
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
      {onInsertBlockImage && scenarioImageItems.length > 0 && (
        <>
          <div className="pages-editor__toolbar-sep" />
          <div className="pages-editor__toolbar-group">
            <ImagePicker
              items={scenarioImageItems}
              onSelect={(id) => onInsertBlockImage(id)}
              toggleContent={
                <span className="pages-editor__picker-icon">🖼️</span>
              }
              title="Wstaw grafikę jako akapit"
            />
          </div>
        </>
      )}
    </div>
  );
};
