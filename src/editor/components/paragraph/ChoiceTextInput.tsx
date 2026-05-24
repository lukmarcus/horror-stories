import React, { useRef } from "react";
import {
  ColorPicker,
  ImagePicker,
  SnippetPicker,
  SPAN_SNIPPETS,
  SYMBOL_PICKER_ITEMS,
  ROOM_PICKER_ITEMS,
  PERSON_PICKER_ITEMS,
  ENEMY_PICKER_ITEMS,
  STORY_PICKER_ITEMS,
  STATUS_PICKER_ITEMS,
  LETTER_PICKER_ITEMS,
  RANDOM_PICKER_ITEMS,
} from "./EditorInlineTools";
import "./PagesEditor.css";
import "./ChoiceTextInput.css";

interface ChoiceTextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const ChoiceTextInput: React.FC<ChoiceTextInputProps> = ({
  value,
  onChange,
  placeholder,
  onKeyDown,
}) => {
  const ref = useRef<HTMLInputElement>(null);

  const insertAtCursor = (snippet: string) => {
    const el = ref.current;
    if (!el) return;
    const pos = el.selectionStart ?? value.length;
    const end = el.selectionEnd ?? pos;
    onChange(value.slice(0, pos) + snippet + value.slice(end));
    requestAnimationFrame(() => {
      el.focus();
      el.selectionStart = el.selectionEnd = pos + snippet.length;
    });
  };

  const wrap = (before: string, after: string) => {
    const el = ref.current;
    if (!el) return;
    const s = el.selectionStart ?? 0;
    const e = el.selectionEnd ?? 0;
    const sel = value.slice(s, e);
    onChange(value.slice(0, s) + before + sel + after + value.slice(e));
    requestAnimationFrame(() => {
      el.focus();
      el.selectionStart = s + before.length;
      el.selectionEnd = e + before.length;
    });
  };

  const insertSnippet = (snippet: string, cursorFromEnd?: number) => {
    const el = ref.current;
    if (!el) return;
    const pos = el.selectionStart ?? value.length;
    onChange(value.slice(0, pos) + snippet + value.slice(pos));
    const cursorPos =
      cursorFromEnd != null
        ? pos + snippet.length - cursorFromEnd
        : pos + snippet.length;
    requestAnimationFrame(() => {
      el.focus();
      el.selectionStart = el.selectionEnd = cursorPos;
    });
  };

  return (
    <div className="choice-text-input">
      <div className="choice-text-input__toolbar pages-editor__toolbar">
        <div className="pages-editor__toolbar-group">
          <button
            className="pages-editor__toolbar-btn"
            onMouseDown={(e) => {
              e.preventDefault();
              wrap("<b>", "</b>");
            }}
            title="Pogrubienie"
          >
            <b>B</b>
          </button>
          <button
            className="pages-editor__toolbar-btn"
            onMouseDown={(e) => {
              e.preventDefault();
              wrap("<em>", "</em>");
            }}
            title="Kursywa"
          >
            <em>I</em>
          </button>
          <button
            className="pages-editor__toolbar-btn"
            onMouseDown={(e) => {
              e.preventDefault();
              wrap("<u>", "</u>");
            }}
            title="Podkreślenie"
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
      <input
        ref={ref}
        className="choice-text-input__field"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
      />
    </div>
  );
};
