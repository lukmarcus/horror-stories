import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { RichText } from "./RichText";
import type { ContentBlock } from "../../../types";

describe("RichText", () => {
  // ---------------------------------------------------------------
  // Legacy text prop
  // ---------------------------------------------------------------
  describe("legacy text prop", () => {
    it("renders span with html content when no custom tags", () => {
      const { container } = render(<RichText text="<b>Hello</b>" />);
      expect(container.querySelector("b")).not.toBeNull();
    });

    it("adds spacing-none class when noSpacing is true", () => {
      const { container } = render(<RichText text="Hello" noSpacing />);
      expect(container.querySelector(".spacing-none")).not.toBeNull();
    });

    it("does not add spacing-none when noSpacing is false", () => {
      const { container } = render(<RichText text="Hello" />);
      const block = container.querySelector(".rich-text-block");
      expect(block?.classList.contains("spacing-none")).toBe(false);
    });

    it("renders [id] for <item> tag", () => {
      render(<RichText text='Text <item id="key-001"/> end' />);
      expect(screen.getByText("[key-001]")).toBeDefined();
    });

    it("renders symbol image for known <symbol> tag", () => {
      const { container } = render(
        <RichText text='<symbol id="drzwi-otwarte"/>' />,
      );
      const img = container.querySelector("img.symbol-image");
      expect(img).not.toBeNull();
      expect(img?.getAttribute("alt")).toBe("drzwi-otwarte");
    });

    it("renders nothing for unknown <symbol> tag", () => {
      const { container } = render(
        <RichText text='<symbol id="nonexistent-xyz"/>' />,
      );
      expect(container.querySelector("img")).toBeNull();
    });

    it("renders letter image for known <letter> tag", () => {
      const { container } = render(<RichText text='<letter id="a"/>' />);
      expect(container.querySelector("img.letter-image")).not.toBeNull();
    });

    it("renders person image for known <person> tag", () => {
      const { container } = render(<RichText text='<person id="jessica"/>' />);
      expect(container.querySelector("img.person-image")).not.toBeNull();
    });

    it("renders story item image for known <story> tag", () => {
      const { container } = render(<RichText text='<story id="xiv"/>' />);
      expect(container.querySelector("img.story-item-image")).not.toBeNull();
    });

    it("renders room item image for known <room> tag", () => {
      const { container } = render(<RichText text='<room id="12"/>' />);
      expect(container.querySelector("img.room-item-image")).not.toBeNull();
    });

    it("renders status image for known <status> tag", () => {
      const { container } = render(<RichText text='<status id="zielony"/>' />);
      expect(container.querySelector("img.status-image")).not.toBeNull();
    });

    it("renders nothing for unknown <status> tag", () => {
      const { container } = render(
        <RichText text='<status id="nonexistent-status"/>' />,
      );
      expect(container.querySelector("img")).toBeNull();
    });

    it("renders image placeholder when no scenarioId", () => {
      const { container } = render(<RichText text='<image id="map"/>' />);
      expect(container.querySelector(".rich-image-placeholder")).not.toBeNull();
    });

    it("renders inline image when scenarioId provided", () => {
      const { container } = render(
        <RichText text='<image id="map"/>' scenarioId="test-scenario" />,
      );
      expect(container.querySelector("img.inline-image")).not.toBeNull();
    });

    it("handles mixed content before and after custom tags", () => {
      const { container } = render(
        <RichText text='Before <item id="x"/> After' />,
      );
      expect(container.textContent).toContain("Before");
      expect(container.textContent).toContain("[x]");
      expect(container.textContent).toContain("After");
    });

    it("renders nothing for unknown <person> tag", () => {
      const { container } = render(
        <RichText text='<person id="nonexistent-person"/>' />,
      );
      expect(container.querySelector("img")).toBeNull();
    });

    it("renders nothing for unknown <story> tag", () => {
      const { container } = render(
        <RichText text='<story id="nonexistent-story"/>' />,
      );
      expect(container.querySelector("img")).toBeNull();
    });
  });

  // ---------------------------------------------------------------
  // Content blocks
  // ---------------------------------------------------------------
  describe("content blocks", () => {
    it("renders nothing when content is undefined", () => {
      const { container } = render(<RichText />);
      expect(container.querySelector(".rich-text-block")).toBeNull();
    });

    it("renders text block with default class", () => {
      const content: ContentBlock[] = [{ text: "Hello world" }];
      const { container } = render(<RichText content={content} />);
      expect(container.querySelector(".rich-text-block")).not.toBeNull();
    });

    it("applies size class to text block", () => {
      const content: ContentBlock[] = [{ text: "Big text", size: "lg" }];
      const { container } = render(<RichText content={content} />);
      expect(container.querySelector(".size-lg")).not.toBeNull();
    });

    it("applies color class to text block", () => {
      const content: ContentBlock[] = [{ text: "Red text", color: "red" }];
      const { container } = render(<RichText content={content} />);
      expect(container.querySelector(".color-red")).not.toBeNull();
    });

    it("wraps text in <strong> for bold style without color", () => {
      const content: ContentBlock[] = [{ text: "Bold text", style: "bold" }];
      const { container } = render(<RichText content={content} />);
      expect(container.querySelector("strong")).not.toBeNull();
    });

    it("does not wrap in <strong> for bold style when color is present", () => {
      const content: ContentBlock[] = [
        { text: "Colored bold", style: "bold", color: "yellow" },
      ];
      const { container } = render(<RichText content={content} />);
      expect(container.querySelector("strong")).toBeNull();
    });

    it("wraps text in <em> for italic style", () => {
      const content: ContentBlock[] = [
        { text: "Italic text", style: "italic" },
      ];
      const { container } = render(<RichText content={content} />);
      expect(container.querySelector("em")).not.toBeNull();
    });

    it("wraps text in <u> for underline style", () => {
      const content: ContentBlock[] = [
        { text: "Underline text", style: "underline" },
      ];
      const { container } = render(<RichText content={content} />);
      expect(container.querySelector("u")).not.toBeNull();
    });

    it("applies spacing-none class to text block", () => {
      const content: ContentBlock[] = [{ text: "No spacing", spacing: "none" }];
      const { container } = render(<RichText content={content} />);
      expect(container.querySelector(".spacing-none")).not.toBeNull();
    });

    it("applies is-last-block to last block only", () => {
      const content: ContentBlock[] = [
        { text: "First block" },
        { text: "Last block" },
      ];
      const { container } = render(<RichText content={content} />);
      const blocks = container.querySelectorAll(".rich-text-block");
      expect(blocks[0].classList.contains("is-last-block")).toBe(false);
      expect(blocks[1].classList.contains("is-last-block")).toBe(true);
    });

    it("renders image block placeholder when no scenarioId", () => {
      const content: ContentBlock[] = [{ image: "map" }];
      const { container } = render(<RichText content={content} />);
      expect(container.querySelector(".rich-image-icon")).not.toBeNull();
    });

    it("renders image block <img> when scenarioId provided", () => {
      const content: ContentBlock[] = [{ image: "map" }];
      const { container } = render(
        <RichText content={content} scenarioId="droga-donikad" />,
      );
      expect(container.querySelector("img.rich-image")).not.toBeNull();
    });

    it("renders old format {type:'text', html:'...'} block", () => {
      const content: ContentBlock[] = [
        { type: "text", html: "Old format text" },
      ];
      const { container } = render(<RichText content={content} />);
      expect(container.querySelector(".rich-text-block")).not.toBeNull();
      expect(container.textContent).toContain("Old format text");
    });

    it("renders old format {type:'image', id:'...'} block placeholder when no scenarioId", () => {
      const content: ContentBlock[] = [{ type: "image", id: "map" }];
      const { container } = render(<RichText content={content} />);
      expect(container.querySelector(".rich-image-icon")).not.toBeNull();
    });

    it("renders old format {type:'image', id:'...'} block <img> when scenarioId provided", () => {
      const content: ContentBlock[] = [{ type: "image", id: "map" }];
      const { container } = render(
        <RichText content={content} scenarioId="droga-donikad" />,
      );
      expect(container.querySelector("img.rich-image")).not.toBeNull();
    });

    it("applies spacing-none to image block", () => {
      const content: ContentBlock[] = [{ image: "map", spacing: "none" }];
      const { container } = render(<RichText content={content} />);
      const imageBlock = container.querySelector(".rich-image-block");
      expect(imageBlock?.classList.contains("spacing-none")).toBe(true);
    });

    it("applies is-last-block to image block when last", () => {
      const content: ContentBlock[] = [{ image: "map" }];
      const { container } = render(<RichText content={content} />);
      const imageBlock = container.querySelector(".rich-image-block");
      expect(imageBlock?.classList.contains("is-last-block")).toBe(true);
    });
  });
});
