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
    <div className="game__section-header">
      <div>
        <div className="game__section-label">{title}</div>
        {subtitle && (
          <div
            className="game__section-label"
            style={{ marginTop: "var(--spacing-sm)" }}
          >
            {subtitle}
          </div>
        )}
      </div>
      {controls && <div className="game__section-controls">{controls}</div>}
    </div>
  );
};
