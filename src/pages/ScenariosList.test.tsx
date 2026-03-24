import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ScenariosList } from "./ScenariosList";
import { SCENARIOS } from "../scenarios";

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
});
