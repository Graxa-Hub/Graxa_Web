import React from "react";
import { Input } from "../components/Input";
import { VoltarButton } from "../components/VoltarButton";
import { Label } from "../components/Label";
import { ButtonExtra } from "../components/ButtonExtra";
import { ButtonLogarCadastrar } from "../components/ButtonLogarCadastrar";

export const Cadastro = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center bg-[url('/cadastro-bg.png')] bg-cover bg-center">
      <div className="w-[80vw] h-[90vh] grid grid-cols-2 shadow-md ">
        <div className="w-full h-full bg-purple-950 grid-background rounded-tl-lg rounded-bl-lg"></div>
        <div className="w-full h-full p-6 rounded-br-xl rounded-tr-xl bg-white">
          {/* Botão de voltar */}
          <VoltarButton to="/">Voltar</VoltarButton>

          {/* Título */}
          <div className="mt-8 text-gray-900">
            <h2 className="text-3xl font-bold">Faça seu login</h2>
            <p className="mt-2">Entre na sua conta para organizar a sua vida</p>
          </div>

          {/* Formulário */}
          <form className="mt-6 space-y-6">
            <div>
              <Label>Email:</Label>
              <Input placeholder={"seu@email.com"} />
            </div>
            <div className="mt-2">
              <Label>Senha:</Label>
              <Input type="password" placeholder={"********"} />
            </div>
            <div className="mt-2">
              <Label>Email:</Label>
              <Input type="password" placeholder={"seu@email.com"} />
            </div>
            <div className="mt-2">
              <Label>Telefone:</Label>
              <Input type="password" placeholder={"(11) 99999-8888"} />
            </div>
            <div className="mt-2">
              <Label>Senha:</Label>
              <Input type="password" placeholder={"********"} />
            </div>
            <div className="mt-2">
              <Label>Confirmar Senha:</Label>
              <Input type="password" placeholder={"********"} />
            </div>
            <div className="mt-2">
              <Label>Tipo de usuário:</Label>
              <Input type="password" placeholder={"Selecione a opção"} />
            </div>

            <ButtonLogarCadastrar>Criar Conta</ButtonLogarCadastrar>

            <div className="w-full flex flex-nowrap justify-center">
              <p className="text-sm mr-2">Já tem uma conta? </p>
              <ButtonExtra to="/cadastro" className="text-purple-950">
                Faça Login
              </ButtonExtra>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
