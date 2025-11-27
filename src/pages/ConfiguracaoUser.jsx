import React, { useEffect, useState } from "react";
import { Layout } from "../components/Dashboard/Layout";
import { Sidebar } from "../components/Sidebar/Sidebar";
import { Camera, Save, Settings } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const ConfiguracaoUsuario = () => {
  const { usuario: usuarioLogado, token } = useAuth();

  const [colaborador, setColaborador] = useState(null);
  const [credencial, setCredencial] = useState(null);

  const [previewFoto, setPreviewFoto] = useState(null);
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [salvo, setSalvo] = useState(false);
  const [erro, setErro] = useState("");

  //GETTERS
  useEffect(() => {
    if (!usuarioLogado?.id) return;

    const fetchData = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        // --- GET Colaborador ---
        const resColab = await fetch(
          `http://localhost:8080/colaboradores/${usuarioLogado.id}`,
          { headers }
        );
        const dataColab = await resColab.json();
        setColaborador(dataColab);

        // --- GET Telefones ---
        const resTel = await fetch(
          `http://localhost:8080/telefones/${usuarioLogado.id}`,
          { headers }
        );
        const telefones = await resTel.json();

        if (telefones.length > 0) {
          setColaborador((prev) => ({
            ...prev,
            telefone: telefones[0],
          }));
        }

        // --- GET Credencial ---
        const resCred = await fetch(
          `http://localhost:8080/credenciais/${usuarioLogado.id}`,
          { headers }
        );
        const dataCred = await resCred.json();
        setCredencial(dataCred);

      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
      }
    };

    fetchData();
  }, [usuarioLogado]);

  if (!colaborador || !credencial) {
    return (
      <Layout>
        <Sidebar />
        <div className="flex items-center justify-center w-full h-screen">
          <p>Carregando...</p>
        </div>
      </Layout>
    );
  }

  const handleChangeColab = (field, value) => {
    setColaborador((prev) => ({ ...prev, [field]: value }));
    setErro("");
    setSalvo(false);
  };

  const handleChangeCred = (field, value) => {
    setCredencial((prev) => ({ ...prev, [field]: value }));
    setErro("");
    setSalvo(false);
  };

  const handleFotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setColaborador((prev) => ({ ...prev, foto: file }));

    const reader = new FileReader();
    reader.onload = () => setPreviewFoto(reader.result);
    reader.readAsDataURL(file);
  };


 const handleSave = async () => {
  if (senha !== confirmarSenha) {
    setErro("As senhas não coincidem.");
    return;
  }

  try {
    const headersJSON = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    //COLABORADOR
    const bodyColaborador = {
      nome: colaborador.nome,
      dataNascimento: colaborador.dataNascimento ?? null,
      cpf: colaborador.cpf,
      tipoUsuario: colaborador.tipoUsuario,
      nomeUsuario: credencial.nomeUsuario,
      email: credencial.email,
      senha: senha || credencial.senha
    };

    await fetch(
      `http://localhost:8080/colaboradores/${usuarioLogado.id}`,
      {
        method: "PUT",
        headers: headersJSON,
        body: JSON.stringify(bodyColaborador),
      }
    );

    // CREDENCIAL
    const bodyCredenciais = {
      nomeUsuario: credencial.nomeUsuario,
      usuarioId: usuarioLogado.id,
      email: credencial.email,
      senha: senha || credencial.senha,
    };

    await fetch(
      `http://localhost:8080/credenciais/${usuarioLogado.id}`,
      {
        method: "PUT",
        headers: headersJSON,
        body: JSON.stringify(bodyCredenciais),
      }
    );

    // TELEFONE
    const telefoneData = {
      tipoTelefone: colaborador.telefone?.tipoTelefone ?? "CELULAR",
      numeroTelefone: colaborador.telefone?.numeroTelefone ?? ""
    };
    if (colaborador.telefone?.id) {
      await fetch(
        `http://localhost:8080/telefones/telefone/${colaborador.telefone.id}`,
        {
          method: "PUT",
          headers: headersJSON,
          body: JSON.stringify(telefoneData),
        }
      );
    } 
    else {
      await fetch(
        `http://localhost:8080/telefones/${usuarioLogado.id}`,
        {
          method: "POST",
          headers: headersJSON,
          body: JSON.stringify(telefoneData),
        }
      );
    }

    setSalvo(true);
    setTimeout(() => setSalvo(false), 2500);

  } catch (error) {
    console.error("Erro ao salvar:", error);
    setErro("Erro ao salvar alterações.");
  }
};

  return (
    <Layout>
      <Sidebar />

      <div className="flex w-full h-screen bg-gray-50/50">
        <div className="flex-1 p-10 overflow-y-auto">
          <div className="bg-white shadow rounded-xl p-6 max-w-2xl mx-auto space-y-6 border border-gray-200">

            {/* HEADER */}
            <div className="border-b border-gray-200 pb-3 flex items-center gap-3">
              <Settings size={24} className="text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                Configurações do Usuário
              </h1>
            </div>

            {/* FOTO */}
            <div className="flex flex-col items-center gap-4">
              <div className="w-28 h-28 rounded-full overflow-hidden border flex items-center justify-center bg-gray-100">
                {previewFoto ? (
                  <img src={previewFoto} className="w-full h-full object-cover" />
                ) : (
                  <Camera size={36} className="text-gray-400" />
                )}
              </div>

              <label className="cursor-pointer px-4 py-2 bg-gray-800 text-white rounded-full flex items-center gap-2">
                <Camera size={16} /> Alterar Foto
                <input type="file" hidden accept="image/*" onChange={handleFotoUpload} />
              </label>
            </div>

            {/* Nome */}
            <div>
              <label className="text-sm font-semibold text-gray-700">Nome</label>
              <input
                className="w-full mt-1 p-2 border rounded-lg"
                value={colaborador.nome}
                onChange={(e) => handleChangeColab("nome", e.target.value)}
              />
            </div>

            {/* Telefone */}
            <div>
              <label className="text-sm font-semibold text-gray-700">Telefone</label>
              <input
                className="w-full mt-1 p-2 border rounded-lg"
                value={colaborador.telefone?.numeroTelefone ?? ""}
                onChange={(e) =>
                  handleChangeColab("telefone", {
                    ...colaborador.telefone,
                    numeroTelefone: e.target.value,
                  })
                }
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-semibold text-gray-700">E-mail</label>
              <input
                className="w-full mt-1 p-2 border rounded-lg"
                value={credencial.email}
                onChange={(e) => handleChangeCred("email", e.target.value)}
              />
            </div>

            {/* SENHA */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Nova Senha
                </label>
                <input
                  type="password"
                  className="w-full mt-1 p-2 border rounded-lg"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Confirmar Senha
                </label>
                <input
                  type="password"
                  className="w-full mt-1 p-2 border rounded-lg"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                />
              </div>
            </div>

            {erro && <p className="text-red-500">{erro}</p>}

            {/* Botão salvar */}
            <div className="flex justify-end pt-4 border-t">
              <button
                onClick={handleSave}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2"
              >
                <Save size={16} />
                Salvar Alterações
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* TOAST */}
      {salvo && (
        <div className="fixed top-5 right-5 bg-green-600 text-white px-4 py-3 rounded-lg shadow">
          ✔ Alterações salvas com sucesso!
        </div>
      )}
    </Layout>
  );
};

export default ConfiguracaoUsuario;
