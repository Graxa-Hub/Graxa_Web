import { Sun, Wind } from "lucide-react";

const climas = [
  { id: 1, tempo: "15:00", temp: "26°C", vento: "3km/h" },
  { id: 2, tempo: "18:00", temp: "26°C", vento: "3km/h" },
  { id: 3, tempo: "21:00", temp: "26°C", vento: "3km/h" },
];

export const ClimaCard = () => (
  <div className="w-full flex flex-row items-center justify-end gap-4">
    {climas.map((clima) => (
      <div
        key={clima.id}
        className="flex flex-col items-center justify-between bg-white h-50 w-30 p-2 rounded-xl"
      >
        <h2 className="text-xl font-bold">{clima.tempo}</h2>
        <Sun className="text-yellow-500 scale-130" />
        <p className="text-xl">{clima.temp}</p>
        <Wind className="text-blue-400 scale-130" />
        <p className="text-xl">{clima.vento}</p>
      </div>
    ))}
  </div>
);
