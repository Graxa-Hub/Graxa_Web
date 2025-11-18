import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { 
  enviarCodigoRecuperacao,
  validarCodigo,
  resetarSenha
} from "../services/authService";

export const RecuperarSenha = () => {

  const navigate = useNavigate();

  const [etapa, setEtapa] = useState("email");
  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const { handleLogin, loading } = useLogin();
  const { loginToContext } = useAuth();

  const enviarCodigo = async () => {
    const errors = {};

    if (!email.trim()) {
      errors.email = "Preencha o e-mail";
    }

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
      console.error(error);

      if (error.status === 400) {
        setFieldErrors({ email: "E-mail inválido ou não cadastrado" });
      } else {
        setFieldErrors({ geral: "Erro ao enviar o código de recuperação" });
      }
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
    } catch (err) {
      setFieldErrors({ codigo: "Código inválido ou expirado" });
    }
  };

  const salvarNovaSenha = async () => {
    if (!novaSenha.trim()) {
      return setFieldErrors({ novaSenha: "Digite a nova senha" });
    }

    try {
      await resetarSenha(email.trim(), novaSenha.trim());
      setSuccessMessage("Senha alterada com sucesso!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setFieldErrors({ geral: "Erro ao redefinir a senha" });
    }
  };

  const loginUser = async () => {
    const errors = {};

    if (!codigo.trim()) errors.codigo = "Preencha o código";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    // Código teste para validar se o código está correto
    if (codigo.trim() === TEST_CODE) {
      setFieldErrors({});
      setSuccessMessage("Verifique o seu email");
      setTimeout(() => setSuccessMessage(""), 6000);
      return;
    }

    const data = await handleLogin({ codigo: codigo.trim() });

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
      setFieldErrors({ geral: "Usuário ou senha inválido(s)" });
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
          descricao="Informe seu e-mail para receber o código e, em seguida, valide o código abaixo"
        />

        <Forms onSubmit={(e) => e.preventDefault()}>
          {/* === ETAPA 1: DIGITAR E-MAIL === */}
          {etapa === "email" && (
            <>
              <div className="mt-2">
                <Label>E-mail:</Label>
                <Input
                  type="email"
                  placeholder="seuemail@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={fieldErrors.email ? "border-red-500" : "border-gray-400"}
                />
                {fieldErrors.email && (
                  <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>
                )}
              </div>

              <div className="mt-2 mb-4">
                <ButtonExtra onClick={enviarCodigo}>Enviar código</ButtonExtra>
              </div>
            </>
          )}

          {/* === ETAPA 2: DIGITAR O CÓDIGO === */}
          {etapa === "codigo" && (
            <>
              <div className="mt-2">
                <Label>Código:</Label>
                <Input
                  type="text"
                  placeholder="Código recebido"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  className={fieldErrors.codigo ? "border-red-500" : "border-gray-400"}
                />
                {fieldErrors.codigo && (
                  <p className="text-red-500 text-sm mt-1">{fieldErrors.codigo}</p>
                )}
              </div>

              <ButtonSign onClick={validarCodigoUser}>
                Validar código
              </ButtonSign>
            </>
          )}

          {/* === ETAPA 3: DEFINIR NOVA SENHA === */}
          {etapa === "novaSenha" && (
            <>
              <div className="mt-2">
                <Label>Nova senha:</Label>
                <Input
                  type="password"
                  placeholder="Digite sua nova senha"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  className={fieldErrors.novaSenha ? "border-red-500" : "border-gray-400"}
                />
                {fieldErrors.novaSenha && (
                  <p className="text-red-500 text-sm mt-1">{fieldErrors.novaSenha}</p>
                )}
              </div>

              <ButtonSign onClick={salvarNovaSenha}>
                Salvar nova senha
              </ButtonSign>
            </>
          )}

          {/* ALERTAS */}
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
