import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "./useLogin";
import { useAuth } from "../context/AuthContext";

const validateFields = ({ email, senha }) => {
  const errors = {};

  if (!email.trim()) errors.identificador = "Preencha o email";
  if (!senha.trim()) errors.senha = "Preencha a senha";

  return errors;
};

const mapApiErrors = (apiErrors = []) =>
  apiErrors.reduce((acc, err) => {
    acc[err.campo] = err.mensagem;
    return acc;
  }, {});

export const useLoginForm = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [errors, setErrors] = useState({});
  const { handleLogin, loading } = useLogin();
  const { loginToContext } = useAuth();
  const navigate = useNavigate();

  const handleChange = useCallback((field, value) => {
    if (field === "email") setEmail(value);
    if (field === "senha") setSenha(value);
  }, []);

  const handleSubmit = useCallback(
    async (event) => {
      event?.preventDefault();

      const validationErrors = validateFields({ email, senha });
      if (Object.keys(validationErrors).length) {
        setErrors(validationErrors);
        return;
      }

      setErrors({});

      const data = await handleLogin({
        identificador: email.trim(),
        senha: senha.trim(),
      });

      if (data?.token) {
        loginToContext(data);
        navigate("/calendario");
        return;
      }

      if (Array.isArray(data?.erros)) {
        setErrors(mapApiErrors(data.erros));
        return;
      }

      if (data?.status === 401) {
        setErrors({ geral: "Usuario ou Senha invalido(s)" });
        return;
      }

      setErrors({ geral: "Erro ao fazer login" });
    },
    [email, senha, handleLogin, loginToContext, navigate],
  );

  return {
    email,
    senha,
    errors,
    loading,
    handleChange,
    handleSubmit,
  };
};
