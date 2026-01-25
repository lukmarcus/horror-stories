import { createContext, useContext } from "react";

export interface GameSetupState {
  playerCount: number;
  difficulty: "easy" | "medium" | "hard";
  soundEnabled: boolean;
}

export interface GameSetupContextType {
  setup: GameSetupState | null;
  setSetup: (setup: GameSetupState) => void;
}

export const GameSetupContext = createContext<GameSetupContextType | undefined>(
  undefined,
);

export const useGameSetup = () => {
  const context = useContext(GameSetupContext) as
    | GameSetupContextType
    | undefined;
  if (!context) {
    throw new Error("useGameSetup must be used within GameSetupProvider");
  }
  return context;
};
