import React, { useState } from "react";
import { useEditor } from "../context/useEditor";
import { exportToZip, importFromZip } from "../utils/zipHandler";
import { clearStorage } from "../utils/editorStorage";
import { ScenarioMetaForm } from "../components/scenario/ScenarioMetaForm";
import { useMetaErrors } from "../components/scenario/scenarioMetaValidation";
import { EditorParagraphView } from "../components/paragraph/EditorParagraphView";
import { GraphView } from "../components/graph/GraphView";
import { ImagesPanel } from "./ImagesPanel";
import { LettersEditor } from "../components/layout/LettersEditor";
import { SetupEditor } from "../components/layout/SetupEditor";
import "./EditorHome.css";

interface EditorHomeProps {
  activeSection: "meta" | string;
  onSectionChange: (section: "meta" | string) => void;
}

export const EditorHome: React.FC<EditorHomeProps> = ({
  activeSection,
  onSectionChange,
}) => {
  const { state, dispatch } = useEditor();
  const [error, setError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [confirmNew, setConfirmNew] = useState(false);
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const metaErrors = useMetaErrors();
  const hasErrors = Object.keys(metaErrors).length > 0;

  const handleNew = () => {
    if (state.scenario) {
      setConfirmNew(true);
      return;
    }
    dispatch({ type: "NEW_SCENARIO" });
    setError(null);
  };

  const handleNewConfirm = () => {
    setConfirmNew(false);
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
      onSectionChange("meta");
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Błąd podczas wczytywania pliku.",
      );
    } finally {
      setImporting(false);
      e.target.value = "";
    }
  };

  const handleDiscard = () => {
    setConfirmDiscard(true);
  };

  const handleDiscardConfirm = async () => {
    setConfirmDiscard(false);
    await clearStorage();
    dispatch({ type: "LOAD_SCENARIO", payload: null });
    window.location.reload();
  };

  // Resolve alias IDs to their primary paragraph ID before navigating
  const handleNavigate = (id: string) => {
    const primary = state.scenario?.paragraphs.find((p) =>
      (p.aliases ?? []).includes(id),
    );
    onSectionChange(primary ? primary.id : id);
  };

  return (
    <div className="editor-home">
      <div className="editor-home__toolbar">
        {confirmNew ? (
          <span className="editor-home__inline-confirm">
            <span>Na pewno? Utracisz bierzący scenariusz.</span>
            <button
              className="editor-btn editor-btn--danger"
              onClick={handleNewConfirm}
            >
              Tak
            </button>
            <button className="editor-btn" onClick={() => setConfirmNew(false)}>
              Anuluj
            </button>
          </span>
        ) : (
          <button className="editor-btn" onClick={handleNew}>
            + Nowy scenariusz
          </button>
        )}
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
        {state.scenario &&
          (confirmDiscard ? (
            <span className="editor-home__inline-confirm">
              <span>Na pewno usunąć szkic?</span>
              <button
                className="editor-btn editor-btn--danger"
                onClick={handleDiscardConfirm}
              >
                Tak
              </button>
              <button
                className="editor-btn"
                onClick={() => setConfirmDiscard(false)}
              >
                Anuluj
              </button>
            </span>
          ) : (
            <button
              className="editor-btn editor-btn--danger"
              onClick={handleDiscard}
            >
              Usuń szkic
            </button>
          ))}
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
      {state.scenario && activeSection === "graph" && (
        <GraphView
          paragraphs={state.scenario.paragraphs}
          letters={state.scenario.letters}
          onNavigate={handleNavigate}
          onNavigateToLetters={() => onSectionChange("letters")}
        />
      )}
      {state.scenario && activeSection === "images" && <ImagesPanel />}
      {state.scenario && activeSection === "letters" && <LettersEditor />}
      {state.scenario && activeSection === "setup" && <SetupEditor />}
      {state.scenario &&
        activeSection !== "meta" &&
        activeSection !== "graph" &&
        activeSection !== "images" &&
        activeSection !== "letters" &&
        activeSection !== "setup" && (
          <EditorParagraphView
            paragraphId={activeSection}
            onNavigate={handleNavigate}
            onNavigateToLetters={() => onSectionChange("letters")}
            onRemove={(id) => {
              dispatch({ type: "REMOVE_PARAGRAPH", payload: id });
              onSectionChange("meta");
            }}
          />
        )}
    </div>
  );
};
