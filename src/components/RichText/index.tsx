import React from "react";
import "./rich-text.css";

interface ContentBlock {
  type: "text" | "image" | "symbol" | "token";
  html?: string;
  id?: string;
  size?: "xs" | "sm" | "lg" | "xl";
  style?: "bold" | "italic" | "underline";
  color?: "yellow" | "red" | "purple" | "green";
}

interface RichTextProps {
  content?: ContentBlock[];
  text?: string; // for backward compatibility
  scenarioId?: string; // for loading images
}

export const RichText: React.FC<RichTextProps> = ({ content, text, scenarioId }) => {
  // Token mapping
  const tokenMap: Record<string, string> = {
    A: "𝐀",
    B: "𝐁",
  };

  // Parse HTML and replace custom tags with React elements
  const parseHtml = (html: string): React.ReactNode[] => {
    const customTagRegex = /<(symbol|token|letter|item|image)\s+id=["']([^"']+)["']\s*\/>/g;
    let currentPos = 0;
    const finalElements: React.ReactNode[] = [];
    let customElementCounter = 0;

    let matchFinal;

    while ((matchFinal = customTagRegex.exec(html)) !== null) {
      // Add HTML before this tag
      const beforeHtml = html.substring(currentPos, matchFinal.index);
      if (beforeHtml) {
        finalElements.push(...parseStandardHtml(beforeHtml, customElementCounter));
        customElementCounter += countHtmlElements(beforeHtml);
      }

      // Add custom element
      const tag = matchFinal[1];
      const id = matchFinal[2];
      const key = `custom-${tag}-${id}-${customElementCounter}`;
      customElementCounter++;

      if (tag === "image") {
        const imagePath = scenarioId 
          ? new URL(`../../scenarios/${scenarioId}/images/${id}.jpg`, import.meta.url).href
          : undefined;

        if (imagePath) {
          finalElements.push(
            <div key={key} className="rich-image-block">
              <img src={imagePath} alt={id} className="rich-image" />
            </div>,
          );
        } else {
          finalElements.push(
            <div key={key} className="rich-image-placeholder">
              <div className="rich-image-icon">🖼️</div>
              <div className="rich-image-text">{id}</div>
            </div>,
          );
        }
      } else if (tag === "symbol") {
        const symbolPath = new URL(`../../assets/symbols/${id}.png`, import.meta.url).href;
        finalElements.push(
          <img
            key={key}
            src={symbolPath}
            alt={id}
            className="symbol-image"
            title={id}
          />,
        );
      } else if (tag === "letter") {
        const letterPath = new URL(`../../assets/letters/${id}.png`, import.meta.url).href;
        finalElements.push(
          <img
            key={key}
            src={letterPath}
            alt={id}
            className="letter-image"
            title={id}
          />,
        );
      } else if (tag === "token") {
        const symbol = tokenMap[id] || `[${id}]`;
        finalElements.push(
          <span key={key} className="token">
            {symbol}
          </span>,
        );
      } else if (tag === "item") {
        finalElements.push(
          <span key={key} className="item">
            [{id}]
          </span>,
        );
      }

      currentPos = customTagRegex.lastIndex;
    }

    // Add remaining HTML
    if (currentPos < html.length) {
      const remainingHtml = html.substring(currentPos);
      if (remainingHtml) {
        finalElements.push(...parseStandardHtml(remainingHtml, customElementCounter));
      }
    }

    return finalElements;
  };

  // Count HTML elements for key generation
  const countHtmlElements = (html: string): number => {
    const div = document.createElement("div");
    div.innerHTML = html;
    let count = 0;
    const traverse = (node: Node) => {
      node.childNodes.forEach((child) => {
        if (child.nodeType === Node.ELEMENT_NODE) {
          count++;
          traverse(child);
        }
      });
    };
    traverse(div);
    return count;
  };

  // Parse standard HTML tags
  const parseStandardHtml = (html: string, startCounter: number): React.ReactNode[] => {
    const div = document.createElement("div");
    div.innerHTML = html;
    let elementCounter = startCounter;

    const traverse = (node: Node): React.ReactNode[] => {
      const nodes: React.ReactNode[] = [];

      node.childNodes.forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          const text = child.textContent || "";
          nodes.push(text);
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          const elem = child as HTMLElement;
          const childContent = traverse(elem);
          const key = `elem-${elementCounter}`;
          elementCounter++;

          if (elem.tagName === "SPAN") {
            if (
              elem.className.startsWith("color-") ||
              elem.className.startsWith("size-")
            ) {
              nodes.push(
                <span key={key} className={elem.className}>
                  {childContent}
                </span>,
              );
            } else {
              nodes.push(childContent);
            }
          } else if (elem.tagName === "STRONG") {
            nodes.push(<strong key={key}>{childContent}</strong>);
          } else if (elem.tagName === "EM") {
            nodes.push(<em key={key}>{childContent}</em>);
          } else if (elem.tagName === "U") {
            nodes.push(<u key={key}>{childContent}</u>);
          } else if (elem.tagName === "BR") {
            nodes.push(<br key={key} />);
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
        const classes = [
          "rich-text-block",
          block.size ? `size-${block.size}` : "",
          block.color ? `color-${block.color}` : "",
        ]
          .filter(Boolean)
          .join(" ");

        let content: React.ReactNode = parseHtml(block.html);

        // Apply style wrapper if needed
        if (block.style === "bold") {
          content = <strong>{content}</strong>;
        } else if (block.style === "italic") {
          content = <em>{content}</em>;
        } else if (block.style === "underline") {
          content = <u>{content}</u>;
        }

        return (
          <div key={idx} className={classes}>
            {content}
          </div>
        );
      } else if (block.type === "image" && block.id) {
        const imagePath = scenarioId 
          ? new URL(`../../scenarios/${scenarioId}/images/${block.id}.jpg`, import.meta.url).href
          : undefined;

        return (
          <div key={idx} className="rich-image-block">
            {imagePath ? (
              <img src={imagePath} alt={block.id} className="rich-image" />
            ) : (
              <>
                <div className="rich-image-icon">🖼️</div>
                <div className="rich-image-text">{block.id}</div>
              </>
            )}
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
