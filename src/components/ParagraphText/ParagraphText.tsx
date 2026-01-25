import React from "react";
import { parseParagraphText } from "../../utils/paragraphParser";
import type { ParsedTag } from "../../utils/paragraphParser";
import styles from "./ParagraphText.module.css";

interface ParagraphTextProps {
  text: string;
  className?: string;
}

const TagComponent: React.FC<{ tag: ParsedTag }> = ({ tag }) => {
  const tagClassName = `${styles.tag} ${styles[`tag-${tag.type}`]}`;

  return (
    <span className={tagClassName} title={`${tag.type}: ${tag.value}`}>
      {tag.value}
    </span>
  );
};

export const ParagraphText: React.FC<ParagraphTextProps> = ({
  text,
  className = "",
}) => {
  const segments = parseParagraphText(text);

  return (
    <div className={`${styles.paragraph} ${className}`}>
      {segments.map((segment, index) => {
        if (segment.type === "text") {
          return <span key={index}>{segment.content}</span>;
        }

        if (segment.type === "tag" && segment.tag) {
          return <TagComponent key={index} tag={segment.tag} />;
        }

        return null;
      })}
    </div>
  );
};
