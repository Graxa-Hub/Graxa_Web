import React, { useEffect, useState } from "react";
import { Layout } from "../components/Dashboard/Layout";
import { Sidebar } from "../components/Sidebar/Sidebar";
import { Camera, Save, Settings } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useColaboradores } from "../hooks/useColaboradores";
import { colaboradorService } from "../services/colaboradorService";

export const ConfiguracaoUsuario = () => {
  const { usuario: usuarioLogado, setUsuario } = useAuth();
  const { buscarColaboradorPorId, atualizarColaborador, loading, error } = useColaboradores();

  const [colaborador, setColaborador] = useState(null);
  const [credencial, setCredencial] = useState(null);
  const [arquivoFoto, setArquivoFoto] = useState(null);
  const [previewFoto, setPreviewFoto] = useState(null);
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [salvo, setSalvo] = useState(false);
  const [erro, setErro] = useState("");

  // GET COLABORADOR / TELEFONE / CREDENCIAL
  useEffect(() => {
    if (!usuarioLogado?.id) return;

    const fetchData = async () => {
      try {
        // Buscar colaborador com foto
        const dataColab = await buscarColaboradorPorId(usuarioLogado.id);
        setColaborador(dataColab);
        setPreviewFoto(dataColab.fotoUrl);

        // Buscar telefones
        const telefones = await colaboradorService.buscarTelefonesPorUsuarioId(usuarioLogado.id);
        setColaborador(prev => ({
          ...prev,
          telefone: telefones.length > 0 ? telefones[0] : null,
        }));

        // Buscar credencial
        const dataCred = await colaboradorService.buscarCredencialPorUsuarioId(usuarioLogado.id);
        setCredencial(dataCred);

      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
        setErro("Erro ao carregar dados do usuário.");
      }
    };

    fetchData();
  }, [usuarioLogado, buscarColaboradorPorId]);

  if (loading || !colaborador || !credencial) {
    return (
      <Layout>
        <Sidebar />
        <div className="flex items-center justify-center w-full h-screen">
          <p>Carregando...</p>
        </div>
      </Layout>
    );
  }

  // HANDLERS
  const handleFotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setArquivoFoto(file);

    const reader = new FileReader();
    reader.onload = () => setPreviewFoto(reader.result);
    reader.readAsDataURL(file);
  };

  const validarSenhaAtual = async () => {
    if (!senhaAtual) {
      setErro("Informe sua senha atual para alterar a senha.");
      return false;
    }

    try {
      const valido = await colaboradorService.validarSenha(credencial.email, senhaAtual);
      if (!valido) {
        setErro("Senha atual incorreta.");
        return false;
      }
      return true;
    } catch (err) {
      console.error("Erro validar senha atual:", err);
      setErro("Erro ao validar senha.");
      return false;
    }
  };

  const handleSave = async () => {
    if (novaSenha) {
      const ok = await validarSenhaAtual();
      if (!ok) return;
    }

    try {
      let novoFotoNome = colaborador.fotoNome;

      // Upload da foto ANTES de atualizar o colaborador
      if (arquivoFoto) {
        novoFotoNome = await colaboradorService.uploadFoto(arquivoFoto);
      }

      // Atualizar colaborador com o novo fotoNome
      const colaboradorAtualizado = await atualizarColaborador(
        usuarioLogado.id,
        {
          nome: colaborador.nome,
          cpf: colaborador.cpf,
          dataNascimento: colaborador.dataNascimento,
          tipoUsuario: colaborador.tipoUsuario,
          fotoNome: novoFotoNome, // Usa o novo nome ou o antigo
        },
        null // Não passa a foto aqui, já fizemos upload
      );

      // Atualizar credencial
      await colaboradorService.atualizarCredencial(usuarioLogado.id, {
        nomeUsuario: credencial.nomeUsuario,
        email: credencial.email,
        usuarioId: usuarioLogado.id,
        senha: novaSenha || credencial.senha,
      });

      // Atualiza estado local
      setColaborador(colaboradorAtualizado);
      setPreviewFoto(colaboradorAtualizado.fotoUrl);

      // Atualiza contexto e localStorage
      setUsuario(prev => ({
        ...prev,
        nome: colaboradorAtualizado.nome,
        fotoNome: colaboradorAtualizado.fotoNome,
      }));

      localStorage.setItem(
        "usuario",
        JSON.stringify({
          ...usuarioLogado,
          nome: colaboradorAtualizado.nome,
          fotoNome: colaboradorAtualizado.fotoNome,
        })
      );

      // Limpa campos
      setNovaSenha("");
      setSenhaAtual("");
      setArquivoFoto(null);

      // Toast de sucesso
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
            <div className="border-b pb-3 flex items-center gap-3">
              <Settings size={24} className="text-blue-600" />
              <h1 className="text-2xl font-bold">Configurações do Usuário</h1>
            </div>

            {/* FOTO */}
            <div className="flex flex-col items-center gap-4">
              <div className="w-28 h-28 rounded-full overflow-hidden border bg-gray-100">
                {previewFoto ? (
                  <img
                    src={previewFoto}
                    className="w-full h-full object-cover"
                    alt="Foto do usuário"
                  />
                ) : (
                  <Camera size={36} className="text-gray-400 m-auto" />
                )}
              </div>

              <label className="cursor-pointer px-4 py-2 bg-gray-800 text-white rounded-full flex items-center gap-2">
                <Camera size={16} /> Alterar Foto
                <input type="file" hidden accept="image/*" onChange={handleFotoUpload} />
              </label>
            </div>

            {/* Nome */}
            <div>
              <label className="font-semibold">Nome</label>
              <input
                className="w-full mt-1 p-2 border rounded-lg"
                value={colaborador.nome}
                onChange={(e) =>
                  setColaborador({ ...colaborador, nome: e.target.value })
                }
              />
            </div>

            {/* Telefone */}
            <div>
              <label className="font-semibold">Telefone</label>
              <input
                className="w-full mt-1 p-2 border rounded-lg"
                value={colaborador.telefone?.numeroTelefone ?? ""}
                onChange={(e) =>
                  setColaborador({
                    ...colaborador,
                    telefone: {
                      ...colaborador.telefone,
                      numeroTelefone: e.target.value,
                      tipoTelefone: colaborador.telefone?.tipoTelefone ?? "CELULAR",
                    },
                  })
                }
              />
            </div>

            {/* Email */}
            <div>
              <label className="font-semibold">Email</label>
              <input
                className="w-full mt-1 p-2 border rounded-lg"
                value={credencial.email}
                onChange={(e) =>
                  setCredencial({ ...credencial, email: e.target.value })
                }
              />
            </div>

            {/* Senhas */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-semibold">Senha atual</label>
                <input
                  type="password"
                  className="w-full mt-1 p-2 border rounded-lg"
                  value={senhaAtual}
                  onChange={(e) => setSenhaAtual(e.target.value)}
                />
              </div>

              <div>
                <label className="font-semibold">Nova senha</label>
                <input
                  type="password"
                  className="w-full mt-1 p-2 border rounded-lg"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                />
              </div>
            </div>

            {erro && <p className="text-red-500">{erro}</p>}
            {error && <p className="text-red-500">{error}</p>}

            {/* SAVE */}
            <div className="flex justify-end pt-4 border-t">
              <button
                onClick={handleSave}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 disabled:bg-gray-400"
                disabled={loading}
              >
                <Save size={16} />
                {loading ? "Salvando..." : "Salvar alterações"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {salvo && (
        <div className="fixed top-5 right-5 bg-green-600 text-white px-4 py-3 rounded-lg shadow">
          ✔ Alterações salvas com sucesso!
        </div>
      )}
    </Layout>
  );
};

export default ConfiguracaoUsuario;
