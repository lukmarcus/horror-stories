import React from "react";
import type { ContentBlock } from "../../../types";
import {
  getPerson,
  getLetter,
  getSymbol,
  getStoryItem,
  getRoomItem,
} from "../../../data/items";
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

    // Check if there are any custom tags at all
    if (!customTagRegex.test(html)) {
      return <span dangerouslySetInnerHTML={{ __html: html }} />;
    }

    // Reset regex
    customTagRegex.lastIndex = 0;

    let currentPos = 0;
    const segments: React.ReactNode[] = [];
    let counter = 0;

    let match;
    while ((match = customTagRegex.exec(html)) !== null) {
      // Plain HTML before this custom tag
      const beforeHtml = html.substring(currentPos, match.index);
      if (beforeHtml) {
        segments.push(
          <span
            key={`html-${counter}`}
            dangerouslySetInnerHTML={{ __html: beforeHtml }}
          />,
        );
        counter++;
      }

      const tag = match[1];
      const id = match[2];
      const key = `custom-${counter}`;
      counter++;

      if (tag === "image") {
        const imagePath = scenarioId
          ? new URL(
              `../../../scenarios/${scenarioId}/images/${id}.jpg`,
              import.meta.url,
            ).href
          : undefined;
        if (imagePath) {
          segments.push(
            <img key={key} src={imagePath} alt={id} className="inline-image" />,
          );
        } else {
          segments.push(
            <span key={key} className="rich-image-placeholder">
              🖼️ {id}
            </span>,
          );
        }
      } else if (tag === "symbol") {
        const symbolData = getSymbol(id);
        if (symbolData) {
          segments.push(
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
          segments.push(
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
        segments.push(
          <span key={key} className="item">
            [{id}]
          </span>,
        );
      } else if (tag === "story") {
        const storyItem = getStoryItem(id);
        if (storyItem) {
          segments.push(
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
          segments.push(
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
          segments.push(
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

    // Remaining HTML after last custom tag
    if (currentPos < html.length) {
      const remaining = html.substring(currentPos);
      if (remaining) {
        segments.push(
          <span
            key={`html-${counter}`}
            dangerouslySetInnerHTML={{ __html: remaining }}
          />,
        );
      }
    }

    return <>{segments}</>;
  };

  // Render content blocks
  const renderContentBlocks = (blocks: ContentBlock[]): React.ReactNode => {
    return (
      <>
        {blocks.map((block, idx) => {
          // Generate stable key from block content + index to ensure uniqueness
          const blockKey = block.image
            ? `img-${block.image}-${idx}`
            : block.text
              ? `text-${block.text.substring(0, 20)}-${idx}`
              : block.id
                ? `id-${block.id}-${idx}`
                : `block-${idx}`;

          const isLastBlock = idx === blocks.length - 1;

          // Handle new image format: {image: "id"}
          if (block.image) {
            const imagePath = scenarioId
              ? new URL(
                  `../../../scenarios/${scenarioId}/images/${block.image}.jpg`,
                  import.meta.url,
                ).href
              : undefined;

            const imageClasses = [
              "rich-image-block",
              block.spacing === "none" ? "spacing-none" : "",
              isLastBlock ? "is-last-block" : "",
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
              isLastBlock ? "is-last-block" : "",
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
                  `../../../scenarios/${scenarioId}/images/${imageId}.jpg`,
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
      <>
        <div className={blockClass}>{parseHtml(text)}</div>
      </>
    );
  }

  return <>{content ? renderContentBlocks(content) : null}</>;
};
