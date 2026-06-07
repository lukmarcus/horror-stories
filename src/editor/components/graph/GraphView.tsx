import React, { useCallback, useEffect, useRef } from "react";
import mermaid from "mermaid";
import type { EditorParagraph, EditorLetter } from "../../context/editorTypes";
import { buildDefinition } from "./graphDefinition";
import "./GraphView.css";

let mermaidReady = false;
let graphCounter = 0;

// Module-level refs - only one GraphView is ever mounted at a time
let currentNavigate: ((id: string) => void) | null = null;
let currentNavigateToLetters: (() => void) | null = null;

declare global {
  interface Window {
    // Mermaid calls: __hsGraphNavigate(nodeId) where nodeId = "p{paragraphId}"
    __hsGraphNavigate?: (nodeId: string) => void;
    __hsGraphNavigateLetter?: (nodeId: string) => void;
  }
}

if (typeof window !== "undefined") {
  window.__hsGraphNavigate = (nodeId: string) => {
    const paragraphId = nodeId.replace(/^p/, "");
    currentNavigate?.(paragraphId);
  };
  window.__hsGraphNavigateLetter = (_nodeId: string) => {
    currentNavigateToLetters?.();
  };
}

function ensureMermaid() {
  if (mermaidReady) return;
  mermaid.initialize({
    startOnLoad: false,
    theme: "dark",
    securityLevel: "loose",
  });
  mermaidReady = true;
}

interface GraphViewProps {
  paragraphs: EditorParagraph[];
  letters?: EditorLetter[];
  activeParagraphId?: string;
  onNavigate: (id: string) => void;
  onNavigateToLetters?: () => void;
}

export const GraphView: React.FC<GraphViewProps> = ({
  paragraphs,
  letters,
  activeParagraphId,
  onNavigate,
  onNavigateToLetters,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const onNavigateRef = useRef(onNavigate);
  onNavigateRef.current = onNavigate;
  const onNavigateToLettersRef = useRef(onNavigateToLetters);
  onNavigateToLettersRef.current = onNavigateToLetters;

  useEffect(() => {
    currentNavigate = (id) => onNavigateRef.current(id);
    currentNavigateToLetters = () => onNavigateToLettersRef.current?.();
    return () => {
      currentNavigate = null;
      currentNavigateToLetters = null;
    };
  }, []);

  const renderGraph = useCallback(async () => {
    if (!containerRef.current) return;
    ensureMermaid();
    const definition = buildDefinition(paragraphs, activeParagraphId, letters);
    const renderId = `hs-render-${++graphCounter}`;
    try {
      const { svg, bindFunctions } = await mermaid.render(renderId, definition);
      if (!containerRef.current) return;
      containerRef.current.innerHTML = svg;
      bindFunctions?.(containerRef.current);
    } catch (err) {
      console.error("[GraphView] mermaid render error:", err);
      if (containerRef.current) {
        containerRef.current.innerHTML =
          '<p class="graph-view__error">Błąd renderowania grafu.</p>';
      }
    }
  }, [paragraphs, activeParagraphId, letters]);

  useEffect(() => {
    void renderGraph();
  }, [renderGraph]);

  return (
    <div className="graph-view">
      <div className="graph-view__header">
        <h2 className="graph-view__title">Graf połączeń</h2>
        <p className="graph-view__hint">
          Kliknij paragraf, aby przejść do jego edycji.
        </p>
      </div>
      {paragraphs.length === 0 ? (
        <p className="graph-view__empty">Dodaj paragrafy, aby zobaczyć graf.</p>
      ) : (
        <div className="graph-view__container" ref={containerRef} />
      )}
    </div>
  );
};
