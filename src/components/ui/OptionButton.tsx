import React from "react";
import { Button } from "./Button";

interface OptionButtonProps {
  icon: string;
  line1: string;
  line2?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export const OptionButton: React.FC<OptionButtonProps> = ({
  icon,
  line1,
  line2,
  onClick,
  disabled,
}) => (
  <Button
    variant="secondary"
    size="sm"
    onClick={onClick}
    disabled={disabled}
    className="option-button"
  >
    <span className="game__option-icon">{icon}</span>
    <span className="game__option-text">
      <span>{line1}</span>
      {line2 && <span>{line2}</span>}
    </span>
  </Button>
);
