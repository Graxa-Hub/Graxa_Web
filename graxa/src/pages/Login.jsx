import React from "react";
import { Input } from "../components/Input";
import { VoltarButton } from "../components/VoltarButton";
import { Label } from "../components/Label";
import { ButtonExtra } from "../components/ButtonExtra";
import { ButtonLogarCadastrar } from "../components/ButtonLogarCadastrar";

export const Login = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center bg-gray-600 bg-[url('/login-bg.png')] bg-cover bg-center bg-no-repeat">
      <div className="w-[80vw] grid grid-cols-2 shadow-md">
        <div className="w-full p-6 rounded-bl-xl rounded-tl-xl bg-gray-50">
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

            <ButtonExtra>Esqueceu a senha?</ButtonExtra>

            <ButtonLogarCadastrar className="transition duration-0 ease-in-out hover:bg-orange-500">
              Entrar
            </ButtonLogarCadastrar>

            <div className="w-full flex flex-nowrap justify-center text-md">
              <p className="mr-2">Não tem conta? </p>
              <ButtonExtra to="/cadastro" className="text-orange-500">
                Cadastre-se
              </ButtonExtra>
            </div>

            <p className="w-full text-end font-bold text-orange-500 text-xl">
              Graxa
            </p>
          </form>
        </div>
        <div className="w-full h-full bg-orange-500 grid-background rounded-tr-lg rounded-br-lg"></div>
      </div>
    </div>
  );
};
