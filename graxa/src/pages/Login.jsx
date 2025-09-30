import React from "react";
import { Input } from "../components/LoginCadastro/Input";
import { Label } from "../components/LoginCadastro/Label";
import { ButtonExtra } from "../components/LoginCadastro/ButtonExtra";
import { ButtonSign } from "../components/LoginCadastro/ButtonSign";
import { Layout } from "../components/LoginCadastro/Layout";
import { Grid } from "../components/LoginCadastro/Grid";
import { Titulo } from "../components/LoginCadastro/Titulo";
import { Forms } from "../components/LoginCadastro/Forms";
import { ButtonAlt } from "../components/LoginCadastro/ButtonAlt";
import { Logo } from "../components/LoginCadastro/Logo";

export const Login = () => {
  return (
    <Layout backgroundImage="/login-bg.png">
      <div className="p-6 rounded-bl-xl rounded-tl-xl bg-gray-50">
        {/* Título */}
        <Titulo
          titulo="Faça seu login"
          descricao="Entre na sua conta para organizar a sua vida"
        />

        {/* Formulário */}
        <Forms>
          {/* Email */}
          <div>
            <Label>Email:</Label>
            <Input placeholder={"seu@email.com"} />
          </div>

          {/* Senha */}
          <div className="mt-2">
            <Label>Senha:</Label>
            <Input type="password" placeholder={"********"} />
          </div>

          {/* Esqueceu a senha */}
          <ButtonExtra>Esqueceu a senha?</ButtonExtra>

          {/* Button de Logar */}
          <ButtonSign className="hover:bg-orange-500">Entrar</ButtonSign>

          {/* Button login para cadastro */}
          <ButtonAlt
            text={"Não tem conta?"}
            buttonText={"Cadastre-se"}
            textColor={"orange-500"}
            to={"../cadastro"}
          />

          {/* Logo */}
          <Logo />
        </Forms>
      </div>

      {/* Tela Laranja a Direita */}
      <Grid
        backgroundColor="bg-orange-500"
        borderRadius="rounded-tr-lg rounded-br-lg"
      />
    </Layout>
  );
};
