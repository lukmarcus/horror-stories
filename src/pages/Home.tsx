import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import packageJson from "../../package.json";
import "../styles/pages/home.css";

export const Home: React.FC = () => {
  return (
    <main className="home">
      <div className="home__glow" aria-hidden="true" />

      <div className="home__content">
        <div className="home__logo-wrap">
          <img src={logo} alt="Horror Stories" className="home__logo" />
        </div>

        <div className="home__heading">
          <h1 className="home__title">Horror Stories</h1>
          <p className="home__subtitle">
            Aplikacja towarzysząca grze planszowej
          </p>
        </div>

        <Link to="/scenarios" className="home__play-btn">
          Wybierz scenariusz
        </Link>

        <nav className="home__secondary">
          <Link to="/instructions" className="home__secondary-card">
            <span className="home__secondary-icon">📖</span>
            <span>Instrukcja</span>
          </Link>
          <Link to="/about" className="home__secondary-card">
            <span className="home__secondary-icon">ℹ️</span>
            <span>O grze</span>
          </Link>
        </nav>

        <p className="home__footer-text">
          Horror Stories v{packageJson.version} · Marek Szumny ·{" "}
          {new Date().getFullYear()}
        </p>
      </div>
    </main>
  );
};
