import React from "react";

const COLOR_CLASS = {
  white: "text-white",
  black: "text-[var(--text-primary)]",
  orange: "text-[var(--accent)]",
  purple: "text-[var(--text-secondary)]",
  green: "text-[var(--success)]",
};

export const Logo = ({ textColor }) => {
  const colorClass = COLOR_CLASS[textColor] ?? COLOR_CLASS.black;

  return (
    <p
      className={`w-full text-end font-bold text-xl tracking-tight ${colorClass}`}
    >
      Graxa
    </p>
  );
};
