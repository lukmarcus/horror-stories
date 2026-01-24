import React from "react";
import "./Header.css";

export interface HeaderProps {
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({ title = "Horror Stories" }) => {
  return (
    <header className="header">
      <div className="header__container">
        <h1 className="header__title">{title}</h1>
        <p className="header__subtitle">
          Companion App for Horror Stories Board Game
        </p>
      </div>
    </header>
  );
};
