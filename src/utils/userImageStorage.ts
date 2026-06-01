const storageKey = (scenarioId: string) =>
  `horror-stories:user-images:${scenarioId}`;

export function saveUserImages(
  scenarioId: string,
  images: Record<string, string>,
): void {
  try {
    if (Object.keys(images).length === 0) {
      localStorage.removeItem(storageKey(scenarioId));
    } else {
      localStorage.setItem(storageKey(scenarioId), JSON.stringify(images));
    }
  } catch {
    // ignore storage errors
  }
}

export function loadUserImages(scenarioId: string): Record<string, string> {
  try {
    const raw = localStorage.getItem(storageKey(scenarioId));
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, string>;
  } catch {
    return {};
  }
}

export function removeUserImages(scenarioId: string): void {
  try {
    localStorage.removeItem(storageKey(scenarioId));
  } catch {
    // ignore storage errors
  }
}
