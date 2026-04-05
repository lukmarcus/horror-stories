import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./Button";
import "./BackToMenu.css";

interface BackToMenuProps {
  /** "fixed" — sticky top-left on subpages, "inline" — Button-styled in a row (InputView) */
  variant?: "fixed" | "inline";
}

export const BackToMenu: React.FC<BackToMenuProps> = ({
  variant = "fixed",
}) => {
  if (variant === "inline") {
    return (
      <Link to="/" aria-label="Wróć do menu głównego">
        <Button variant="secondary" size="sm">
          ← Menu główne
        </Button>
      </Link>
    );
  }

  return (
    <Link
      to="/"
      className="back-to-menu--fixed"
      aria-label="Wróć do menu głównego"
    >
      ← Menu główne
    </Link>
  );
};
