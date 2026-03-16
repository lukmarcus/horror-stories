import React from "react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  controls?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  controls,
}) => {
  return (
    <div className="game__scenario-header">
      <div>
        <div className="game__scenario-label">{title}</div>
        {subtitle && (
          <div
            className="game__scenario-label"
            style={{ marginTop: "var(--spacing-sm)" }}
          >
            {subtitle}
          </div>
        )}
      </div>
      {controls && <div className="game__scenario-controls">{controls}</div>}
    </div>
  );
};
