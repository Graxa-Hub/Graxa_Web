import React from "react";
import { ButtonExtra } from "./ButtonExtra";

const TEXT_COLOR = {
  "orange-500": "text-[var(--accent)]",
  "green-500": "text-[var(--success)]",
  secondary: "text-[var(--text-secondary)]",
};

export const ButtonAlt = ({ text, buttonText, textColor, to }) => {
  const colorClass = TEXT_COLOR[textColor] ?? "text-[var(--accent)]";

  return (
    <div className="w-full flex flex-nowrap justify-center text-md text-[var(--text-secondary)]">
      <p className="mr-2">{text}</p>
      <ButtonExtra to={to} className={colorClass}>
        {buttonText}
      </ButtonExtra>
    </div>
  );
};
