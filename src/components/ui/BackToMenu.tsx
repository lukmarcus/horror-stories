import React from "react";
import { Link } from "react-router-dom";
import { OptionButton } from "./OptionButton";

export const BackToMenu: React.FC = () => (
  <Link to="/" aria-label="Wróć do menu głównego">
    <OptionButton icon="⬅️" line1="Menu" line2="główne" />
  </Link>
);
