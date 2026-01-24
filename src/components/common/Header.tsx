import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Header.css";

export interface HeaderProps {
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({ title = "Horror Stories" }) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="header">
      <div className="header__container">
        <Link to="/" className="header__logo-section">
          <img
            src="/assets/images/logo.png"
            alt="Horror Stories"
            className="header__logo"
          />
          <div className="header__branding">
            <h1 className="header__title">{title}</h1>
            <p className="header__subtitle">Aplikacja towarzysząca</p>
          </div>
        </Link>

        <nav className="header__nav">
          <Link
            to="/"
            className={`header__nav-link ${isActive("/") ? "header__nav-link--active" : ""}`}
          >
            Strona główna
          </Link>
          <Link
            to="/scenarios"
            className={`header__nav-link ${isActive("/scenarios") ? "header__nav-link--active" : ""}`}
          >
            Graj
          </Link>
          <Link
            to="/instructions"
            className={`header__nav-link ${isActive("/instructions") ? "header__nav-link--active" : ""}`}
          >
            Instrukcja
          </Link>
          <Link
            to="/about"
            className={`header__nav-link ${isActive("/about") ? "header__nav-link--active" : ""}`}
          >
            O grze
          </Link>
        </nav>
      </div>
    </header>
  );
};
