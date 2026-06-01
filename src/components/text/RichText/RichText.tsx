import React from "react";
import type { ContentBlock } from "../../../types";
import {
  getPerson,
  getEnemy,
  getLetter,
  getSymbol,
  getStoryItem,
  getRoomItem,
  getStatus,
  getRandomItem,
} from "../../../data/items";
import "./rich-text.css";

const CUSTOM_TAG_PATTERN =
  /<(symbol|letter|item|image|person|enemy|story|room|status|random)\s+id=["']([^"']+)["']\s*\/>/;

type TagRenderer = (
  id: string,
  key: string,
  scenarioId?: string,
  images?: Record<string, string>,
) => React.ReactNode;

const TAG_RENDERERS: Record<string, TagRenderer> = {
  image: (id, key, scenarioId, images) => {
    const dataUrl = images?.[id];
    if (dataUrl) {
      return <img key={key} src={dataUrl} alt={id} className="inline-image" />;
    }
    const imagePath = scenarioId
      ? new URL(
          `../../../scenarios/${scenarioId}/images/${id}.jpg`,
          import.meta.url,
        ).href
      : undefined;
    return imagePath ? (
      <img key={key} src={imagePath} alt={id} className="inline-image" />
    ) : (
      <span key={key} className="rich-image-placeholder">
        🖼️ {id}
      </span>
    );
  },
  symbol: (id, key) => {
    const d = getSymbol(id);
    return d ? (
      <img
        key={key}
        src={d.imagePath}
        alt={id}
        className="symbol-image"
        title={id}
      />
    ) : null;
  },
  letter: (id, key) => {
    const d = getLetter(id);
    return d ? (
      <img
        key={key}
        src={d.imagePath}
        alt={id}
        className="letter-image"
        title={id}
      />
    ) : null;
  },
  item: (id, key) => (
    <span key={key} className="item">
      [{id}]
    </span>
  ),
  random: (id, key) => {
    const d = getRandomItem(id);
    return d ? (
      <img
        key={key}
        src={d.imagePath}
        alt={id}
        className="random-item-image"
        title={d.description || id}
      />
    ) : null;
  },
  story: (id, key) => {
    const d = getStoryItem(id);
    return d ? (
      <img
        key={key}
        src={d.imagePath}
        alt={d.description || id}
        className="story-item-image"
        title={d.description || undefined}
      />
    ) : null;
  },
  room: (id, key) => {
    const d = getRoomItem(id);
    return d ? (
      <img
        key={key}
        src={d.imagePath}
        alt={`Room ${id}`}
        className="room-item-image"
      />
    ) : null;
  },
  person: (id, key) => {
    const d = getPerson(id);
    return d ? (
      <img
        key={key}
        src={d.imagePath}
        alt={id}
        className="person-image"
        title={id}
      />
    ) : null;
  },
  enemy: (id, key) => {
    const d = getEnemy(id);
    return d ? (
      <img
        key={key}
        src={d.imagePath}
        alt={id}
        className="enemy-image"
        title={id}
      />
    ) : null;
  },
  status: (id, key) => {
    const d = getStatus(id);
    return d ? (
      <img
        key={key}
        src={d.imagePath}
        alt={d.description || id}
        className="status-image"
        title={d.description || id}
      />
    ) : null;
  },
};

interface RichTextProps {
  content?: ContentBlock[];
  text?: string; // for backward compatibility
  scenarioId?: string; // for loading images
  images?: Record<string, string>; // user-uploaded images: id → data URL
  noSpacing?: boolean; // disable spacing (for use inside buttons/choices)
}

export const RichText: React.FC<RichTextProps> = ({
  content,
  text,
  scenarioId,
  images,
  noSpacing,
}) => {
  // Parse HTML and replace custom tags with React elements
  const parseHtml = (html: string): React.ReactNode => {
    if (!CUSTOM_TAG_PATTERN.test(html)) {
      return <span dangerouslySetInnerHTML={{ __html: html }} />;
    }

    const customTagRegex = new RegExp(CUSTOM_TAG_PATTERN.source, "g");
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

      const node = TAG_RENDERERS[tag]?.(id, key, scenarioId, images);
      if (node != null) segments.push(node);

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
