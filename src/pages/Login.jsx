import React, { useState } from "react";
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
import { useLogin } from "../hooks/useLogin";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const { handleLogin, loading } = useLogin();
  const { loginToContext } = useAuth();
  const navigate = useNavigate();

  // note: responsive hiding of Grid is handled in markup via Tailwind classes

  const loginUser = async () => {
    const errors = {};

    if (!email.trim()) errors.identificador = "Preencha o email";
    if (!senha.trim()) errors.senha = "Preencha a senha";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});

    const data = await handleLogin({
      identificador: email.trim(),
      senha: senha.trim(),
    });

    if (data?.token) {
      loginToContext(data);
      navigate("/dashboard");
    } else if (Array.isArray(data?.erros)) {
      const errorsByField = data.erros.reduce((acc, err) => {
        acc[err.campo] = err.mensagem;
        return acc;
      }, {});
      setFieldErrors(errorsByField);
    } else if (data.status === 401) {
      setFieldErrors({ geral: "Usuario ou Senha invalido(s)" });
    } else {
      console.log(data);
      setFieldErrors({ geral: "Erro ao fazer login" });
    }
  };

  return (
    <Layout>
      <div className="p-6 bg-gray-50">
        <Titulo
          titulo="Faça seu login"
          descricao="Entre na sua conta para organizar a sua vida"
        />

        <Forms onSubmit={(e) => e.preventDefault()}>
          <div>
            <Label>Email:</Label>
            <Input
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={
                fieldErrors.identificador ? "border-red-500" : "border-gray-400"
              }
            />
            {fieldErrors.identificador && (
              <p className="text-red-500 text-sm mt-1">
                {fieldErrors.identificador}
              </p>
            )}
          </div>

          <div className="mt-2">
            <Label>Senha:</Label>
            <Input
              type="password"
              placeholder="********"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className={
                fieldErrors.senha ? "border-red-500" : "border-gray-400"
              }
            />
            {fieldErrors.senha && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.senha}</p>
            )}
          </div>

          <ButtonExtra>Esqueceu a senha?</ButtonExtra>

          <ButtonSign
            className="hover:bg-orange-500"
            onClick={loginUser}
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </ButtonSign>

          {fieldErrors.geral && (
            <p className="text-red-500 text-sm mt-2">{fieldErrors.geral}</p>
          )}

          <ButtonAlt
            text="Não tem conta?"
            buttonText="Cadastre-se"
            textColor="orange-500"
            to="/cadastro"
          />

          <Logo textColor={"orange"} />
        </Forms>
      </div>

      {/* hide Grid on small screens via Tailwind: hidden below sm (640px) */}
      <div className="hidden sm:block">
        <Grid backgroundColor="bg-orange-500" />
      </div>
    </Layout>
  );
};
