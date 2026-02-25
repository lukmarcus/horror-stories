import React from "react";
import type { ContentBlock } from "../../types";
import {
  getPerson,
  getLetter,
  getSymbol,
  getStoryItem,
  getRoomItem,
} from "../../data/items";
import "./rich-text.css";

interface RichTextProps {
  content?: ContentBlock[];
  text?: string; // for backward compatibility
  scenarioId?: string; // for loading images
  noSpacing?: boolean; // disable spacing (for use inside buttons/choices)
}

export const RichText: React.FC<RichTextProps> = ({
  content,
  text,
  scenarioId,
  noSpacing,
}) => {
  // Parse HTML and replace custom tags with React elements
  const parseHtml = (html: string): React.ReactNode => {
    const customTagRegex =
      /<(symbol|letter|item|image|person|story|room)\s+id=["']([^"']+)["']\s*\/>/g;
    let currentPos = 0;
    const finalElements: React.ReactNode[] = [];
    let elementCounter = 0;

    let matchFinal;

    while ((matchFinal = customTagRegex.exec(html)) !== null) {
      // Add HTML before this tag
      const beforeHtml = html.substring(currentPos, matchFinal.index);
      if (beforeHtml) {
        const parsed = parseStandardHtml(beforeHtml, elementCounter);
        if (parsed) {
          finalElements.push(parsed);
        }
      }

      // Add custom element
      const tag = matchFinal[1];
      const id = matchFinal[2];
      const key = `elem-${elementCounter}`;
      elementCounter++;

      if (tag === "image") {
        const imagePath = scenarioId
          ? new URL(
              `../../scenarios/${scenarioId}/images/${id}.jpg`,
              import.meta.url,
            ).href
          : undefined;

        if (imagePath) {
          finalElements.push(
            <img key={key} src={imagePath} alt={id} className="inline-image" />,
          );
        } else {
          finalElements.push(
            <span key={key} className="rich-image-placeholder">
              🖼️ {id}
            </span>,
          );
        }
      } else if (tag === "symbol") {
        const symbolData = getSymbol(id);
        if (symbolData) {
          finalElements.push(
            <img
              key={key}
              src={symbolData.imagePath}
              alt={id}
              className="symbol-image"
              title={id}
            />,
          );
        }
      } else if (tag === "letter") {
        const letterData = getLetter(id);
        if (letterData) {
          finalElements.push(
            <img
              key={key}
              src={letterData.imagePath}
              alt={id}
              className="letter-image"
              title={id}
            />,
          );
        }
      } else if (tag === "item") {
        finalElements.push(
          <span key={key} className="item">
            [{id}]
          </span>,
        );
      } else if (tag === "story") {
        const storyItem = getStoryItem(id);
        if (storyItem) {
          finalElements.push(
            <img
              key={key}
              src={storyItem.imagePath}
              alt={storyItem.description || id}
              className="story-item-image"
              title={storyItem.description || undefined}
            />,
          );
        }
      } else if (tag === "room") {
        const roomItem = getRoomItem(id);
        if (roomItem) {
          finalElements.push(
            <img
              key={key}
              src={roomItem.imagePath}
              alt={`Room ${id}`}
              className="room-item-image"
            />,
          );
        }
      } else if (tag === "person") {
        const personData = getPerson(id);
        if (personData) {
          finalElements.push(
            <img
              key={key}
              src={personData.imagePath}
              alt={id}
              className="person-image"
              title={id}
            />,
          );
        }
      }

      currentPos = customTagRegex.lastIndex;
    }

    // Add remaining HTML
    if (currentPos < html.length) {
      const remainingHtml = html.substring(currentPos);
      if (remainingHtml) {
        const parsed = parseStandardHtml(remainingHtml, elementCounter);
        if (parsed) {
          finalElements.push(parsed);
        }
      }
    }

    return <>{finalElements}</>;
  };

  // Parse standard HTML tags
  const parseStandardHtml = (
    html: string,
    startCounter: number,
  ): React.ReactNode => {
    const div = document.createElement("div");
    div.innerHTML = html;
    let elementCounter = startCounter;

    const traverse = (node: Node): React.ReactNode => {
      const nodeList: React.ReactNode[] = [];

      node.childNodes.forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          const text = child.textContent || "";
          if (text.trim()) {
            nodeList.push(
              <React.Fragment key={`text-${elementCounter}`}>
                {text}
              </React.Fragment>,
            );
          }
          elementCounter++;
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
              nodeList.push(
                <span key={key} className={elem.className}>
                  {childContent}
                </span>,
              );
            } else {
              nodeList.push(childContent);
            }
          } else if (elem.tagName === "STRONG") {
            nodeList.push(<strong key={key}>{childContent}</strong>);
          } else if (elem.tagName === "EM") {
            nodeList.push(<em key={key}>{childContent}</em>);
          } else if (elem.tagName === "U") {
            nodeList.push(<u key={key}>{childContent}</u>);
          } else if (elem.tagName === "BR") {
            nodeList.push(<br key={key} />);
          } else if (elem.tagName === "UL") {
            nodeList.push(<ul key={key}>{childContent}</ul>);
          } else if (elem.tagName === "OL") {
            nodeList.push(<ol key={key}>{childContent}</ol>);
          } else if (elem.tagName === "LI") {
            nodeList.push(<li key={key}>{childContent}</li>);
          } else {
            nodeList.push(childContent);
          }
        }
      });

      return nodeList.length === 0 ? null : nodeList.length === 1 ? (
        nodeList[0]
      ) : (
        <>{nodeList}</>
      );
    };

    return traverse(div);
  };

  // Render content blocks
  const renderContentBlocks = (blocks: ContentBlock[]): React.ReactNode => {
    return (
      <>
        {blocks.map((block, idx) => {
          // Generate stable key from block content
          const blockKey = block.image
            ? `img-${block.image}`
            : block.text
              ? `text-${block.text.substring(0, 20)}`
              : block.id
                ? `id-${block.id}`
                : `block-${idx}`;

          // Handle new image format: {image: "id"}
          if (block.image) {
            const imagePath = scenarioId
              ? new URL(
                  `../../scenarios/${scenarioId}/images/${block.image}.jpg`,
                  import.meta.url,
                ).href
              : undefined;

            const imageClasses = [
              "rich-image-block",
              block.spacing === "none" ? "spacing-none" : "",
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <div key={blockKey} className={imageClasses}>
                {imagePath ? (
                  <img
                    src={imagePath}
                    alt={block.image}
                    className="rich-image"
                  />
                ) : (
                  <>
                    <div className="rich-image-icon">🖼️</div>
                    <div className="rich-image-text">{block.image}</div>
                  </>
                )}
              </div>
            );
          }

          // Handle new text format: {text: "html"} or old format: {type: "text", html: "..."}
          const textContent =
            block.text || (block.type === "text" ? block.html : undefined);
          if (textContent) {
            const classes = [
              "rich-text-block",
              block.size ? `size-${block.size}` : "",
              block.color ? `color-${block.color}` : "",
              block.spacing === "none" ? "spacing-none" : "",
            ]
              .filter(Boolean)
              .join(" ");

            let content: React.ReactNode = parseHtml(textContent);

            // Apply style wrapper if needed (skip bold if color is present, as colors are bold by default)
            if (block.style === "bold" && !block.color) {
              content = <strong>{content}</strong>;
            } else if (block.style === "italic") {
              content = <em>{content}</em>;
            } else if (block.style === "underline") {
              content = <u>{content}</u>;
            }

            return (
              <div key={blockKey} className={classes}>
                {content}
              </div>
            );
          } else if (block.type === "image" && (block.id || block.image)) {
            const imageId = block.image || block.id;
            const imagePath = scenarioId
              ? new URL(
                  `../../scenarios/${scenarioId}/images/${imageId}.jpg`,
                  import.meta.url,
                ).href
              : undefined;

            const imageClasses = [
              "rich-image-block",
              block.spacing === "none" ? "spacing-none" : "",
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <div key={blockKey} className={imageClasses}>
                {imagePath ? (
                  <img src={imagePath} alt={imageId} className="rich-image" />
                ) : (
                  <>
                    <div className="rich-image-icon">🖼️</div>
                    <div className="rich-image-text">{imageId}</div>
                  </>
                )}
              </div>
            );
          }
          return null;
        })}
      </>
    );
  };

  // Backward compatibility: if text prop is provided, use old parser
  if (text && !content) {
    const blockClass = noSpacing
      ? "rich-text-block spacing-none"
      : "rich-text-block";
    return (
      <div className="rich-text">
        <div className={blockClass}>{parseHtml(text)}</div>
      </div>
    );
  }

  return (
    <div className="rich-text">
      {content ? renderContentBlocks(content) : null}
    </div>
  );
};
