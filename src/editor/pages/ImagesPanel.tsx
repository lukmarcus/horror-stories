import React, { useRef, useState } from "react";
import { useEditor } from "../context/useEditor";
import "./ImagesPanel.css";

const MAX_IMAGES = 32;
const MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB
const ACCEPTED_TYPES = ["image/jpeg", "image/png"];

function slugify(filename: string): string {
  const base = filename.replace(/\.[^.]+$/, "");
  return (
    base
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "image"
  );
}

function uniqueId(base: string, existing: Set<string>): string {
  if (!existing.has(base)) return base;
  let i = 2;
  while (existing.has(`${base}-${i}`)) i++;
  return `${base}-${i}`;
}

export const ImagesPanel: React.FC = () => {
  const { state, dispatch } = useEditor();
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const images = state.scenario?.images ?? {};
  const entries = Object.entries(images);
  const count = entries.length;
  const atLimit = count >= MAX_IMAGES;

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const existing = new Set(Object.keys(images));
    let newCount = count;

    Array.from(files).forEach((file) => {
      if (newCount >= MAX_IMAGES) {
        setError(`Osiągnięto limit ${MAX_IMAGES} grafik.`);
        return;
      }
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError(
          `Nieobsługiwany format: ${file.name}. Dopuszczalne: JPG, PNG.`,
        );
        return;
      }
      if (file.size > MAX_SIZE_BYTES) {
        setError(`Plik ${file.name} przekracza limit 2 MB.`);
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        const data = ev.target?.result as string;
        const id = uniqueId(slugify(file.name), existing);
        existing.add(id);
        newCount++;
        dispatch({ type: "ADD_IMAGE", payload: { id, data } });
        setError(null);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    e.target.value = "";
  };

  const handleRemove = (id: string) => {
    if (!window.confirm(`Usunąć grafikę „${id}"?`)) return;
    dispatch({ type: "REMOVE_IMAGE", payload: id });
  };

  return (
    <div className="images-panel">
      <div className="images-panel__header">
        <h2 className="images-panel__title">Grafiki scenariusza</h2>
        <div className="images-panel__header-right">
          <span className="images-panel__count">
            {count} / {MAX_IMAGES}
          </span>
          <button
            className="editor-btn editor-btn--primary"
            onClick={() => inputRef.current?.click()}
            disabled={atLimit}
            title={
              atLimit
                ? `Osiągnięto limit ${MAX_IMAGES} grafik`
                : "Dodaj grafikę (JPG, PNG, max 2 MB)"
            }
          >
            + Dodaj
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png"
            multiple
            style={{ display: "none" }}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {error && <p className="images-panel__error">{error}</p>}

      {count === 0 ? (
        <div className="images-panel__empty">
          <p>Brak grafik. Kliknij „+ Dodaj", aby przesłać pliki JPG lub PNG.</p>
          <p className="images-panel__hint">
            Wstaw grafikę w paragrafie jako blok: <code>[img: id]</code> lub
            inline: <code>&lt;image id="id"/&gt;</code>
          </p>
        </div>
      ) : (
        <div className="images-panel__grid">
          {entries.map(([id, data]) => (
            <div key={id} className="images-panel__item">
              <div className="images-panel__thumb-wrap">
                <img src={data} alt={id} className="images-panel__thumb" />
              </div>
              <span className="images-panel__id" title={id}>
                {id}
              </span>
              <button
                className="images-panel__remove"
                onClick={() => handleRemove(id)}
                title={`Usuń ${id}`}
              >
                Usuń
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
