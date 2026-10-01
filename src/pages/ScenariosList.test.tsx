import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ScenariosList } from "./ScenariosList";
import { SCENARIOS } from "../scenarios";
import {
  saveUserScenario,
  removeUserScenario,
} from "../utils/userScenarioStorage";
import { saveUserImages, removeUserImages } from "../utils/userImageStorage";

// localStorage mock (jsdom doesn't provide a real implementation)
const store = new Map<string, string>();
vi.stubGlobal("localStorage", {
  getItem: (key: string) => store.get(key) ?? null,
  setItem: (key: string, value: string) => store.set(key, value),
  removeItem: (key: string) => store.delete(key),
  clear: () => store.clear(),
});

const renderWithRouter = () =>
  render(
    <MemoryRouter>
      <ScenariosList />
    </MemoryRouter>,
  );

describe("ScenariosList", () => {
  const scenarioList = Object.values(SCENARIOS);

  it("renders page title", () => {
    renderWithRouter();
    expect(screen.getByText("Dostępne Scenariusze")).toBeDefined();
  });

  it("renders subtitle", () => {
    renderWithRouter();
    expect(
      screen.getByText("Wybierz scenariusz i zacznij swoją przygodę"),
    ).toBeDefined();
  });

  it("renders a card for each scenario", () => {
    renderWithRouter();
    const startButtons = screen.getAllByText("Zacznij Grę");
    expect(startButtons.length).toBe(scenarioList.length);
  });

  it("renders scenario titles", () => {
    renderWithRouter();
    scenarioList.forEach((scenario) => {
      expect(screen.getByText(scenario.title)).toBeDefined();
    });
  });

  it("renders scenario descriptions", () => {
    renderWithRouter();
    scenarioList.forEach((scenario) => {
      if (scenario.description) {
        expect(screen.getByText(scenario.description)).toBeDefined();
      }
    });
  });

  it("renders Zacznij Grę link for each scenario", () => {
    renderWithRouter();
    expect(screen.getAllByText("Zacznij Grę").length).toBeGreaterThan(0);
  });

  it("links point to correct game routes", () => {
    const { container } = renderWithRouter();
    const links = container.querySelectorAll("a[href]");
    scenarioList.forEach((scenario) => {
      const href = `/game/${scenario.id}`;
      const link = Array.from(links).find((l) =>
        l.getAttribute("href")?.includes(scenario.id),
      );
      expect(link).toBeDefined();
      expect(link?.getAttribute("href")).toBe(href);
    });
  });

  describe("cover images", () => {
    const TEST_ID = "test-cover-scenario";

    afterEach(() => {
      removeUserScenario(TEST_ID);
      removeUserImages(TEST_ID);
    });

    it("uses a user-uploaded 'cover' image as the card background", () => {
      saveUserScenario({
        id: TEST_ID,
        title: "Test Cover Scenario",
        description: "",
        minPlayerCount: null,
        maxPlayerCount: null,
        duration: null,
      });
      saveUserImages(TEST_ID, { cover: "data:image/png;base64,abc" });

      const { container } = renderWithRouter();
      const card = Array.from(
        container.querySelectorAll(".scenarios-list__card"),
      ).find((el) => el.textContent?.includes("Test Cover Scenario"));

      expect(card).toBeDefined();
      expect(card?.classList.contains("scenarios-list__card--has-cover")).toBe(
        true,
      );
      expect((card as HTMLElement).style.backgroundImage).toContain(
        "data:image/png;base64,abc",
      );
    });

    it("renders without a cover background when no 'cover' image is stored", () => {
      saveUserScenario({
        id: TEST_ID,
        title: "Test Cover Scenario",
        description: "",
        minPlayerCount: null,
        maxPlayerCount: null,
        duration: null,
      });

      const { container } = renderWithRouter();
      const card = Array.from(
        container.querySelectorAll(".scenarios-list__card"),
      ).find((el) => el.textContent?.includes("Test Cover Scenario"));

      expect(card).toBeDefined();
      expect(card?.classList.contains("scenarios-list__card--has-cover")).toBe(
        false,
      );
    });
  });
});
