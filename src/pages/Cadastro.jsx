import React from "react";
import { Input } from "../components/LoginCadastro/Input";
import { Label } from "../components/LoginCadastro/Label";
import { Layout } from "../components/LoginCadastro/Layout";
import { Grid } from "../components/LoginCadastro/Grid";
import { Titulo } from "../components/LoginCadastro/Titulo";
import { Forms } from "../components/LoginCadastro/Forms";
import { Logo } from "../components/LoginCadastro/Logo";
import { ButtonAlt } from "../components/LoginCadastro/ButtonAlt";
import { ButtonSign } from "../components/LoginCadastro/ButtonSign";

export const Cadastro = () => {
  return (
    <Layout backgroundImage="/cadastro-bg2.png" padding="py-10">
      {/* Tela Roxo a Esquerda */}
      <Grid
        backgroundColor="bg-purple-950"
        borderRadius="rounded-tl-lg rounded-bl-lg"
      />
      <div className="w-full p-6 rounded-br-xl rounded-tr-xl bg-gray-50">
        {/* Título */}
        <Titulo
          titulo="Crie a sua conta"
          descricao="Comece a sua jornada conosco!"
        />

        {/* Formulário */}
        <Forms>
          {/* Nome */}
          <div className="grid grid-cols-2 gap-5">
            <div className="">
              <Label>Nome:</Label>
              <Input placeholder={"Nome"} />
            </div>

            {/* Sobrenome */}
            <div className="">
              <Label>Sobrenome:</Label>
              <Input placeholder={"Sobrenome"} />
            </div>
          </div>

          {/* Data de Nascimento */}
          <div className="grid grid-cols-2 gap-5">
            <div className="">
              <Label>Data de Nascimento:</Label>
              <Input type="date" placeholder={"Nome"} />
            </div>

            {/* Telefone */}
            <div className="">
              <Label>Telefone:</Label>
              <Input placeholder={"(11) 99999-8888"} />
            </div>
          </div>

          {/* CPF */}
          <div className="">
            <Label>CPF:</Label>
            <Input placeholder={"000.000.000-00"} />
          </div>

          {/* Email */}
          <div className="">
            <Label>Email:</Label>
            <Input type="password" placeholder={"seu@email.com"} />
          </div>

          {/* Senha */}
          <div className="">
            <Label>Senha:</Label>
            <Input type="password" placeholder={"********"} />
          </div>

          {/* Confirmar Senha */}
          <div className="">
            <Label>Confirmar Senha:</Label>
            <Input type="password" placeholder={"********"} />
          </div>

          {/* Button de Cadastrar */}
          <ButtonSign className="hover:bg-purple-950">Cadastrar</ButtonSign>

          {/* Já tem uma conta? Button */}
          <ButtonAlt
            text={"Já tem uma conta?"}
            buttonText={"Faça Login"}
            textColor="purple-950"
            to={"../login"}
          />

          {/* Logo Graxa no final do Card */}
          <Logo textColor="purple-950" />
        </Forms>
      </div>
    </Layout>
  );
};
