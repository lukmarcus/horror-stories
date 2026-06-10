import type {
  EditorScenario,
  EditorParagraph,
  EditorChoice,
} from "../context/editorTypes";
import type { Scenario } from "../../types";

const FILE_EXTENSION = ".horrorstory";

function isString(v: unknown): v is string {
  return typeof v === "string";
}

function isNullableNumber(v: unknown): v is number | null {
  return v === null || typeof v === "number";
}

export function isValidScenarioMeta(data: unknown): data is Scenario {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  return (
    isString(d.id) &&
    d.id.length > 0 &&
    isString(d.title) &&
    d.title.length > 0 &&
    isString(d.description) &&
    isNullableNumber(d.minPlayerCount) &&
    isNullableNumber(d.maxPlayerCount) &&
    isNullableNumber(d.duration)
  );
}

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

    const idField: string | string[] =
      (p.aliases ?? []).length > 0 ? [p.id, ...(p.aliases ?? [])] : p.id;

    // ── Prosty (simple) paragraph ──
    if (!p.variants) {
      const cleanChoices = (p.choices ?? []).map(exportChoice);
      return {
        id: idField,
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
      id: idField,
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

  // Pack letters.json if present
  if (scenario.letters && scenario.letters.length > 0) {
    zip.file(
      "letters.json",
      JSON.stringify({ letters: scenario.letters }, null, 2),
    );
  }

  // Pack setup.json if present
  if (scenario.setup) {
    const { pages, choices } = scenario.setup;
    zip.file(
      "setup.json",
      JSON.stringify(
        {
          pages,
          ...(choices && choices.length > 0
            ? { choices: choices.map(exportChoice) }
            : {}),
        },
        null,
        2,
      ),
    );
  }

  // Pack user-uploaded images into images/ folder
  for (const [id, dataUrl] of Object.entries(scenario.images ?? {})) {
    const mimeMatch = dataUrl.match(/^data:([^;]+);base64,/);
    const mimeType = mimeMatch?.[1] ?? "image/jpeg";
    const base64 = dataUrl.replace(/^data:[^;]+;base64,/, "");
    const ext = mimeType === "image/png" ? "png" : "jpg";
    zip.file(`images/${id}.${ext}`, base64, { base64: true });
  }

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

  if (!isValidScenarioMeta(meta)) {
    throw new Error(
      "Nieprawidłowy format meta.json — brak wymaganych pól (id, title, description, playerCount, duration)",
    );
  }

  let paragraphs: EditorScenario["paragraphs"] = [];
  const paragraphsFile = zip.file("paragraphs.json");
  if (paragraphsFile) {
    const raw = JSON.parse(await paragraphsFile.async("text"));
    if (Array.isArray(raw.paragraphs)) {
      paragraphs = (raw.paragraphs as unknown[]).map((p: unknown) => {
        const pObj = p as Record<string, unknown>;
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

        if (pObj.variants && typeof pObj.variants === "object") {
          // Variant paragraph: choices → variantSelectors, variants: contentPages → pages
          const rawId = Array.isArray(pObj.id)
            ? String((pObj.id as unknown[])[0])
            : String(pObj.id);
          const rawAliases = Array.isArray(pObj.id)
            ? (pObj.id as unknown[]).slice(1).map(String)
            : [];
          const variantSelectors = (
            (pObj.choices ?? []) as Record<string, unknown>[]
          ).map(addId);
          const variants: Record<string, unknown> = {};
          for (const [vid, v] of Object.entries(
            pObj.variants as Record<string, Record<string, unknown>>,
          )) {
            variants[vid] = {
              pages: v.contentPages ?? [[]],
              ...(v.areChoicesHorizontal ? { areChoicesHorizontal: true } : {}),
              choices: (Array.isArray(v.choices)
                ? (v.choices as Record<string, unknown>[])
                : []
              ).map(addId),
            };
          }
          return {
            id: rawId,
            ...(rawAliases.length > 0 ? { aliases: rawAliases } : {}),
            ...(Array.isArray(pObj.pages) ? { pages: pObj.pages } : {}),
            variantSelectors,
            variants,
            ...(Array.isArray(pObj.accessibleFrom)
              ? { accessibleFrom: pObj.accessibleFrom }
              : {}),
          };
        }

        // Simple paragraph
        const rawId = Array.isArray(pObj.id)
          ? String((pObj.id as unknown[])[0])
          : String(pObj.id);
        const rawAliases = Array.isArray(pObj.id)
          ? (pObj.id as unknown[]).slice(1).map(String)
          : [];
        const choices = ((pObj.choices ?? []) as Record<string, unknown>[]).map(
          addId,
        );
        return {
          id: rawId,
          ...(rawAliases.length > 0 ? { aliases: rawAliases } : {}),
          ...(pObj.text !== undefined ? { text: String(pObj.text) } : {}),
          ...(Array.isArray(pObj.pages) ? { pages: pObj.pages } : {}),
          ...(choices.length > 0 ? { choices } : {}),
          ...(Array.isArray(pObj.accessibleFrom)
            ? { accessibleFrom: pObj.accessibleFrom }
            : {}),
        };
      }) as EditorScenario["paragraphs"];
    }
  }

  // Unpack user-uploaded images from images/ folder
  const images: Record<string, string> = {};
  const imageFiles = zip.file(/^images\//);
  for (const imageFile of imageFiles) {
    const filename = imageFile.name.replace(/^images\//, "");
    if (!filename) continue;
    const ext = filename.split(".").pop()?.toLowerCase() ?? "jpg";
    const mimeType = ext === "png" ? "image/png" : "image/jpeg";
    const base64 = await imageFile.async("base64");
    const id = filename.replace(/\.[^.]+$/, "");
    images[id] = `data:${mimeType};base64,${base64}`;
  }

  // Load letters.json if present
  let letters: EditorScenario["letters"];
  const lettersFile = zip.file("letters.json");
  if (lettersFile) {
    const parsed = JSON.parse(await lettersFile.async("text"));
    letters = Array.isArray(parsed.letters) ? parsed.letters : [];
  }

  // Load setup.json if present
  let setup: EditorScenario["setup"];
  const setupFile = zip.file("setup.json");
  if (setupFile) {
    const parsed = JSON.parse(await setupFile.async("text"));
    // New format: pages[]
    if (Array.isArray(parsed.pages)) {
      const choices = Array.isArray(parsed.choices)
        ? parsed.choices.map((c: unknown) => {
            const ch = c as Record<string, unknown>;
            return {
              id: crypto.randomUUID(),
              text: String(ch.text ?? ""),
              ...(ch.nextParagraphId !== undefined
                ? { nextParagraphId: String(ch.nextParagraphId) }
                : {}),
            };
          })
        : undefined;
      setup = {
        pages: parsed.pages as import("../../types").ContentBlock[][],
        ...(choices && choices.length > 0 ? { choices } : {}),
      };
    }
    // Back-compat: old steps[] format
    else if (Array.isArray(parsed.steps) && parsed.steps.length > 0) {
      const steps = parsed.steps as Array<Record<string, unknown>>;
      setup = {
        pages: steps.map((s) =>
          Array.isArray(s.content)
            ? (s.content as import("../../types").ContentBlock[])
            : [],
        ),
      };
      if (parsed.startParagraphId) {
        setup.choices = [
          {
            id: crypto.randomUUID(),
            text: `Przejdź do paragrafu ${parsed.startParagraphId}`,
            nextParagraphId: String(parsed.startParagraphId),
          },
        ];
      }
    }
  }

  return { meta, paragraphs, images, letters, setup };
}
