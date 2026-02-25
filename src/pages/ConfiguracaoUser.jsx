import React from "react";
import { Save } from "lucide-react";
import { Layout } from "../components/templates/Layout";
import { ConfigHeader } from "../components/molecules/ConfigHeader";
import { ConfigPhoto } from "../components/organisms/ConfigPhoto";
import { ConfigFormFields } from "../components/organisms/ConfigFormFields";
import { ConfigPasswordSection } from "../components/organisms/ConfigPasswordSection";
import { ConfigSaveActions } from "../components/organisms/ConfigSaveActions";
import { useConfigForm } from "../hooks/useConfigForm";

export const ConfiguracaoUsuario = () => {
  const {
    colaborador,
    setColaborador,
    credencial,
    setCredencial,
    previewFoto,
    senhaAtual,
    setSenhaAtual,
    novaSenha,
    setNovaSenha,
    loading,
    error,
    salvo,
    handleFotoUpload,
    handleSave,
  } = useConfigForm();

  if (loading || !colaborador || !credencial) {
    return (
      <Layout showHeader={false} showNotifications={false}>
        <div className="flex items-center justify-center w-full h-screen">
          <p>Carregando...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showHeader={false} showNotifications={false}>
      <div className="flex-1 p-10 overflow-y-auto">
        <div className="bg-white shadow rounded-xl p-6 max-w-2xl mx-auto space-y-6 border border-gray-200">
          <ConfigHeader />

          <ConfigPhoto
            src={previewFoto}
            onChange={handleFotoUpload}
          />

          <ConfigFormFields
            colaborador={colaborador}
            setColaborador={setColaborador}
            credencial={credencial}
            setCredencial={setCredencial}
          />

          <ConfigPasswordSection
            senhaAtual={senhaAtual}
            setSenhaAtual={setSenhaAtual}
            novaSenha={novaSenha}
            setNovaSenha={setNovaSenha}
          />

          {error && <p className="text-red-500">{error}</p>}

          <ConfigSaveActions
            handleSave={handleSave}
            loading={loading}
          />
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
