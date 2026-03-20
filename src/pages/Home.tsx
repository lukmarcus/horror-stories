import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui";
import "../styles/pages/home.css";

export const Home: React.FC = () => {
  return (
    <main className="home">
      {/* Hero Section */}
      <section className="home__hero">
        <div className="home__hero-content">
          <h1 className="home__title">Horror Stories</h1>
          <p className="home__subtitle">
            Aplikacja towarzysząca grze planszowej
          </p>
          <p className="home__description">
            Zanurz się w świat strachu i tajemnic. Odkrywaj scenariusze,
            podejmuj decyzje i walcz o przetrwanie.
          </p>

          <div className="home__hero-actions">
            <Link to="/scenarios">
              <Button variant="primary" size="lg">
                Rozpocznij grę
              </Button>
            </Link>
            <Link to="/instructions">
              <Button variant="outline" size="lg">
                Instrukcja
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="home__features">
        <h2 className="home__section-title">Co czeka Cię w grze?</h2>

        <div className="home__cards">
          <div className="home__card">
            <div className="home__card-icon">🎭</div>
            <h3 className="home__card-title">Bogate Scenariusze</h3>
            <p className="home__card-text">
              Odkrywaj różne światy pełne tajemnic i nieoczekiwanych zwrotów
              akcji.
            </p>
          </div>

          <div className="home__card">
            <div className="home__card-icon">🎲</div>
            <h3 className="home__card-title">Mechanika Kości</h3>
            <p className="home__card-text">
              Los jest w Twoich rękach. Każdy rzut może zmienić całą historię.
            </p>
          </div>

          <div className="home__card">
            <div className="home__card-icon">🎵</div>
            <h3 className="home__card-title">Atmosfera Dźwięków</h3>
            <p className="home__card-text">
              Immersyjne dźwięki tła pogłębiają atmosferę rozgrywki.
            </p>
          </div>

          <div className="home__card">
            <div className="home__card-icon">📱</div>
            <h3 className="home__card-title">Responsive Design</h3>
            <p className="home__card-text">
              Graj na dowolnym urządzeniu — telefonie, tablecie lub komputerze.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="home__cta">
        <h2 className="home__section-title">Gotów na wyzwanie?</h2>
        <p className="home__cta-text">
          Wybierz scenariusz i zacznij swoją przygodę w Horror Stories.
        </p>

        <div className="home__cta-actions">
          <Link to="/scenarios">
            <Button variant="primary" size="lg">
              Wybieram scenariusz
            </Button>
          </Link>
          <Link to="/about">
            <Button variant="text" size="lg">
              Dowiedz się więcej
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
};
