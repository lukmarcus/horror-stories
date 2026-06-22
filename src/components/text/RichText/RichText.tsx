import React from "react";
import type { ContentBlock } from "../../../types";
import { parseHtmlWithCustomTags } from "./customTagRenderers";
import { renderContentBlocks } from "./contentBlockRenderer";
import "./rich-text.css";

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
  // Backward compatibility: if text prop is provided, use old parser
  if (text && !content) {
    const blockClass = noSpacing
      ? "rich-text-block spacing-none"
      : "rich-text-block";
    return (
      <>
        <div className={blockClass}>
          {parseHtmlWithCustomTags(text, scenarioId, images)}
        </div>
      </>
    );
  }

  return (
    <>{content ? renderContentBlocks(content, scenarioId, images) : null}</>
  );
};
