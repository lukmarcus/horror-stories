import React, { useState } from "react";
import { GameSetupContext } from "./GameSetupContext";
import type { GameSetupState } from "./GameSetupContext";

export const GameSetupProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [setup, setSetup] = useState<GameSetupState | null>(null);

  return (
    <GameSetupContext.Provider value={{ setup, setSetup }}>
      {children}
    </GameSetupContext.Provider>
  );
};
