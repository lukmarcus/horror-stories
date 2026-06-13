import { describe, it, expect } from "vitest";
import { validateScenario, validateParagraph } from "./validation";
import type { Scenario, Paragraph } from "../types";

const validScenario: Scenario = {
  id: "test-scenario",
  title: "Test Scenario",
  description: "A test scenario",
  minPlayerCount: 2,
  maxPlayerCount: 4,
  duration: 60,
};

const validParagraph: Paragraph = {
  id: "1",
  text: "Some text",
};

describe("validateScenario", () => {
  it("passes for a valid scenario", () => {
    const result = validateScenario(validScenario);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("fails when id is empty", () => {
    const result = validateScenario({ ...validScenario, id: "" });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Scenario must have an ID");
  });

  it("fails when title is empty", () => {
    const result = validateScenario({ ...validScenario, title: "" });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Scenario must have a title");
  });

  it("fails when description is empty", () => {
    const result = validateScenario({ ...validScenario, description: "" });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Scenario must have a description");
  });

  it("fails when minPlayerCount is null", () => {
    const result = validateScenario({ ...validScenario, minPlayerCount: null });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Scenario must specify player count");
  });

  it("passes when minPlayerCount is 0", () => {
    // 0 is a valid count (== null check, not falsy check)
    const result = validateScenario({ ...validScenario, minPlayerCount: 0 });
    expect(result.valid).toBe(true);
  });

  it("fails when duration is null", () => {
    const result = validateScenario({ ...validScenario, duration: null });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Scenario must have estimated duration");
  });

  it("collects multiple errors at once", () => {
    const result = validateScenario({
      ...validScenario,
      id: "",
      title: "",
      description: "",
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveLength(3);
  });
});

describe("validateParagraph", () => {
  it("passes for a valid paragraph with string id", () => {
    const result = validateParagraph(validParagraph);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("passes for a paragraph with array id", () => {
    const result = validateParagraph({ ...validParagraph, id: ["1", "2"] });
    expect(result.valid).toBe(true);
  });

  it("fails when id is empty string", () => {
    const result = validateParagraph({ ...validParagraph, id: "" });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Paragraph must have an ID");
  });

  it("fails when id is empty array", () => {
    const result = validateParagraph({ ...validParagraph, id: [] });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Paragraph must have an ID");
  });

  it("fails when text is missing", () => {
    const result = validateParagraph({ id: "1" } as Paragraph);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Paragraph must have text content");
  });

  it("fails when text is empty string", () => {
    const result = validateParagraph({ ...validParagraph, text: "" });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Paragraph must have text content");
  });

  it("collects both id and text errors", () => {
    const result = validateParagraph({ id: "", text: "" } as Paragraph);
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveLength(2);
  });
});
