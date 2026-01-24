// Paragraph component placeholder
import React from "react";
import type { Paragraph as ParagraphType } from "../../types";

export interface ParagraphProps {
  paragraph: ParagraphType;
}

export const Paragraph: React.FC<ParagraphProps> = ({ paragraph }) => {
  return <div>{paragraph.text}</div>;
};
