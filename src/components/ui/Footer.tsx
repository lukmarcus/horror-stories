import React from "react";
import "./Footer.css";

export interface FooterProps {
  version?: string;
}

export const Footer: React.FC<FooterProps> = ({ version = "v0.0.1" }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__content">
          <div className="footer__section">
            <p className="footer__text">
              © {currentYear} Horror Stories Companion App
            </p>
            <p className="footer__version">Version {version}</p>
          </div>

          <div className="footer__section">
            <p className="footer__credit">
              Made with <span className="footer__heart">♠</span> for board game
              enthusiasts
            </p>
          </div>

          <div className="footer__section footer__section--right">
            <p className="footer__legal">
              <a href="#" className="footer__link">
                Privacy Policy
              </a>
              {" · "}
              <a href="#" className="footer__link">
                License (MIT)
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
