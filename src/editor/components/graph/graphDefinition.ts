import type { EditorParagraph, EditorLetter } from "../../context/editorTypes";

export function buildDefinition(
  paragraphs: EditorParagraph[],
  activeId?: string,
  letters?: EditorLetter[],
): string {
  if (paragraphs.length === 0) {
    return 'graph LR\n  empty["Brak paragrafów"]';
  }

  const lines: string[] = ["graph LR"];
  const knownIds = new Set(paragraphs.map((p) => p.id));
  const extraIds = new Set<string>();

  // Build paragraphId → letter map
  const letterByParagraph: Record<string, string> = {};
  for (const l of letters ?? []) {
    letterByParagraph[l.paragraphId] = l.id;
  }

  for (const p of paragraphs) {
    for (const c of p.choices ?? []) {
      if (c.nextParagraphId && !knownIds.has(c.nextParagraphId)) {
        extraIds.add(c.nextParagraphId);
      }
    }
    for (const variant of Object.values(p.variants ?? {})) {
      for (const c of variant.choices ?? []) {
        if (c.nextParagraphId && !knownIds.has(c.nextParagraphId)) {
          extraIds.add(c.nextParagraphId);
        }
      }
    }
  }

  for (const p of paragraphs) {
    const letter = letterByParagraph[p.id];
    const letterTag = letter ? ` [${letter}]` : "";
    const label =
      activeId === p.id ? `"§${p.id}${letterTag} ►"` : `"§${p.id}${letterTag}"`;
    lines.push(`  p${p.id}[${label}]`);
    lines.push(`  click p${p.id} __hsGraphNavigate`);
  }

  for (const id of extraIds) {
    lines.push(`  p${id}["§${id} ?"]`);
  }

  for (const p of paragraphs) {
    const seenTargets = new Set<string>();
    for (const c of p.choices ?? []) {
      if (!c.nextParagraphId) continue;
      if (seenTargets.has(c.nextParagraphId)) continue;
      seenTargets.add(c.nextParagraphId);
      lines.push(`  p${p.id} --> p${c.nextParagraphId}`);
    }
    for (const variant of Object.values(p.variants ?? {})) {
      for (const c of variant.choices ?? []) {
        if (!c.nextParagraphId) continue;
        if (seenTargets.has(c.nextParagraphId)) continue;
        seenTargets.add(c.nextParagraphId);
        lines.push(`  p${p.id} -.-> p${c.nextParagraphId}`);
      }
    }
  }

  return lines.join("\n");
}
