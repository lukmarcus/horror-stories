import React from "react";
import { useParams } from "react-router-dom";

export const ScenarioSetup: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="container">
      <h1>Scenario Setup</h1>
      <p>Setup for scenario: {id}</p>
    </div>
  );
};
