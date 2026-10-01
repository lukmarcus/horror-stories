// Resolves scenario-local images (src/scenarios/{id}/images/*) to their build URL.
// Uses import.meta.glob with a static pattern instead of
// new URL(`...${scenarioId}...`, import.meta.url) — Vite requires glob patterns
// to be string literals, but can't reliably interpolate dynamic template URLs
// (breaks under Vitest/vite-node, see docs/TESTING_GUIDE.md).
const SCENARIO_IMAGE_MODULES = import.meta.glob<string>(
  "../scenarios/*/images/*.{jpg,jpeg,png}",
  { eager: true, query: "?url", import: "default" },
);

const SCENARIO_IMAGE_PATH_PATTERN =
  /scenarios\/([^/]+)\/images\/([^/.]+)\.[^./]+$/;

const SCENARIO_IMAGE_URLS: Record<string, string> = {};
for (const [path, url] of Object.entries(SCENARIO_IMAGE_MODULES)) {
  const match = path.match(SCENARIO_IMAGE_PATH_PATTERN);
  if (match) {
    const [, scenarioId, imageId] = match;
    SCENARIO_IMAGE_URLS[`${scenarioId}/${imageId}`] = url;
  }
}

export function getScenarioImageUrl(
  scenarioId: string | undefined,
  imageId: string | undefined,
): string | undefined {
  if (!scenarioId || !imageId) return undefined;
  return SCENARIO_IMAGE_URLS[`${scenarioId}/${imageId}`];
}
