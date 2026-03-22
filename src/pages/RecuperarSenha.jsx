import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../components/LoginCadastro/Layout";
import { Titulo } from "../components/LoginCadastro/Titulo";
import { Forms } from "../components/LoginCadastro/Forms";
import { Label } from "../components/LoginCadastro/Label";
import { Input } from "../components/LoginCadastro/Input";
import { ButtonExtra } from "../components/LoginCadastro/ButtonExtra";
import { Logo } from "../components/LoginCadastro/Logo";
import { ButtonSign } from "../components/LoginCadastro/ButtonSign";
import { ButtonAlt } from "../components/LoginCadastro/ButtonAlt";
import { enviarCodigoRecuperacao, validarCodigo, resetarSenha } from "../services/authService";

export const RecuperarSenha = () => {
  const navigate = useNavigate();
  const [etapa, setEtapa] = useState("email");
  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const enviarCodigo = async () => {
    const errors = {};
    if (!email.trim()) errors.email = "Preencha o e-mail";
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      setFieldErrors({});
      setSuccessMessage("");
      await enviarCodigoRecuperacao(email.trim());
      setEtapa("codigo");
      setSuccessMessage("Se existir um cadastro com esse e-mail, enviamos um código para você.");
      setTimeout(() => setSuccessMessage(""), 6000);
    } catch (error) {
      if (error.status === 400) setFieldErrors({ email: "E-mail inválido ou não cadastrado" });
      else setFieldErrors({ geral: "Erro ao enviar o código de recuperação" });
    }
  };

  const validarCodigoUser = async () => {
    const errors = {};
    if (!codigo.trim()) errors.codigo = "Digite o código";
    if (Object.keys(errors).length > 0) return setFieldErrors(errors);

    try {
      await validarCodigo(email.trim(), codigo.trim());
      setEtapa("novaSenha");
      setSuccessMessage("Código validado! Agora defina sua nova senha.");
    } catch {
      setFieldErrors({ codigo: "Código inválido ou expirado" });
    }
  };

  const salvarNovaSenha = async () => {
    if (!novaSenha.trim()) return setFieldErrors({ novaSenha: "Digite a nova senha" });

    try {
      await resetarSenha(email.trim(), novaSenha.trim());
      setSuccessMessage("Senha alterada com sucesso!");
      setTimeout(() => navigate("/login"), 1500);
    } catch {
      setFieldErrors({ geral: "Erro ao redefinir a senha" });
    }
  };

  return (
    <Layout columns={1}>
      <div className="p-6 md:p-8 bg-[var(--surface-elevated)]">
        <Titulo
          titulo="Recuperando a senha"
          descricao="Informe seu e-mail, valide o código recebido e defina sua nova senha."
        />

        <Forms onSubmit={(e) => e.preventDefault()}>
          {etapa === "email" && (
            <>
              <div className="mt-2">
                <Label>E-mail:</Label>
                <Input
                  type="email"
                  placeholder="seuemail@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={fieldErrors.email ? "border-[var(--accent)]" : ""}
                />
                {fieldErrors.email && <p className="text-[var(--accent)] text-sm mt-1">{fieldErrors.email}</p>}
              </div>

              <ButtonSign onClick={enviarCodigo}>Enviar código</ButtonSign>
            </>
          )}

          {etapa === "codigo" && (
            <>
              <div className="mt-2">
                <Label>Código:</Label>
                <Input
                  type="text"
                  placeholder="Código recebido"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  className={fieldErrors.codigo ? "border-[var(--accent)]" : ""}
                />
                {fieldErrors.codigo && <p className="text-[var(--accent)] text-sm mt-1">{fieldErrors.codigo}</p>}
              </div>

              <ButtonSign onClick={validarCodigoUser}>Validar código</ButtonSign>
            </>
          )}

          {etapa === "novaSenha" && (
            <>
              <div className="mt-2">
                <Label>Nova senha:</Label>
                <Input
                  type="password"
                  placeholder="Digite sua nova senha"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  className={fieldErrors.novaSenha ? "border-[var(--accent)]" : ""}
                />
                {fieldErrors.novaSenha && <p className="text-[var(--accent)] text-sm mt-1">{fieldErrors.novaSenha}</p>}
              </div>

              <ButtonSign onClick={salvarNovaSenha}>Salvar nova senha</ButtonSign>
            </>
          )}

          {successMessage && (
            <p className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--success)]">
              {successMessage}
            </p>
          )}
          {fieldErrors.geral && <p className="text-[var(--accent)] text-sm mt-2">{fieldErrors.geral}</p>}

          <ButtonAlt text="Voltar ao Login" buttonText="Login" textColor="green-500" to="/login" />
          <Logo textColor={"green"} />
        </Forms>
      </div>
    </Layout>
  );
};
