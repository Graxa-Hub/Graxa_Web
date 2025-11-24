import React from "react";
import { ButtonNav } from "../components/ButtonNav";
import { Navbar } from "../components/Dashboard/Navbar";
import { SecondaryNav } from "../components/Dashboard/SecondaryNav";
import { RootLayout } from "../components/Dashboard/RootLayout";
import { Layout } from "lucide-react";

export function CadastroLocal() {
  return (
    <div className="min-h-screen flex">


      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center py-10">
        <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-4xl border border-gray-300">
          <h2 className="text-2xl font-semibold mb-2 text-gray-700">
            Cadastro do Local
          </h2>
          <br />
          
          <form className="space-y-6">
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nome do Evento:
                </label>
                <input
                  type="text"
                  className="mt-1 w-full border rounded-md p-2 focus:ring focus:ring-yellow-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Mini Descrição:
                </label>
                <input
                  type="text"
                  className="mt-1 w-full border rounded-md p-2 focus:ring focus:ring-yellow-200"
                />
              </div>
            </div>

            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Estado:
                </label>
                <input
                  type="text"
                  className="mt-1 w-full border rounded-md p-2 focus:ring focus:ring-yellow-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Cidade:
                </label>
                <input
                  type="text"
                  className="mt-1 w-full border rounded-md p-2 focus:ring focus:ring-yellow-200"
                />
              </div>
            </div>


            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Endereço:
                </label>
                <input
                  type="text"
                  className="mt-1 w-full border rounded-md p-2 focus:ring focus:ring-yellow-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Complemento:
                </label>
                <input
                  type="text"
                  className="mt-1 w-full border rounded-md p-2 focus:ring focus:ring-yellow-200"
                />
              </div>
            </div>

            <hr className="my-6 border-gray-300" />

            
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Informações adicionais
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Data Início:
                </label>
                <input
                  type="date"
                  className="mt-1 w-full border rounded-md p-2 focus:ring focus:ring-yellow-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Data Término:
                </label>
                <input
                  type="date"
                  className="mt-1 w-full border rounded-md p-2 focus:ring focus:ring-yellow-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Horário Início:
                </label>
                <input
                  type="time"
                  className="mt-1 w-full border rounded-md p-2 focus:ring focus:ring-yellow-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Horário Término:
                </label>
                <input
                  type="time"
                  className="mt-1 w-full border rounded-md p-2 focus:ring focus:ring-yellow-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Anexo:
              </label>
              <input
                type="file"
                className="mt-1 w-full border rounded-md p-2 bg-white focus:ring focus:ring-yellow-200"
                multiple
              />
              <p className="text-sm text-gray-500 mt-1">Exemplo: imagem.png, documento.pdf</p>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="px-6 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
              >
                Salvar Local
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}