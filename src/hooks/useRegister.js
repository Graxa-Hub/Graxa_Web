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

      console.log("Dados para envio:", dadoUser);

      const response = await cadastro(dadoUser);
      return response.data;
    } catch (err) {
      console.error("Erro completo:", err);
      console.error("Status:", err.response?.status);
      console.error("Dados do erro:", err.response?.data); // 🔍 IMPORTANTE: Ver o que a API retorna
      console.error("Headers:", err.response?.headers);
      
      const data = err.response?.data;

      if (data && typeof data === 'object') {
        setFieldErrors(data);
      } else {
        setFieldErrors({ geral: 'Erro ao cadastrar usuário. Tente novamente.' });
      }
      
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleRegister, loading, fieldErrors, setFieldErrors };
};