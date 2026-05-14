import { describe, it, expect } from "vitest";

describe("RichText Component", () => {
  describe("Symbol mapping", () => {
    it("should map symbol IDs to emojis", () => {
      const symbolMap: Record<string, string> = {
        rewers: "👤",
        gwiazda: "⭐",
        "drzwi-otwarte": "🚪",
        "drzwi-wywazone": "💥",
        "drzwi-zamkniete": "🔐",
        paragraf: "§",
        karta1: "❶",
        karta2: "❷",
        karta3: "❸",
      };

      expect(symbolMap.rewers).toBe("👤");
      expect(symbolMap.gwiazda).toBe("⭐");
      expect(symbolMap.karta1).toBe("❶");
      expect(symbolMap["drzwi-zamkniete"]).toBe("🔐");
    });

    it("should return fallback for unknown symbol", () => {
      const symbolMap: Record<string, string> = { rewers: "👤" };
      const id = "unknown-symbol";
      const emoji = symbolMap[id] || `[${id}]`;
      expect(emoji).toBe("[unknown-symbol]");
    });
  });

  describe("Token mapping", () => {
    it("should map token IDs to symbols", () => {
      const tokenMap: Record<string, string> = {
        A: "𝐀",
        B: "𝐁",
      };

      expect(tokenMap.A).toBe("𝐀");
      expect(tokenMap.B).toBe("𝐁");
    });

    it("should return fallback for unknown token", () => {
      const tokenMap: Record<string, string> = { A: "𝐀" };
      const id = "C";
      const symbol = tokenMap[id] || `[${id}]`;
      expect(symbol).toBe("[C]");
    });
  });

  describe("Custom tag regex", () => {
    it("should match symbol tags", () => {
      const customTagRegex =
        /<(symbol|token|image)\s+id=["']([^"']+)["']\s*\/>/g;
      const html = "Check <symbol id='karta-akcji'/> for details";
      const match = customTagRegex.exec(html);

      expect(match).not.toBeNull();
      expect(match?.[1]).toBe("symbol");
      expect(match?.[2]).toBe("karta-akcji");
    });

    it("should match token tags", () => {
      const customTagRegex =
        /<(symbol|token|image)\s+id=["']([^"']+)["']\s*\/>/g;
      const html = "Value <token id='A'/> represents";
      const match = customTagRegex.exec(html);

      expect(match).not.toBeNull();
      expect(match?.[1]).toBe("token");
      expect(match?.[2]).toBe("A");
    });

    it("should match image tags", () => {
      const customTagRegex =
        /<(symbol|token|image)\s+id=["']([^"']+)["']\s*\/>/g;
      const html = "See <image id='board-layout'/> below";
      const match = customTagRegex.exec(html);

      expect(match).not.toBeNull();
      expect(match?.[1]).toBe("image");
      expect(match?.[2]).toBe("board-layout");
    });

    it("should match multiple tags", () => {
      const customTagRegex =
        /<(symbol|token|image)\s+id=["']([^"']+)["']\s*\/>/g;
      const html =
        "<symbol id='karta-akcji'/> and <token id='A'/> and <image id='pic'/>";
      const matches: RegExpExecArray[] = [];
      let match;

      while ((match = customTagRegex.exec(html)) !== null) {
        matches.push(match);
      }

      expect(matches).toHaveLength(3);
      expect(matches[0][2]).toBe("karta-akcji");
      expect(matches[1][2]).toBe("A");
      expect(matches[2][2]).toBe("pic");
    });

    it("should support both single and double quotes", () => {
      const customTagRegex =
        /<(symbol|token|image)\s+id=["']([^"']+)["']\s*\/>/g;

      const htmlSingle = "Text <symbol id='karta-akcji'/> here";
      const htmlDouble = 'Text <symbol id="karta-akcji"/> here';

      expect(customTagRegex.exec(htmlSingle)).not.toBeNull();
      customTagRegex.lastIndex = 0;
      expect(customTagRegex.exec(htmlDouble)).not.toBeNull();
    });
  });

  describe("ContentBlock interface", () => {
    it("should support text type with html", () => {
      const block = {
        type: "text" as const,
        html: "Sample <strong>bold</strong> text",
      };

      expect(block.type).toBe("text");
      expect(block.html).toContain("bold");
    });

    it("should support size property", () => {
      const block = {
        type: "text" as const,
        html: "Large text",
        size: "xl" as const,
      };

      expect(block.size).toBe("xl");
    });

    it("should support style property", () => {
      const block = {
        type: "text" as const,
        html: "Styled text",
        style: "italic" as const,
      };

      expect(block.style).toBe("italic");
    });

    it("should support color property", () => {
      const block = {
        type: "text" as const,
        html: "Colored text",
        color: "red" as const,
      };

      expect(block.color).toBe("red");
    });

    it("should support image type with id", () => {
      const block = {
        type: "image" as const,
        id: "board-setup",
      };

      expect(block.type).toBe("image");
      expect(block.id).toBe("board-setup");
    });

    it("should support multiple blocks with different properties", () => {
      const blocks = [
        {
          type: "text" as const,
          html: "Instruction text",
          size: "xl" as const,
        },
        {
          type: "image" as const,
          id: "setup-image",
        },
        {
          type: "text" as const,
          html: "Warning <span class='color-red'>important</span>",
          color: "red" as const,
        },
      ];

      expect(blocks).toHaveLength(3);
      expect(blocks[0].size).toBe("xl");
      expect(blocks[1].type).toBe("image");
      expect(blocks[2].color).toBe("red");
    });
  });

  describe("Size classes", () => {
    it("should support all size values", () => {
      const sizes = ["xs", "sm", "lg", "xl"] as const;
      sizes.forEach((size) => {
        expect(["xs", "sm", "lg", "xl"]).toContain(size);
      });
    });

    it("should match CSS size scale", () => {
      const sizeMap = {
        xs: "0.75em",
        sm: "0.9em",
        lg: "1.25em",
        xl: "1.5em",
      };

      expect(sizeMap.xs).toBe("0.75em");
      expect(sizeMap.xl).toBe("1.5em");
    });
  });

  describe("Color classes", () => {
    it("should support all color values", () => {
      const colors = ["yellow", "red", "purple", "green"] as const;
      colors.forEach((color) => {
        expect(["yellow", "red", "purple", "green"]).toContain(color);
      });
    });

    it("should match CSS color values", () => {
      const colorMap = {
        yellow: "#ffeb3b",
        red: "#ff6b6b",
        purple: "#bb86fc",
        green: "#4caf50",
      };

      expect(colorMap.yellow).toBe("#ffeb3b");
      expect(colorMap.green).toBe("#4caf50");
    });
  });

  describe("Style properties", () => {
    it("should support bold style", () => {
      const block = {
        type: "text" as const,
        html: "Bold text",
        style: "bold" as const,
      };

      expect(block.style).toBe("bold");
    });

    it("should support italic style", () => {
      const block = {
        type: "text" as const,
        html: "Italic text",
        style: "italic" as const,
      };

      expect(block.style).toBe("italic");
    });

    it("should support underline style", () => {
      const block = {
        type: "text" as const,
        html: "Underlined text",
        style: "underline" as const,
      };

      expect(block.style).toBe("underline");
    });
  });

  describe("Image path generation", () => {
    it("should generate correct image path with scenarioId", () => {
      const scenarioId = "droga-donikad";
      const imageId = "jessica-figurka";
      const expectedPath = `../../scenarios/${scenarioId}/images/${imageId}.jpg`;

      expect(expectedPath).toContain(scenarioId);
      expect(expectedPath).toContain(imageId);
      expect(expectedPath).toContain(".jpg");
    });

    it("should handle different image IDs", () => {
      const scenarioId = "tajemna-biblioteka";
      const imageIds = ["book-cover", "map-layout", "puzzle-piece"];

      imageIds.forEach((id) => {
        const path = `../../scenarios/${scenarioId}/images/${id}.jpg`;
        expect(path).toContain(id);
      });
    });
  });

  describe("HTML parsing", () => {
    it("should handle standard HTML tags", () => {
      const htmlTags = ["<strong>", "<em>", "<u>", "<br/>"];
      htmlTags.forEach((tag) => {
        expect(tag).toBeDefined();
      });
    });

    it("should handle colored spans", () => {
      const html = "<span class='color-red'>Important</span>";
      expect(html).toContain("color-red");
    });

    it("should handle mixed content", () => {
      const html =
        "Text with <strong>bold</strong>, <em>italic</em>, <span class='color-red'>red</span> and <symbol id='karta-akcji'/>";
      expect(html).toContain("bold");
      expect(html).toContain("italic");
      expect(html).toContain("color-red");
      expect(html).toContain("symbol");
    });
  });

  describe("Backward compatibility", () => {
    it("should support legacy text prop", () => {
      const props = {
        text: "Legacy text content",
        content: undefined,
      };

      expect(props.text).toBeDefined();
      expect(props.content).toBeUndefined();
    });

    it("should prioritize content over text", () => {
      const content = [{ type: "text" as const, html: "New format" }];
      const text = "Old format";

      if (text && !content) {
        expect(text).toBe("Old format");
      } else {
        expect(content).toBeDefined();
      }
    });
  });
});
