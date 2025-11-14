import { useState } from "react";
import { Layout } from "../components/LoginCadastro/Layout";
import { Titulo } from "../components/LoginCadastro/Titulo";
import { Forms } from "../components/LoginCadastro/Forms";
import { Label } from "../components/LoginCadastro/Label";
import { Input } from "../components/LoginCadastro/Input";
import { ButtonExtra } from "../components/LoginCadastro/ButtonExtra";
import { useAuth } from "../context/AuthContext";
import { useLogin } from "../hooks/useLogin";
import { Logo } from "../components/LoginCadastro/Logo";
import { ButtonSign } from "../components/LoginCadastro/ButtonSign";
import { ButtonAlt } from "../components/LoginCadastro/ButtonAlt";

export const RecuperarSenha = () => {
  const [codigo, setCodigo] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const { handleLogin, loading } = useLogin();
  const { loginToContext } = useAuth();

  const TEST_CODE = "12345"; // mini teste local

  const loginUser = async () => {
    const errors = {};

    if (!codigo.trim()) errors.codigo = "Preencha o código";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    // const data = await handleLogin({ codigo: codigo.trim() });

    // Código teste para validar se o código está correto
    if (codigo.trim() === TEST_CODE) {
      setFieldErrors({});
      setSuccessMessage("Verifique o seu email");
      setTimeout(() => setSuccessMessage(""), 6000);
      return;
    }

    const data = await handleLogin({ codigo: codigo.trim() });

    // if (data?.token) {
    if (data == 12345) {
      loginToContext(data);
      setFieldErrors({});
      setSuccessMessage("Verifique o seu email");
      setTimeout(() => setSuccessMessage(""), 6000);
    } else if (Array.isArray(data?.erros)) {
      const errorsByField = data.erros.reduce((acc, err) => {
        acc[err.campo] = err.mensagem;
        return acc;
      }, {});
      setFieldErrors(errorsByField);
      setSuccessMessage("");
    } else if (data.status === 401) {
      setFieldErrors({ geral: "Usuario ou Senha invalido(s)" });
      setSuccessMessage("");
    } else {
      console.log(data);
      setFieldErrors({ geral: "Erro ao fazer login" });
      setSuccessMessage("");
    }
  };

  return (
    <Layout columns={1}>
      <div className="p-6 bg-gray-50">
        <Titulo
          titulo="Recuperando a senha"
          descricao="Insira o seu código para recuperar a sua senha"
        />

        <Forms onSubmit={(e) => e.preventDefault()}>
          <div className="mt-2">
            <Label>Código:</Label>
            <Input
              type="password"
              placeholder="********"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              className={
                fieldErrors.codigo ? "border-red-500" : "border-gray-400"
              }
            />
            {fieldErrors.codigo && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.codigo}</p>
            )}
          </div>
          <ButtonSign
            className="hover:bg-orange-green-500"
            onClick={loginUser}
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </ButtonSign>
          {successMessage && (
            <p className="text-green-600 text-sm mt-2">{successMessage}</p>
          )}
          {fieldErrors.geral && (
            <p className="text-red-500 text-sm mt-2">{fieldErrors.geral}</p>
          )}
          <ButtonAlt
            text="Voltar ao Login"
            buttonText="Login"
            textColor="green-500"
            to="/login"
          />
          <Logo textColor={"green"} />
        </Forms>
      </div>
    </Layout>
  );
};
