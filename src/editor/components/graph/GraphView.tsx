import React, { useCallback, useEffect, useRef } from "react";
import mermaid from "mermaid";
import type { EditorParagraph } from "../../context/editorTypes";
import "./GraphView.css";

let mermaidReady = false;
let graphCounter = 0;

// Module-level ref - only one GraphView is ever mounted at a time
let currentNavigate: ((id: string) => void) | null = null;

declare global {
  interface Window {
    // Mermaid calls: __hsGraphNavigate(nodeId) where nodeId = "p{paragraphId}"
    __hsGraphNavigate?: (nodeId: string) => void;
  }
}

if (typeof window !== "undefined") {
  window.__hsGraphNavigate = (nodeId: string) => {
    const paragraphId = nodeId.replace(/^p/, "");
    currentNavigate?.(paragraphId);
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

function buildDefinition(
  paragraphs: EditorParagraph[],
  activeId?: string,
): string {
  if (paragraphs.length === 0) {
    return 'graph LR\n  empty["Brak paragraf\u00f3w"]';
  }

  const lines: string[] = ["graph LR"];
  const knownIds = new Set(paragraphs.map((p) => p.id));
  const extraIds = new Set<string>();

  for (const p of paragraphs) {
    for (const c of p.choices ?? []) {
      if (c.nextParagraphId && !knownIds.has(c.nextParagraphId)) {
        extraIds.add(c.nextParagraphId);
      }
    }
  }

  for (const p of paragraphs) {
    const label =
      activeId === p.id ? `"\u00a7${p.id} \u25ba"` : `"\u00a7${p.id}"`;
    lines.push(`  p${p.id}[${label}]`);
    lines.push(`  click p${p.id} __hsGraphNavigate`);
  }

  for (const id of extraIds) {
    lines.push(`  p${id}["\u00a7${id} ?"]`);
  }

  for (const p of paragraphs) {
    const seenTargets = new Set<string>();
    for (const c of p.choices ?? []) {
      if (!c.nextParagraphId) continue;
      if (seenTargets.has(c.nextParagraphId)) continue;
      seenTargets.add(c.nextParagraphId);
      lines.push(`  p${p.id} --> p${c.nextParagraphId}`);
    }
  }

  return lines.join("\n");
}

interface GraphViewProps {
  paragraphs: EditorParagraph[];
  activeParagraphId?: string;
  onNavigate: (id: string) => void;
}

export const GraphView: React.FC<GraphViewProps> = ({
  paragraphs,
  activeParagraphId,
  onNavigate,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const onNavigateRef = useRef(onNavigate);
  onNavigateRef.current = onNavigate;

  useEffect(() => {
    currentNavigate = (id) => onNavigateRef.current(id);
    return () => {
      currentNavigate = null;
    };
  }, []);

  const renderGraph = useCallback(async () => {
    if (!containerRef.current) return;
    ensureMermaid();
    const definition = buildDefinition(paragraphs, activeParagraphId);
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
  }, [paragraphs, activeParagraphId]);

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
