import React from "react";
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

export const CUSTOM_TAG_PATTERN =
  /<(symbol|letter|item|image|person|enemy|story|room|status|random)\s+id=["']([^"']+)["']\s*\/>/;

type TagRenderer = (
  id: string,
  key: string,
  scenarioId?: string,
  images?: Record<string, string>,
) => React.ReactNode;

export const TAG_RENDERERS: Record<string, TagRenderer> = {
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

/**
 * Parses HTML string and replaces custom tags with React elements
 */
export function parseHtmlWithCustomTags(
  html: string,
  scenarioId?: string,
  images?: Record<string, string>,
): React.ReactNode {
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
}
