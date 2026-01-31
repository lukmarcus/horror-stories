import React from "react";
import "./rich-text.css";

interface ContentBlock {
  type: "text" | "image" | "symbol" | "token";
  html?: string;
  id?: string;
  size?: "xs" | "sm" | "lg" | "xl";
}

interface RichTextProps {
  content?: ContentBlock[];
  text?: string; // for backward compatibility
}

export const RichText: React.FC<RichTextProps> = ({ content, text }) => {
  // Symbol to emoji mapping
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

  // Token mapping
  const tokenMap: Record<string, string> = {
    A: "𝐀",
    B: "𝐁",
  };

  // Parse HTML and replace custom tags with React elements
  const parseHtml = (html: string): React.ReactNode[] => {
    const customTagRegex = /<(symbol|token|image)\s+id=["']([^"']+)["']\s*\/>/g;
    let currentPos = 0;
    const finalElements: React.ReactNode[] = [];

    let matchFinal;

    while ((matchFinal = customTagRegex.exec(html)) !== null) {
      // Add HTML before this tag
      const beforeHtml = html.substring(currentPos, matchFinal.index);
      if (beforeHtml) {
        finalElements.push(...parseStandardHtml(beforeHtml));
      }

      // Add custom element
      const tag = matchFinal[1];
      const id = matchFinal[2];
      const key = `custom-${tag}-${id}`;

      if (tag === "image") {
        finalElements.push(
          <div key={key} className="rich-image-placeholder">
            <div className="rich-image-icon">🖼️</div>
            <div className="rich-image-text">{id}</div>
          </div>,
        );
      } else if (tag === "symbol") {
        const emoji = symbolMap[id] || `[${id}]`;
        finalElements.push(<span key={key} className="symbol">{emoji}</span>);
      } else if (tag === "token") {
        const symbol = tokenMap[id] || `[${id}]`;
        finalElements.push(<span key={key} className="token">{symbol}</span>);
      }

      currentPos = customTagRegex.lastIndex;
    }

    // Add remaining HTML
    if (currentPos < html.length) {
      const remainingHtml = html.substring(currentPos);
      if (remainingHtml) {
        finalElements.push(...parseStandardHtml(remainingHtml));
      }
    }

    return finalElements;
  };

  // Parse standard HTML tags
  const parseStandardHtml = (html: string): React.ReactNode[] => {
    const div = document.createElement("div");
    div.innerHTML = html;

    const traverse = (node: Node): React.ReactNode[] => {
      const nodes: React.ReactNode[] = [];

      node.childNodes.forEach((child, idx) => {
        if (child.nodeType === Node.TEXT_NODE) {
          const text = child.textContent || "";
          nodes.push(text);
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          const elem = child as HTMLElement;
          const childContent = traverse(elem);

          if (elem.tagName === "SPAN") {
            if (elem.className.startsWith("color-") || elem.className.startsWith("size-")) {
              nodes.push(
                <span key={idx} className={elem.className}>
                  {childContent}
                </span>,
              );
            } else {
              nodes.push(childContent);
            }
          } else if (elem.tagName === "STRONG") {
            nodes.push(<strong key={idx}>{childContent}</strong>);
          } else if (elem.tagName === "EM") {
            nodes.push(<em key={idx}>{childContent}</em>);
          } else if (elem.tagName === "U") {
            nodes.push(<u key={idx}>{childContent}</u>);
          } else if (elem.tagName === "BR") {
            nodes.push(<br key={idx} />);
          } else {
            nodes.push(childContent);
          }
        }
      });

      return nodes;
    };

    return traverse(div);
  };

  // Render content blocks
  const renderContentBlocks = (blocks: ContentBlock[]): React.ReactNode => {
    return blocks.map((block, idx) => {
      if (block.type === "text" && block.html) {
        const sizeClass = block.size ? `size-${block.size}` : "";
        return (
          <div key={idx} className={`rich-text-block ${sizeClass}`.trim()}>
            {parseHtml(block.html)}
          </div>
        );
      } else if (block.type === "image" && block.id) {
        return (
          <div key={idx} className="rich-image-placeholder">
            <div className="rich-image-icon">🖼️</div>
            <div className="rich-image-text">{block.id}</div>
          </div>
        );
      }
      return null;
    });
  };

  // Backward compatibility: if text prop is provided, use old parser
  if (text && !content) {
    return (
      <div className="rich-text">
        <div className="rich-text-block">{parseHtml(text)}</div>
      </div>
    );
  }

  return (
    <div className="rich-text">
      {content ? renderContentBlocks(content) : null}
    </div>
  );
};
