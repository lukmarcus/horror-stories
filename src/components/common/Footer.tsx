import React from "react";
import "./Footer.css";

export interface FooterProps {
  version?: string;
}

export const Footer: React.FC<FooterProps> = ({ version = "v0.0.0" }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__content">
          <p className="footer__text">
            © {currentYear} Horror Stories Companion App. Made with{" "}
            <span className="footer__heart">♠</span> for board game enthusiasts.
          </p>
          <p className="footer__version">Version {version}</p>
        </div>
      </div>
    </footer>
  );
};
