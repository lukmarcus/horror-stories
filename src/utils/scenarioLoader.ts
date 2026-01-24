import type { Scenario } from "../types";

export async function loadScenario(scenarioId: string): Promise<Scenario> {
  try {
    const response = await fetch(`/scenarios/${scenarioId}.json`);
    if (!response.ok) {
      throw new Error(`Failed to load scenario: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error loading scenario:", error);
    throw error;
  }
}

export function loadScenarios(): Promise<Scenario[]> {
  // This would typically fetch from a server or API
  // For now, return an empty array
  return Promise.resolve([]);
}
