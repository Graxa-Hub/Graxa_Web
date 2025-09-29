import React from "react";
import { Input } from "../components/Input";
import { ButtonVoltar } from "../components/ButtonVoltar";
import { Label } from "../components/Label";
import { ButtonExtra } from "../components/ButtonExtra";
import { ButtonLogarCadastrar } from "../components/ButtonLogarCadastrar";
import { Select } from "../components/Select";

export const Cadastro = () => {
  return (
    <div className="w-full py-3 flex justify-center items-center bg-gray-600 bg-[url('/cadastro-bg.png')] bg-cover bg-center">
      <div className="w-full mx-20 grid grid-cols-2 shadow-md">
        <div className="w-full h-full bg-purple-950 grid-background rounded-tl-lg rounded-bl-lg"></div>
        <div className="w-full p-6 rounded-br-xl rounded-tr-xl bg-gray-50">
          {/* Botão de voltar */}
          <ButtonVoltar to="/">Voltar</ButtonVoltar>

          {/* Título */}
          <div className="mt-8 text-gray-900">
            <h2 className="text-3xl font-bold">Cria a sua conta</h2>
            <p className="mt-2">Comece a sua jornada conosco!</p>
          </div>

          {/* Formulário */}
          <form className="mt-6 space-y-6">
            <div className="grid grid-cols-2 gap-5">
              <div className="">
                <Label>Nome:</Label>
                <Input placeholder={"Nome"} />
              </div>
              <div className="">
                <Label>Sobrenome:</Label>
                <Input placeholder={"Sobrenome"} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div className="">
                <Label>Data de Nascimento:</Label>
                <Input type="date" placeholder={"Nome"} />
              </div>
              <div className="">
                <Label>Telefone:</Label>
                <Input placeholder={"(11) 99999-8888"} />
              </div>
            </div>
            <div className="">
              <Label>CPF:</Label>
              <Input placeholder={"000.000.000-00"} />
            </div>
            <div className="">
              <Label>Email:</Label>
              <Input type="password" placeholder={"seu@email.com"} />
            </div>
            <div className="">
              <Label>Senha:</Label>
              <Input type="password" placeholder={"********"} />
            </div>
            <div className="">
              <Label>Confirmar Senha:</Label>
              <Input type="password" placeholder={"********"} />
            </div>

            <ButtonLogarCadastrar className="hover:bg-purple-500">
              Criar Conta
            </ButtonLogarCadastrar>

            <div className="text-dm w-full flex flex-nowrap justify-center">
              <p className="mr-2">Já tem uma conta? </p>
              <ButtonExtra to="/login" className="text-purple-950">
                Faça Login
              </ButtonExtra>
            </div>

            <p className="w-full text-end font-bold text-purple-950 text-xl">
              Graxa
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
