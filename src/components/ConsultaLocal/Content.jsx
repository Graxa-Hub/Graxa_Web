import { X } from "lucide-react";

export const Content = ({ titulo }) => {
  return (
    <>
      {/* Cabeçalho */}
      <div className="flex w-full justify-between items-center mb-4 border-b border-neutral-300 pb-2">
        <h2 className="text-lg font-bold">Buscar Restaurante{titulo}</h2>
        <X className="scale-70 color-gray-300 cursor-pointer" />
      </div>

      {/* Input */}
      <div className="">
        <h2>Endereço</h2>
        <input
          type="text"
          className="w-full border border-gray-300 rounded-md p-2 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Digite o endereço"
        />
        <button className="mt-4 w-full bg-gray-700 text-white py-2 rounded-md">
          Buscar
        </button>
      </div>
    </>
  );
};
