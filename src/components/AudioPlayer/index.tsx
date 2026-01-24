// AudioPlayer component placeholder
import React from "react";

export interface AudioPlayerProps {
  src?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ src }) => {
  return <div>Audio Player: {src || "No audio"}</div>;
};
