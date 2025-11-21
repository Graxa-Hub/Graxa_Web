import React, { useState } from "react";
import InputMask from "react-input-mask";
import { Input } from "../components/LoginCadastro/Input";
import { ComboBox } from "../components/ComboBox";
import { TIPOS_USUARIO } from "../constants/tipoUsuario";
import { Label } from "../components/LoginCadastro/Label";
import { Layout } from "../components/LoginCadastro/Layout";
import { Grid } from "../components/LoginCadastro/Grid";
import { Titulo } from "../components/LoginCadastro/Titulo";
import { Forms } from "../components/LoginCadastro/Forms";
import { Logo } from "../components/LoginCadastro/Logo";
import { ButtonAlt } from "../components/LoginCadastro/ButtonAlt";
import { ButtonSign } from "../components/LoginCadastro/ButtonSign";
import { useRegister } from "../hooks/useRegister";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const Cadastro = () => {
  const [nome, setNome] = useState("");
  const [apelido, setApelido] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cpf, setCpf] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const { handleRegister, loading, fieldErrors, setFieldErrors } =
    useRegister();
  const { loginToContext } = useAuth();
  const navigate = useNavigate();

  const validateFields = () => {
    const errors = {};
    if (!nome) errors.nome = "Nome é obrigatório";
    if (!apelido) errors.apelido = "Apelido é obrigatório";
    if (!dataNascimento)
      errors.dataNascimento = "Data de nascimento é obrigatória";
    if (!telefone) errors.telefone = "Telefone é obrigatório";
    if (!cpf) errors.cpf = "CPF é obrigatório";
    if (!tipoUsuario) errors.tipoUsuario = "Tipo de usuário é obrigatório";
    if (!email) errors.email = "Email é obrigatório";
    if (!senha) errors.senha = "Senha é obrigatória";
    if (!confirmarSenha)
      errors.confirmarSenha = "Confirmação de senha é obrigatória";
    return errors;
  };

  const handleSubmit = async () => {
    const errors = validateFields();
    if (Object.keys(errors).length > 0) {
      return setFieldErrors(errors);
    }

    const response = await handleRegister({
      nome: nome.trim(),
      apelido: apelido.trim(),
      dataNascimento: dataNascimento.trim(),
      telefone: telefone.trim(),
      cpf: cpf.trim(),
      tipoUsuario: tipoUsuario.trim(),
      email: email.trim(),
      senha: senha.trim(),
      confirmarSenha: confirmarSenha.trim(),
    });

    console.log("Resposta do registro:", response);

    if (response) {
      loginToContext({ token: response.token, usuario: response.usuario });
      setNome("");
      setApelido("");
      setDataNascimento("");
      setTelefone("");
      setCpf("");
      setTipoUsuario("");
      setEmail("");
      setSenha("");
      setConfirmarSenha("");
      navigate("/dashboard");
    }
  };

  return (
    <Layout padding="py-10">
      <Grid
        backgroundColor="bg-purple-950"
        borderRadius="rounded-tl-lg rounded-bl-lg"
      />
      <div className="w-full p-6 rounded-br-xl rounded-tr-xl bg-gray-50">
        <Titulo
          titulo="Crie a sua conta"
          descricao="Comece a sua jornada conosco!"
        />
        <Forms>
          <div className="grid grid-cols-2 gap-5">
            <div>
              <Label>Nome:</Label>
              <Input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Nome"
                className={fieldErrors.nome ? "border-red-500" : ""}
              />
              {fieldErrors.nome && (
                <p className="text-red-500 text-sm">{fieldErrors.nome}</p>
              )}
            </div>

            <div>
              <Label>Apelido:</Label>
              <Input
                value={apelido}
                onChange={(e) => setApelido(e.target.value)}
                placeholder="Apelido"
                className={fieldErrors.apelido ? "border-red-500" : ""}
              />
              {fieldErrors.apelido && (
                <p className="text-red-500 text-sm">{fieldErrors.apelido}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <Label>Data de Nascimento:</Label>
              <Input
                type="date"
                value={dataNascimento}
                onChange={(e) => setDataNascimento(e.target.value)}
                className={fieldErrors.dataNascimento ? "border-red-500" : ""}
              />
              {fieldErrors.dataNascimento && (
                <p className="text-red-500 text-sm">
                  {fieldErrors.dataNascimento}
                </p>
              )}
            </div>

            <div>
              <Label>Telefone:</Label>
              <InputMask
                mask="(99) 99999-9999"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
              >
                {(inputProps) => (
                  <Input
                    {...inputProps}
                    placeholder="(11) 99999-8888"
                    className={fieldErrors.telefone ? "border-red-500" : ""}
                  />
                )}
              </InputMask>
              {fieldErrors.telefone && (
                <p className="text-red-500 text-sm">{fieldErrors.telefone}</p>
              )}
            </div>
          </div>

          <div>
            <Label>CPF:</Label>
            <InputMask
              mask="999.999.999-99"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
            >
              {(inputProps) => (
                <Input
                  {...inputProps}
                  placeholder="000.000.000-00"
                  className={fieldErrors.cpf ? "border-red-500" : ""}
                />
              )}
            </InputMask>
            {fieldErrors.cpf && (
              <p className="text-red-500 text-sm">{fieldErrors.cpf}</p>
            )}
          </div>

          <div>
            <Label>Tipo de Usuário:</Label>
            <ComboBox
              label={null}
              value={tipoUsuario}
              onChange={setTipoUsuario}
              options={TIPOS_USUARIO}
              error={fieldErrors.tipoUsuario}
              placeholder="Selecione o tipo de usuário"
            />
            {fieldErrors.tipoUsuario && (
              <p className="text-red-500 text-sm">{fieldErrors.tipoUsuario}</p>
            )}
          </div>

          <div>
            <Label>Email:</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className={fieldErrors.email ? "border-red-500" : ""}
            />
            {fieldErrors.email && (
              <p className="text-red-500 text-sm">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <Label>Senha:</Label>
            <Input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="********"
              className={fieldErrors.senha ? "border-red-500" : ""}
            />
            {fieldErrors.senha && (
              <p className="text-red-500 text-sm">{fieldErrors.senha}</p>
            )}
          </div>

          <div>
            <Label>Confirmar Senha:</Label>
            <Input
              type="password"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              placeholder="********"
              className={fieldErrors.confirmarSenha ? "border-red-500" : ""}
            />
            {fieldErrors.confirmarSenha && (
              <p className="text-red-500 text-sm">
                {fieldErrors.confirmarSenha}
              </p>
            )}
          </div>

          {fieldErrors.geral && (
            <div className="mt-4 text-red-500 text-sm">
              <p>• {fieldErrors.geral}</p>
            </div>
          )}

          <ButtonSign onClick={handleSubmit} className="hover:bg-purple-950">
            Cadastrar
          </ButtonSign>

          <ButtonAlt
            text="Já tem uma conta?"
            buttonText="Faça Login"
            textColor="purple-950"
            to="../login"
          />

          <Logo textColor={"purple"} />
        </Forms>
      </div>
    </Layout>
  );
};