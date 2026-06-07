import type { SetupStep } from "../types";

const storageKey = (scenarioId: string) =>
  `horror-stories:user-setup:${scenarioId}`;

export function saveUserSetup(scenarioId: string, steps: SetupStep[]): void {
  try {
    if (steps.length === 0) {
      localStorage.removeItem(storageKey(scenarioId));
    } else {
      localStorage.setItem(storageKey(scenarioId), JSON.stringify(steps));
    }
  } catch {
    // ignore storage errors
  }
}

export function loadUserSetup(scenarioId: string): SetupStep[] {
  try {
    const raw = localStorage.getItem(storageKey(scenarioId));
    if (!raw) return [];
    return JSON.parse(raw) as SetupStep[];
  } catch {
    return [];
  }
}

export function removeUserSetup(scenarioId: string): void {
  try {
    localStorage.removeItem(storageKey(scenarioId));
  } catch {
    // ignore storage errors
  }
}
