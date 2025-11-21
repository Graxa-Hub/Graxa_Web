import React from "react";

export const NavButton = ({ activeTab, onTabChange }) => {
  const nav = [
    {
      id: 1,
      name: "Aeroporto",
      value: "aeroporto",
    },
    {
      id: 2,
      name: "Restaurante",
      value: "restaurante",
    },
    {
      id: 3,
      name: "Rota",
      value: "rota",
    },
  ];

  return (
    <ul className="flex justify-self-center gap-5">
      {nav.map((item) => (
        <li key={item.id}>
          <button
            onClick={() => onTabChange(item.value)}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === item.value
                ? "bg-neutral-700 text-white"
                : "font-bold"
            } hover:bg-neutral-700 hover:text-white`}
          >
            {item.name}
          </button>
        </li>
      ))}
    </ul>
  );
};
