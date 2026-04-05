import React from "react";
import { Link } from "react-router-dom";
import "./BackToMenu.css";

interface BackToMenuProps {
  /** "fixed" — position:fixed top-left (subpages), "inline" — plain link in a row (InputView) */
  variant?: "fixed" | "inline";
}

export const BackToMenu: React.FC<BackToMenuProps> = ({
  variant = "fixed",
}) => {
  return (
    <Link
      to="/"
      className={`back-to-menu back-to-menu--${variant}`}
      aria-label="Wróć do menu głównego"
    >
      ← Menu główne
    </Link>
  );
};
