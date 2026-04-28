import type { EditorScenario } from "../context/editorTypes";

const FILE_EXTENSION = ".horrorstory";

export async function exportToZip(scenario: EditorScenario): Promise<void> {
  const JSZip = (await import("jszip")).default;
  const zip = new JSZip();

  zip.file("meta.json", JSON.stringify(scenario.meta, null, 2));
  zip.file("paragraphs.json", JSON.stringify({ paragraphs: [] }, null, 2));

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

  return { meta };
}
