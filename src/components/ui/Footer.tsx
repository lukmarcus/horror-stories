import React from "react";
import "./Footer.css";

export interface FooterProps {
  version?: string;
}

export const Footer: React.FC<FooterProps> = ({ version = "v0.0.1" }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <p className="footer__text">
        Horror Stories {version} · Marek Szumny · {currentYear}
      </p>
    </footer>
  );
};
