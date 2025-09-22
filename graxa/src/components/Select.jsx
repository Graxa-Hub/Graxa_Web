import React from "react";

export const Select = ({ children }) => {
  return (
    <div>
      <select
        className={`w-full py-2 px-3 rounded-sm border border-gray-400 outline-none bg-transparent
        focus:ring-2 focus:bg-white`}
      >
        <option disabled selected hidden>
          Selecione a opção
        </option>
        {children}
      </select>
    </div>
  );
};
