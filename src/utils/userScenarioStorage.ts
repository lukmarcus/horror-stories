import type { Scenario } from "../types";

const STORAGE_KEY = "horror-stories:user-scenarios";

export function loadUserScenarios(): Scenario[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Scenario[];
  } catch {
    return [];
  }
}

export function removeUserScenario(id: string): void {
  const existing = loadUserScenarios();
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(existing.filter((s) => s.id !== id)),
  );
}

export function saveUserScenario(scenario: Scenario): void {
  const existing = loadUserScenarios();
  const idx = existing.findIndex((s) => s.id === scenario.id);
  if (idx >= 0) {
    existing[idx] = scenario;
  } else {
    existing.unshift(scenario);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
}
