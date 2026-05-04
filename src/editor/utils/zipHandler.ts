import type { EditorScenario, EditorParagraph } from "../context/editorTypes";

const FILE_EXTENSION = ".horrorstory";

function buildAccessibleFrom(
  paragraphs: EditorParagraph[],
): Record<string, string[]> {
  const map: Record<string, string[]> = {};
  for (const p of paragraphs) {
    for (const choice of p.choices ?? []) {
      if (!choice.nextParagraphId) continue;
      if (!map[choice.nextParagraphId]) map[choice.nextParagraphId] = [];
      if (!map[choice.nextParagraphId].includes(p.id)) {
        map[choice.nextParagraphId].push(p.id);
      }
    }
  }
  return map;
}

export async function exportToZip(scenario: EditorScenario): Promise<void> {
  const JSZip = (await import("jszip")).default;
  const zip = new JSZip();

  const paragraphs = scenario.paragraphs ?? [];
  const accessibleFrom = buildAccessibleFrom(paragraphs);
  const paragraphsWithAccessible = paragraphs.map((p) => {
    const sources = accessibleFrom[p.id];
    return sources && sources.length > 0
      ? { ...p, accessibleFrom: sources }
      : p;
  });

  zip.file("meta.json", JSON.stringify(scenario.meta, null, 2));
  zip.file(
    "paragraphs.json",
    JSON.stringify({ paragraphs: paragraphsWithAccessible }, null, 2),
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
    if (Array.isArray(raw.paragraphs)) paragraphs = raw.paragraphs;
  }

  return { meta, paragraphs };
}
