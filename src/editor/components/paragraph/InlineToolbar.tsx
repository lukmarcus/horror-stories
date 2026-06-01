import React from "react";
import { ColorPicker, ImagePicker, SnippetPicker } from "./EditorInlineTools";
import type { ImagePickerItem } from "./EditorInlineTools";
import { useEditor } from "../../context/useEditor";
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
} from "./editorPickerData";

export interface InlineToolbarProps {
  onWrap: (before: string, after: string) => void;
  onInsertAtCursor: (snippet: string) => void;
  onInsertSnippet: (snippet: string, cursorFromEnd?: number) => void;
}

export const InlineToolbar: React.FC<InlineToolbarProps> = ({
  onWrap,
  onInsertAtCursor,
  onInsertSnippet,
}) => {
  const { state } = useEditor();
  const scenarioImages = state.scenario?.images ?? {};
  const scenarioImageItems: ImagePickerItem[] = Object.entries(
    scenarioImages,
  ).map(([id, data]) => ({ id, label: id, imagePath: data }));

  return (
    <div className="pages-editor__toolbar">
      <span className="pages-editor__toolbar-label">Tekst:</span>
      <div className="pages-editor__toolbar-group">
        <button
          className="pages-editor__toolbar-btn"
          onMouseDown={(e) => {
            e.preventDefault();
            onWrap("<b>", "</b>");
          }}
          title="Pogrubienie (zaznaczenie)"
        >
          <b>B</b>
        </button>
        <button
          className="pages-editor__toolbar-btn"
          onMouseDown={(e) => {
            e.preventDefault();
            onWrap("<em>", "</em>");
          }}
          title="Kursywa (zaznaczenie)"
        >
          <em>I</em>
        </button>
        <button
          className="pages-editor__toolbar-btn"
          onMouseDown={(e) => {
            e.preventDefault();
            onWrap("<u>", "</u>");
          }}
          title="Podkreślenie (zaznaczenie)"
        >
          <u>U</u>
        </button>
      </div>
      <div className="pages-editor__toolbar-sep" />
      <div className="pages-editor__toolbar-group">
        <ColorPicker
          onSelect={(c) => onWrap(`<span class='color-${c}'>`, "</span>")}
          title="Kolor zaznaczenia"
        />
        <SnippetPicker
          items={SPAN_SNIPPETS}
          toggleLabel={"</>"}
          title="Wstaw kolorowy span"
          onSelect={onInsertSnippet}
        />
      </div>
      <div className="pages-editor__toolbar-sep" />
      <div className="pages-editor__toolbar-group">
        <ImagePicker
          items={SYMBOL_PICKER_ITEMS}
          onSelect={(id) => onInsertAtCursor(`<symbol id="${id}"/>`)}
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
          onSelect={(id) => onInsertAtCursor(`<room id="${id}"/>`)}
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
          onSelect={(id) => onInsertAtCursor(`<person id="${id}"/>`)}
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
          onSelect={(id) => onInsertAtCursor(`<enemy id="${id}"/>`)}
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
          onSelect={(id) => onInsertAtCursor(`<story id="${id}"/>`)}
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
          onSelect={(id) => onInsertAtCursor(`<status id="${id}"/>`)}
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
          onSelect={(id) => onInsertAtCursor(`<letter id="${id}"/>`)}
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
          onSelect={(id) => onInsertAtCursor(`<random id="${id}"/>`)}
          toggleContent={
            <img
              src={`${import.meta.env.BASE_URL}assets/images/symbols/przedmiot-losowy.png`}
              alt="przedmiot losowy"
              className="pages-editor__picker-icon"
            />
          }
          title="Wstaw przedmiot losowy"
        />
        {scenarioImageItems.length > 0 && (
          <ImagePicker
            items={scenarioImageItems}
            onSelect={(id) => onInsertAtCursor(`<image id="${id}"/>`)}
            toggleContent={
              <span className="pages-editor__picker-icon">🖼️</span>
            }
            title="Wstaw grafikę scenariusza"
          />
        )}
      </div>
    </div>
  );
};
