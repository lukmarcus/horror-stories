import React from "react";
import type { ContentBlock } from "../../../types";
import { useEditor } from "../../context/useEditor";
import "./PagesEditor.css";

interface PagesEditorProps {
  paragraphId: string;
  pages: ContentBlock[][];
}

export const PagesEditor: React.FC<PagesEditorProps> = ({
  paragraphId,
  pages,
}) => {
  const { dispatch } = useEditor();

  const handleAddPage = () => {
    dispatch({ type: "ADD_PAGE", payload: { paragraphId } });
  };

  const handleRemovePage = (pageIndex: number) => {
    dispatch({ type: "REMOVE_PAGE", payload: { paragraphId, pageIndex } });
  };

  const handleAddBlock = (pageIndex: number) => {
    dispatch({
      type: "ADD_BLOCK",
      payload: { paragraphId, pageIndex, block: { type: "text", text: "" } },
    });
  };

  const handleUpdateBlock = (
    pageIndex: number,
    blockIndex: number,
    block: ContentBlock,
  ) => {
    dispatch({
      type: "UPDATE_BLOCK",
      payload: { paragraphId, pageIndex, blockIndex, block },
    });
  };

  const handleRemoveBlock = (pageIndex: number, blockIndex: number) => {
    dispatch({
      type: "REMOVE_BLOCK",
      payload: { paragraphId, pageIndex, blockIndex },
    });
  };

  return (
    <div className="pages-editor">
      {pages.map((page, pageIndex) => (
        <div key={pageIndex} className="pages-editor__page">
          <div className="pages-editor__page-header">
            <span className="pages-editor__page-label">
              {pages.length > 1 ? `Strona ${pageIndex + 1}` : "Treść"}
            </span>
            {pages.length > 1 && (
              <button
                className="pages-editor__page-remove"
                onClick={() => handleRemovePage(pageIndex)}
                title={`Usuń stronę ${pageIndex + 1}`}
              >
                Usuń stronę
              </button>
            )}
          </div>

          <div className="pages-editor__blocks">
            {page.length === 0 && (
              <p className="pages-editor__blocks-empty">Strona jest pusta</p>
            )}
            {page.map((block, blockIndex) => (
              <BlockRow
                key={blockIndex}
                block={block}
                onChange={(b) => handleUpdateBlock(pageIndex, blockIndex, b)}
                onRemove={() => handleRemoveBlock(pageIndex, blockIndex)}
              />
            ))}
          </div>

          <button
            className="pages-editor__add-block"
            onClick={() => handleAddBlock(pageIndex)}
          >
            + Dodaj blok tekstu
          </button>
        </div>
      ))}

      <button className="pages-editor__add-page" onClick={handleAddPage}>
        + Dodaj stronę
      </button>
    </div>
  );
};

interface BlockRowProps {
  block: ContentBlock;
  onChange: (block: ContentBlock) => void;
  onRemove: () => void;
}

const BlockRow: React.FC<BlockRowProps> = ({ block, onChange, onRemove }) => {
  const type = block.type ?? "text";

  return (
    <div className="pages-editor__block-row">
      <select
        className="pages-editor__block-type"
        value={type}
        onChange={(e) =>
          onChange({ type: e.target.value as ContentBlock["type"] })
        }
        title="Typ bloku"
      >
        <option value="text">Tekst</option>
        <option value="image">Obraz</option>
        <option value="letter">Litera</option>
        <option value="item">Przedmiot</option>
      </select>

      {type === "text" && <TextBlockFields block={block} onChange={onChange} />}
      {type === "image" && (
        <ImageBlockFields block={block} onChange={onChange} />
      )}
      {(type === "letter" || type === "item") && (
        <IdBlockFields block={block} onChange={onChange} />
      )}

      <button
        className="pages-editor__block-remove"
        onClick={onRemove}
        title="Usuń blok"
      >
        ✕
      </button>
    </div>
  );
};

const TextBlockFields: React.FC<{
  block: ContentBlock;
  onChange: (b: ContentBlock) => void;
}> = ({ block, onChange }) => (
  <>
    <textarea
      className="pages-editor__block-text"
      value={block.text ?? ""}
      onChange={(e) => onChange({ ...block, text: e.target.value })}
      placeholder="Treść akapitu…"
      rows={2}
    />
    <select
      className="pages-editor__block-style"
      value={block.style ?? ""}
      onChange={(e) =>
        onChange({
          ...block,
          style: (e.target.value as ContentBlock["style"]) || undefined,
        })
      }
      title="Styl"
    >
      <option value="">zwykły</option>
      <option value="bold">bold</option>
      <option value="italic">italic</option>
      <option value="underline">underline</option>
    </select>
    <select
      className="pages-editor__block-color"
      value={block.color ?? ""}
      onChange={(e) =>
        onChange({
          ...block,
          color: (e.target.value as ContentBlock["color"]) || undefined,
        })
      }
      title="Kolor"
    >
      <option value="">brak</option>
      <option value="yellow">żółty</option>
      <option value="red">czerwony</option>
      <option value="purple">fioletowy</option>
      <option value="green">zielony</option>
    </select>
  </>
);

const ImageBlockFields: React.FC<{
  block: ContentBlock;
  onChange: (b: ContentBlock) => void;
}> = ({ block, onChange }) => (
  <>
    <input
      className="pages-editor__block-input"
      type="text"
      value={block.image ?? ""}
      onChange={(e) => onChange({ ...block, image: e.target.value })}
      placeholder="Ścieżka do obrazu…"
    />
    <select
      className="pages-editor__block-style"
      value={block.size ?? ""}
      onChange={(e) =>
        onChange({
          ...block,
          size: (e.target.value as ContentBlock["size"]) || undefined,
        })
      }
      title="Rozmiar"
    >
      <option value="">domyślny</option>
      <option value="xs">xs</option>
      <option value="sm">sm</option>
      <option value="lg">lg</option>
      <option value="xl">xl</option>
    </select>
  </>
);

const IdBlockFields: React.FC<{
  block: ContentBlock;
  onChange: (b: ContentBlock) => void;
}> = ({ block, onChange }) => (
  <input
    className="pages-editor__block-input"
    type="text"
    value={block.id ?? ""}
    onChange={(e) => onChange({ ...block, id: e.target.value })}
    placeholder="ID…"
  />
);
