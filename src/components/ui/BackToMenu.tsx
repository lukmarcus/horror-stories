import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./Button";

export const BackToMenu: React.FC = () => {
  return (
    <Link to="/" aria-label="Wróć do menu głównego">
      <Button variant="secondary" size="sm">
        <span className="game__option-icon">⬅️</span>
        <span className="game__option-text">
          <span>Menu</span>
          <span>główne</span>
        </span>
      </Button>
    </Link>
  );
};
