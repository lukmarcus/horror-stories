import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  loadUserScenarios,
  saveUserScenario,
  removeUserScenario,
} from "./userScenarioStorage";
import type { Scenario } from "../types";

// localStorage mock
const store = new Map<string, string>();
const localStorageMock = {
  getItem: (key: string) => store.get(key) ?? null,
  setItem: (key: string, value: string) => store.set(key, value),
  removeItem: (key: string) => store.delete(key),
  clear: () => store.clear(),
};
vi.stubGlobal("localStorage", localStorageMock);

const scenario1: Scenario = {
  id: "test-one",
  title: "Test One",
  description: "",
  minPlayerCount: null,
  maxPlayerCount: null,
  duration: null,
};

const scenario2: Scenario = {
  id: "test-two",
  title: "Test Two",
  description: "",
  minPlayerCount: 1,
  maxPlayerCount: 4,
  duration: 60,
};

beforeEach(() => {
  store.clear();
});

describe("loadUserScenarios", () => {
  it("returns empty array when storage is empty", () => {
    expect(loadUserScenarios()).toEqual([]);
  });

  it("returns empty array when storage contains invalid JSON", () => {
    localStorage.setItem("horror-stories:user-scenarios", "not-json");
    expect(loadUserScenarios()).toEqual([]);
  });
});

describe("saveUserScenario", () => {
  it("saves a scenario and loads it back", () => {
    saveUserScenario(scenario1);
    expect(loadUserScenarios()).toEqual([scenario1]);
  });

  it("prepends new scenarios (newest first)", () => {
    saveUserScenario(scenario1);
    saveUserScenario(scenario2);
    const loaded = loadUserScenarios();
    expect(loaded[0].id).toBe("test-two");
    expect(loaded[1].id).toBe("test-one");
  });

  it("updates existing scenario in-place without duplicating", () => {
    saveUserScenario(scenario1);
    saveUserScenario({ ...scenario1, title: "Updated" });
    const loaded = loadUserScenarios();
    expect(loaded).toHaveLength(1);
    expect(loaded[0].title).toBe("Updated");
  });
});

describe("removeUserScenario", () => {
  it("removes scenario by id", () => {
    saveUserScenario(scenario1);
    saveUserScenario(scenario2);
    removeUserScenario("test-one");
    const loaded = loadUserScenarios();
    expect(loaded).toHaveLength(1);
    expect(loaded[0].id).toBe("test-two");
  });

  it("does nothing when id not found", () => {
    saveUserScenario(scenario1);
    removeUserScenario("nonexistent");
    expect(loadUserScenarios()).toHaveLength(1);
  });

  it("results in empty array when last scenario removed", () => {
    saveUserScenario(scenario1);
    removeUserScenario("test-one");
    expect(loadUserScenarios()).toEqual([]);
  });
});
