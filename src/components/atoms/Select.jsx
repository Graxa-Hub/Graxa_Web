import React from "react";

export const Select = ({ children }) => {
  return (
    <div>
      <select className="form-input">
        <option disabled selected hidden>
          Selecione a opção
        </option>
        {children}
      </select>
    </div>
  );
};
