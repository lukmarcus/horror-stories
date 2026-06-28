import React from "react";
import type { ContentBlock } from "../../../types";
import { parseHtmlWithCustomTags } from "./customTagRenderers";

/**
 * Renders an array of ContentBlock objects as React nodes
 */
export function renderContentBlocks(
  blocks: ContentBlock[],
  scenarioId?: string,
  images?: Record<string, string>,
): React.ReactNode {
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
          const dataUrl = images?.[block.image];
          const imagePath =
            dataUrl ??
            (scenarioId
              ? new URL(
                  `../../../scenarios/${scenarioId}/images/${block.image}.jpg`,
                  import.meta.url,
                ).href
              : undefined);

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
                <img src={imagePath} alt={block.image} className="rich-image" />
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

          let content: React.ReactNode = parseHtmlWithCustomTags(
            textContent,
            scenarioId,
            images,
          );

          // Apply style wrappers (normalize to array for backward compat)
          const styles = Array.isArray(block.style)
            ? block.style
            : block.style
              ? [block.style]
              : [];
          if (styles.includes("underline")) content = <u>{content}</u>;
          if (styles.includes("italic")) content = <em>{content}</em>;
          if (styles.includes("bold") && !block.color)
            content = <strong>{content}</strong>;

          return (
            <div key={blockKey} className={classes}>
              {content}
            </div>
          );
        } else if (block.type === "image" && (block.id || block.image)) {
          const imageId = block.image || block.id;
          const dataUrl = images?.[imageId!];
          const imagePath =
            dataUrl ??
            (scenarioId
              ? new URL(
                  `../../../scenarios/${scenarioId}/images/${imageId}.jpg`,
                  import.meta.url,
                ).href
              : undefined);

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
}
