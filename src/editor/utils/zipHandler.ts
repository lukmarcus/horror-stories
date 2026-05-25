import type {
  EditorScenario,
  EditorParagraph,
  EditorChoice,
} from "../context/editorTypes";

const FILE_EXTENSION = ".horrorstory";

export function buildAccessibleFrom(
  paragraphs: EditorParagraph[],
): Record<string, string[]> {
  const map: Record<string, string[]> = {};
  for (const p of paragraphs) {
    // Choices from simple paragraphs
    for (const choice of p.choices ?? []) {
      if (!choice.nextParagraphId) continue;
      if (!map[choice.nextParagraphId]) map[choice.nextParagraphId] = [];
      if (!map[choice.nextParagraphId].includes(p.id)) {
        map[choice.nextParagraphId].push(p.id);
      }
    }
    // Choices from variant paragraphs (variant selectors don't link to paragraphs,
    // but variant choices may link to paragraphs via nextParagraphId)
    for (const variant of Object.values(p.variants ?? {})) {
      for (const choice of variant.choices ?? []) {
        if (!choice.nextParagraphId) continue;
        if (!map[choice.nextParagraphId]) map[choice.nextParagraphId] = [];
        if (!map[choice.nextParagraphId].includes(p.id)) {
          map[choice.nextParagraphId].push(p.id);
        }
      }
    }
  }
  return map;
}

/** Strip editor-only `id` field from choices and remove undefined-valued keys. */
function exportChoice(c: EditorChoice): Record<string, unknown> {
  const out: Record<string, unknown> = { text: c.text };
  if (c.nextParagraphId !== undefined && c.nextParagraphId !== "")
    out.nextParagraphId = c.nextParagraphId;
  if (c.nextVariantId !== undefined && c.nextVariantId !== "")
    out.nextVariantId = c.nextVariantId;
  return out;
}

export async function exportToZip(scenario: EditorScenario): Promise<void> {
  const JSZip = (await import("jszip")).default;
  const zip = new JSZip();

  const paragraphs = scenario.paragraphs ?? [];
  const accessibleFrom = buildAccessibleFrom(paragraphs);

  const sortedParagraphs = [...paragraphs].sort((a, b) => {
    const na = parseInt(a.id, 10);
    const nb = parseInt(b.id, 10);
    if (!isNaN(na) && !isNaN(nb)) return na - nb;
    return a.id.localeCompare(b.id);
  });

  const paragraphsExported = sortedParagraphs.map((p) => {
    const sources = accessibleFrom[p.id];
    const accessibleFromEntry =
      sources && sources.length > 0 ? { accessibleFrom: sources } : {};

    // ── Prosty (simple) paragraph ──
    if (!p.variants) {
      const cleanChoices = (p.choices ?? []).map(exportChoice);
      return {
        id: p.id,
        ...(p.text !== undefined ? { text: p.text } : {}),
        ...(p.pages !== undefined ? { pages: p.pages } : {}),
        ...(cleanChoices.length > 0 ? { choices: cleanChoices } : {}),
        ...accessibleFromEntry,
      };
    }

    // ── Wariantowy (variant) paragraph ──
    const selectorChoices = (p.variantSelectors ?? []).map(exportChoice);

    const exportedVariants: Record<string, unknown> = {};
    for (const [vid, variant] of Object.entries(p.variants)) {
      const variantChoices = (variant.choices ?? []).map(exportChoice);
      exportedVariants[vid] = {
        ...(variant.pages !== undefined ? { contentPages: variant.pages } : {}),
        ...(variant.areChoicesHorizontal ? { areChoicesHorizontal: true } : {}),
        ...(variantChoices.length > 0 ? { choices: variantChoices } : {}),
      };
    }

    return {
      id: p.id,
      ...(p.pages !== undefined && p.pages.length > 0
        ? { pages: p.pages }
        : {}),
      ...(selectorChoices.length > 0 ? { choices: selectorChoices } : {}),
      variants: exportedVariants,
      ...accessibleFromEntry,
    };
  });

  zip.file("meta.json", JSON.stringify(scenario.meta, null, 2));
  zip.file(
    "paragraphs.json",
    JSON.stringify({ paragraphs: paragraphsExported }, null, 2),
  );

  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const filename = (scenario.meta.title || "scenariusz").replace(
    /[^a-z0-9\-_]/gi,
    "-",
  );
  a.href = url;
  a.download = `${filename}${FILE_EXTENSION}`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function importFromZip(file: File): Promise<EditorScenario> {
  const JSZip = (await import("jszip")).default;
  const zip = await JSZip.loadAsync(file);

  const metaFile = zip.file("meta.json");
  if (!metaFile) throw new Error("Plik nie zawiera meta.json");

  const metaText = await metaFile.async("text");
  const meta = JSON.parse(metaText);

  if (!meta.id || !meta.title) {
    throw new Error("Nieprawidłowy format meta.json — brak id lub title");
  }

  let paragraphs: EditorScenario["paragraphs"] = [];
  const paragraphsFile = zip.file("paragraphs.json");
  if (paragraphsFile) {
    const raw = JSON.parse(await paragraphsFile.async("text"));
    if (Array.isArray(raw.paragraphs)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      paragraphs = raw.paragraphs.map((p: any) => {
        const addId = (c: Record<string, unknown>) => ({
          id: crypto.randomUUID(),
          text: String(c.text ?? ""),
          ...(c.nextParagraphId !== undefined
            ? { nextParagraphId: String(c.nextParagraphId) }
            : {}),
          ...(c.nextVariantId !== undefined
            ? { nextVariantId: String(c.nextVariantId) }
            : {}),
        });

        if (p.variants && typeof p.variants === "object") {
          // Variant paragraph: choices → variantSelectors, variants: contentPages → pages
          const variantSelectors = (p.choices ?? []).map(addId);
          const variants: Record<string, unknown> = {};
          for (const [vid, v] of Object.entries(
            p.variants as Record<string, any>,
          )) {
            variants[vid] = {
              pages: v.contentPages ?? [[]],
              ...(v.areChoicesHorizontal ? { areChoicesHorizontal: true } : {}),
              choices: (v.choices ?? []).map(addId),
            };
          }
          return {
            id: String(p.id),
            ...(Array.isArray(p.pages) ? { pages: p.pages } : {}),
            variantSelectors,
            variants,
            ...(Array.isArray(p.accessibleFrom)
              ? { accessibleFrom: p.accessibleFrom }
              : {}),
          };
        }

        // Simple paragraph
        const choices = (p.choices ?? []).map(addId);
        return {
          id: String(p.id),
          ...(p.text !== undefined ? { text: String(p.text) } : {}),
          ...(Array.isArray(p.pages) ? { pages: p.pages } : {}),
          ...(choices.length > 0 ? { choices } : {}),
          ...(Array.isArray(p.accessibleFrom)
            ? { accessibleFrom: p.accessibleFrom }
            : {}),
        };
      });
    }
  }

  return { meta, paragraphs };
}
