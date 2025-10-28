import { useState } from "react";
import { cadastro } from "../services/authService";

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleRegister = async (formData) => {
    setLoading(true);
    setFieldErrors({});

    try {
      const numeroLimpo = formData.telefone.replace(/\D/g, "");
      const numeroSemDDD = numeroLimpo.slice(2);

      const dadoUser = {
        nome: formData.nome,
        dataNascimento: formData.dataNascimento,
        cpf: formData.cpf.replace(/\D/g, ""),
        tipoUsuario: formData.tipoUsuario,
        nomeUsuario: formData.apelido,
        email: formData.email,
        senha: formData.senha,
        telefone: {
          tipoTelefone: numeroSemDDD.startsWith("9") ? "celular" : "fixo",
          numeroTelefone: numeroLimpo,
        },
      };

      const response = await cadastro(dadoUser);
      return response.data;
    } catch (err) {
      const data = err.response?.data;

      // ✅ Verifica primeiro se há lista de erros por campo
      if (Array.isArray(data?.erros)) {
        const errorsByField = data.erros.reduce((acc, err) => {
          acc[err.campo] = err.mensagem;
          return acc;
        }, {});
        setFieldErrors(errorsByField);
      }
      // ✅ Se vier como objeto direto (ex: { cpf: "CPF inválido" })
      else if (data && typeof data === "object" && !Array.isArray(data)) {
        setFieldErrors(data);
      }
      // ✅ Se vier como mensagem genérica
      else if (data?.mensagem) {
        setFieldErrors({ geral: data.mensagem });
      }
      // ✅ Fallback genérico
      else {
        setFieldErrors({ geral: "Erro ao cadastrar" });
      }

      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleRegister, loading, fieldErrors, setFieldErrors };
};
