import React from "react";
import { useParams } from "react-router-dom";

export const Game: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="container">
      <h1>Game</h1>
      <p>Game screen for scenario: {id}</p>
    </div>
  );
};
