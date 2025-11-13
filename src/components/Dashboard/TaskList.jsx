import React from "react";

let task = [
  {
    horas: "8:00 - 8:30 AM",
    atividade: "Monthly catch-up",
  },
];

export const TaskList = () => {
  return (
    <div className="w-full overflow-auto p-4">
      <ul className="flex flex-col gap-3">
        <h1 className="text-center text-blue-600">
          Dias de evento registrado:
        </h1>
        <li className="flex items-center gap-5">
          <div className="h-3 w-3 bg-red-400 rounded-full"></div>
          <div className="flex flex-col">
            {task.map((tasks) => {
              <>
                <h2 className="text-neutral-400">{tasks.horas}</h2>
                <p>{tasks.atividade}</p>
              </>;
            })}
          </div>
        </li>
      </ul>
    </div>
  );
};
