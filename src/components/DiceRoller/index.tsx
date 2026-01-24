// DiceRoller component placeholder
import React from "react";

export interface DiceRollerProps {
  dice?: number;
  sides?: number;
}

export const DiceRoller: React.FC<DiceRollerProps> = ({
  dice = 1,
  sides = 6,
}) => {
  return (
    <div>
      Dice Roller: {dice}d{sides}
    </div>
  );
};
