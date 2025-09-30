import React from "react";
import { ButtonExtra } from "./ButtonExtra";

export const ButtonAlt = ({ text, buttonText, textColor, to }) => {
  return (
    <div className="w-full flex flex-nowrap justify-center text-md">
      <p className="mr-2">{text}</p>
      <ButtonExtra to={to} className={`text-${textColor}`}>
        {buttonText}
      </ButtonExtra>
    </div>
  );
};
