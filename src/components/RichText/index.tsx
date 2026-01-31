import React from "react";
import "./rich-text.css";

interface RichTextProps {
  text: string;
}

export const RichText: React.FC<RichTextProps> = ({ text }) => {
  // Parse text with tags and convert to React elements
  const parseText = (input: string): React.ReactNode[] => {
    const elements: React.ReactNode[] = [];
    const tagRegex =
      /\[([a-z]+)(?:[:=]([^\]]*))?\]([\s\S]*?)\[\/\1\]|\[([a-z]+)[:=]([^\]]*)\]|\[([a-z]+)\s+([^\]]*)\]/g;
    let lastIndex = 0;
    let match;

    while ((match = tagRegex.exec(input)) !== null) {
      // Add text before the tag
      if (match.index > lastIndex) {
        elements.push(
          input
            .substring(lastIndex, match.index)
            .split("\n")
            .map((line, i, arr) =>
              i < arr.length - 1 ? (
                <React.Fragment key={`text-${lastIndex}-${i}`}>
                  {line}
                  <br />
                </React.Fragment>
              ) : (
                line
              ),
            ),
        );
      }

      if (match[1]) {
        // Closing tag format: [tag]text[/tag] or [tag:subtype]text[/tag]
        const tag = match[1];
        const subtype = match[2]; // for [tag:subtype] format
        const content = match[3];
        const key = `${tag}-${lastIndex}`;

        if (tag === "color") {
          const colorClass = `rich-${subtype}`;
          elements.push(
            <span key={key} className={colorClass}>
              {parseText(content)}
            </span>,
          );
        } else if (tag === "style") {
          if (subtype === "bold") {
            elements.push(<strong key={key}>{parseText(content)}</strong>);
          } else if (subtype === "italic") {
            elements.push(<em key={key}>{parseText(content)}</em>);
          } else if (subtype === "underline") {
            elements.push(<u key={key}>{parseText(content)}</u>);
          } else if (subtype === "bigger") {
            elements.push(
              <span key={key} className="rich-bigger">
                {parseText(content)}
              </span>,
            );
          }
        } else {
          elements.push(content);
        }
      } else if (match[4]) {
        // Self-closing tag format with colon: [image:text] or [symbol:text] or [token:text]
        const tag = match[4];
        const content = match[5];
        const key = `${tag}-${lastIndex}`;

        if (tag === "image") {
          elements.push(
            <div key={key} className="rich-image-placeholder">
              <div className="rich-image-icon">🖼️</div>
              <div className="rich-image-text">{content}</div>
            </div>,
          );
        } else if (tag === "symbol") {
          // Map symbol types to emoji
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
          const emoji = symbolMap[content] || `[${content}]`;
          elements.push(<span key={key}>{emoji}</span>);
        } else if (tag === "token") {
          // Map token types to formatted letters
          const tokenMap: Record<string, string> = {
            A: "𝐀",
          };
          const symbol = tokenMap[content] || `[${content}]`;
          elements.push(<span key={key}>{symbol}</span>);
        }
      } else if (match[6]) {
        // Unused: Self-closing tag format with space: [symbol text]
        // We use [symbol:text] format instead
      }

      lastIndex = tagRegex.lastIndex;
    }

    // Add remaining text
    if (lastIndex < input.length) {
      elements.push(
        input
          .substring(lastIndex)
          .split("\n")
          .map((line, i, arr) =>
            i < arr.length - 1 ? (
              <React.Fragment key={`text-end-${i}`}>
                {line}
                <br />
              </React.Fragment>
            ) : (
              line
            ),
          ),
      );
    }

    return elements.length > 0 ? elements : [input];
  };

  return <div className="rich-text">{parseText(text)}</div>;
};
