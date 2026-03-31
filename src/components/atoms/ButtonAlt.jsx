import React from "react";
import { ButtonExtra } from "./ButtonExtra";

const TEXT_COLOR = {
  "orange-500": "text-[var(--accent)]",
  "green-500": "text-[var(--success)]",
  secondary: "text-[var(--text-secondary)]",
};

const HOVER_CLASS = {
  accent: "hover:text-[var(--accent)]",
  grid: "hover:text-[var(--grid)]",
};

export const ButtonAlt = ({
  text,
  buttonText,
  textColor,
  to,
  hoverColor = "accent",
}) => {
  const colorClass = TEXT_COLOR[textColor] ?? "text-[var(--accent)]";
  const hoverClass = HOVER_CLASS[hoverColor] ?? HOVER_CLASS.accent;

  return (
    <div className="w-full flex flex-nowrap justify-center text-md text-[var(--text-secondary)]">
      <p className="mr-2">{text}</p>
      <ButtonExtra to={to} className={colorClass} hoverClass={hoverClass}>
        {buttonText}
      </ButtonExtra>
    </div>
  );
};
