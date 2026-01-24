import React from "react";
import { Link } from "react-router-dom";

export const Home: React.FC = () => {
  return (
    <div className="container">
      <h1>Witaj w Horror Stories</h1>
      <p>Aplikacja towarzysząca grze planszowej Horror Stories.</p>
      <p>
        Wybierz scenariusz, aby rozpocząć grę lub zapoznaj się z dostępnymi
        opcjami.
      </p>

      <div className="home__actions">
        <Link to="/scenarios">
          <button>Graj</button>
        </Link>
        <Link to="/instructions">
          <button>Instrukcja</button>
        </Link>
        <Link to="/about">
          <button>O Grze</button>
        </Link>
      </div>
    </div>
  );
};
