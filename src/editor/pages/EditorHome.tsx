import React, { useState } from "react";
import { useEditor } from "../context/useEditor";
import { exportToZip, importFromZip } from "../utils/zipHandler";
import { clearStorage } from "../utils/editorStorage";
import { ScenarioMetaForm } from "../components/scenario/ScenarioMetaForm";
import { useMetaErrors } from "../components/scenario/scenarioMetaValidation";
import "./EditorHome.css";

interface EditorHomeProps {
  activeSection: "meta" | string;
  onSectionChange: (section: "meta" | string) => void;
}

export const EditorHome: React.FC<EditorHomeProps> = ({ activeSection }) => {
  const { state, dispatch } = useEditor();
  const [error, setError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const metaErrors = useMetaErrors();
  const hasErrors = Object.keys(metaErrors).length > 0;

  const handleNew = () => {
    if (
      state.scenario &&
      !window.confirm(
        "Masz niezapisany scenariusz. Stworzyć nowy i utracić zmiany?",
      )
    )
      return;
    dispatch({ type: "NEW_SCENARIO" });
    setError(null);
  };

  const handleExport = async () => {
    if (!state.scenario) return;
    try {
      await exportToZip(state.scenario);
      dispatch({ type: "MARK_SAVED" });
    } catch {
      setError("Błąd podczas eksportu pliku.");
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    setError(null);
    try {
      const loaded = await importFromZip(file);
      dispatch({ type: "LOAD_SCENARIO", payload: loaded });
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Błąd podczas wczytywania pliku.",
      );
    } finally {
      setImporting(false);
      e.target.value = "";
    }
  };

  const handleDiscard = async () => {
    if (!window.confirm("Usunąć zapisany szkic z przeglądarki?")) return;
    await clearStorage();
    dispatch({ type: "LOAD_SCENARIO", payload: null as never });
    window.location.reload();
  };

  return (
    <div className="editor-home">
      <div className="editor-home__toolbar">
        <button className="editor-btn" onClick={handleNew}>
          + Nowy scenariusz
        </button>
        <label className="editor-btn editor-btn--secondary">
          {importing ? "Wczytywanie..." : "Wczytaj plik .horrorstory"}
          <input
            type="file"
            accept=".horrorstory,.zip"
            onChange={handleImport}
            style={{ display: "none" }}
          />
        </label>
        {state.scenario && (
          <button
            className="editor-btn editor-btn--primary"
            onClick={handleExport}
            disabled={hasErrors}
            title={
              hasErrors ? "Popraw błędy w formularzu przed zapisem" : undefined
            }
          >
            Zapisz plik .horrorstory {state.isDirty ? "●" : "✓"}
          </button>
        )}
        {state.scenario && (
          <button
            className="editor-btn editor-btn--danger"
            onClick={handleDiscard}
          >
            Usuń szkic
          </button>
        )}
      </div>

      {error && <p className="editor-home__error">{error}</p>}

      {!state.scenario && (
        <div className="editor-home__empty">
          <p>
            Stwórz nowy scenariusz lub wczytaj istniejący plik{" "}
            <code>.horrorstory</code>.
          </p>
          {/* info o auto-save */}
          <p className="editor-home__hint">
            Jeśli wcześniej pracowałeś nad scenariuszem, szkic zostanie
            automatycznie wczytany przy następnym otwarciu edytora.
          </p>
        </div>
      )}

      {state.scenario && activeSection === "meta" && <ScenarioMetaForm />}
      {state.scenario && activeSection !== "meta" && (
        <div className="editor-home__paragraph-placeholder">
          <h2>§{activeSection}</h2>
          <p className="editor-home__hint">
            Edycja treści paragrafu — dostępna w kolejnej wersji.
          </p>
        </div>
      )}
    </div>
  );
};
