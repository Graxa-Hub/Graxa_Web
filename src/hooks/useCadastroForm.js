import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegister } from "./useRegister";
import { useAuth } from "../context/AuthContext";

const validateFields = (fields) => {
  const errors = {};
  if (!fields.nome.trim()) errors.nome = "Nome é obrigatório";
  if (!fields.apelido.trim()) errors.apelido = "Apelido é obrigatório";
  if (!fields.dataNascimento.trim())
    errors.dataNascimento = "Data de nascimento é obrigatória";
  if (!fields.telefone.trim()) errors.telefone = "Telefone é obrigatório";
  if (!fields.cpf.trim()) errors.cpf = "CPF é obrigatório";
  if (!fields.tipoUsuario.trim())
    errors.tipoUsuario = "Tipo de usuário é obrigatório";
  if (!fields.email.trim()) errors.email = "Email é obrigatório";
  if (!fields.senha.trim()) errors.senha = "Senha é obrigatória";
  if (!fields.confirmarSenha.trim())
    errors.confirmarSenha = "Confirmação de senha é obrigatória";
  return errors;
};

const formatTelefone = (value) => {
  const numbers = value.replace(/\D/g, "").slice(0, 11);
  if (numbers.length <= 2) return numbers;
  if (numbers.length <= 6)
    return numbers.replace(/(\d{2})(\d{0,4})/, "($1) $2");
  return numbers.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
};

const formatCpf = (value) => {
  const numbers = value.replace(/\D/g, "").slice(0, 11);
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 6) return numbers.replace(/(\d{3})(\d{0,3})/, "$1.$2");
  if (numbers.length <= 9)
    return numbers.replace(/(\d{3})(\d{3})(\d{0,3})/, "$1.$2.$3");
  return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, "$1.$2.$3-$4");
};

export const useCadastroForm = () => {
  const [fields, setFields] = useState({
    nome: "",
    apelido: "",
    dataNascimento: "",
    telefone: "",
    cpf: "",
    tipoUsuario: "",
    email: "",
    senha: "",
    confirmarSenha: "",
  });
  const [errors, setErrors] = useState({});
  const { handleRegister, loading, fieldErrors, setFieldErrors } =
    useRegister();
  const { loginToContext } = useAuth();
  const navigate = useNavigate();

  // keep local errors in sync with API errors
  useEffect(() => {
    if (fieldErrors && Object.keys(fieldErrors).length) {
      setErrors(fieldErrors);
    }
  }, [fieldErrors]);

  const handleChange = useCallback((field, value) => {
    setFields((prev) => {
      const next = { ...prev };
      if (field === "telefone") next.telefone = formatTelefone(value);
      else if (field === "cpf") next.cpf = formatCpf(value);
      else next[field] = value;
      return next;
    });
  }, []);

  const handleSubmit = useCallback(
    async (event) => {
      event?.preventDefault();
      const validationErrors = validateFields(fields);
      if (Object.keys(validationErrors).length) {
        setErrors(validationErrors);
        setFieldErrors(validationErrors);
        return;
      }

      setErrors({});
      setFieldErrors({});

      const response = await handleRegister({
        ...fields,
        nome: fields.nome.trim(),
        apelido: fields.apelido.trim(),
        dataNascimento: fields.dataNascimento.trim(),
        telefone: fields.telefone.trim(),
        cpf: fields.cpf.trim(),
        tipoUsuario: fields.tipoUsuario.trim(),
        email: fields.email.trim(),
        senha: fields.senha.trim(),
        confirmarSenha: fields.confirmarSenha.trim(),
      });

      if (response) {
        loginToContext({ token: response.token, usuario: response.usuario });
        setFields({
          nome: "",
          apelido: "",
          dataNascimento: "",
          telefone: "",
          cpf: "",
          tipoUsuario: "",
          email: "",
          senha: "",
          confirmarSenha: "",
        });
        navigate("/dashboard");
      }
    },
    [fields, handleRegister, loginToContext, navigate, setFieldErrors],
  );

  return useMemo(
    () => ({
      fields,
      errors,
      loading,
      handleChange,
      handleSubmit,
    }),
    [fields, errors, loading, handleChange, handleSubmit],
  );
};
