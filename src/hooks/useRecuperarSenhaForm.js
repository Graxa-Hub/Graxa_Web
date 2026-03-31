import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  enviarCodigoRecuperacao,
  validarCodigo,
  resetarSenha,
} from "../services/authService";

const validateEmail = (email) => {
  const errors = {};
  if (!email.trim()) errors.email = "Preencha o e-mail";
  return errors;
};

const validateCodigo = (codigo) => {
  const errors = {};
  if (!codigo.trim()) errors.codigo = "Digite o código";
  return errors;
};

const validateNovaSenha = (senha) => {
  const errors = {};
  if (!senha.trim()) errors.novaSenha = "Digite a nova senha";
  return errors;
};

export const useRecuperarSenhaForm = () => {
  const [fields, setFields] = useState({
    email: "",
    codigo: "",
    novaSenha: "",
  });
  const [etapa, setEtapa] = useState("email");
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = useCallback((field, value) => {
    setFields((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback(
    async (event) => {
      event?.preventDefault();
      setSuccessMessage("");

      try {
        if (etapa === "email") {
          const validationErrors = validateEmail(fields.email);
          if (Object.keys(validationErrors).length) {
            setErrors(validationErrors);
            return;
          }

          setLoading(true);
          setErrors({});
          await enviarCodigoRecuperacao(fields.email.trim());
          setEtapa("codigo");
          setSuccessMessage(
            "Se existir um cadastro com esse e-mail, enviamos um código para você.",
          );
          return;
        }

        if (etapa === "codigo") {
          const validationErrors = validateCodigo(fields.codigo);
          if (Object.keys(validationErrors).length) {
            setErrors(validationErrors);
            return;
          }

          setLoading(true);
          setErrors({});
          await validarCodigo(fields.email.trim(), fields.codigo.trim());
          setEtapa("novaSenha");
          setSuccessMessage("Código validado! Agora defina sua nova senha.");
          return;
        }

        if (etapa === "novaSenha") {
          const validationErrors = validateNovaSenha(fields.novaSenha);
          if (Object.keys(validationErrors).length) {
            setErrors(validationErrors);
            return;
          }

          setLoading(true);
          setErrors({});
          await resetarSenha(fields.email.trim(), fields.novaSenha.trim());
          setSuccessMessage("Senha alterada com sucesso!");
          setTimeout(() => navigate("/login"), 1200);
          return;
        }
      } catch (error) {
        if (etapa === "email") {
          setErrors({ email: "E-mail inválido ou não cadastrado" });
        } else if (etapa === "codigo") {
          setErrors({ codigo: "Código inválido ou expirado" });
        } else {
          setErrors({ geral: "Erro ao redefinir a senha" });
        }
      } finally {
        setLoading(false);
      }
    },
    [etapa, fields, navigate],
  );

  return useMemo(
    () => ({ fields, etapa, errors, successMessage, loading, handleChange, handleSubmit }),
    [fields, etapa, errors, successMessage, loading, handleChange, handleSubmit],
  );
};
