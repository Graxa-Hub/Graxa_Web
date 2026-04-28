import React from "react";
import { Layout } from "../templates/Layout";
import { ConfigHeader } from "../molecules/ConfigHeader";
import { ConfigPhoto } from "../organisms/ConfigPhoto";
import { ConfigFormFields } from "../organisms/ConfigFormFields";
import { ConfigPasswordSection } from "../organisms/ConfigPasswordSection";
import { ConfigSaveActions } from "../organisms/ConfigSaveActions";
import { useConfigForm } from "../../hooks/useConfigForm";

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
      <Layout 
      showHeader={true} 
      showNotifications={false}
      showBandaSelector={false}
      showTurneSelector={false}
    >
        <div className="flex items-center justify-center w-full h-screen text-[var(--text-muted)]">Carregando...</div>
      </Layout>
    );
  }

  return (
    <Layout 
      showHeader={true} 
      showNotifications={false}
      showBandaSelector={false}
      showTurneSelector={false}
    >
      <div className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="surface-card max-w-2xl mx-auto space-y-6 p-6 md:p-8">
          <ConfigHeader />
          <ConfigPhoto src={previewFoto} onChange={handleFotoUpload} />
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
          {error && <p className="text-[var(--accent)] text-sm">{error}</p>}
          <ConfigSaveActions handleSave={handleSave} loading={loading} />
        </div>
      </div>

      {salvo && (
        <div className="fixed top-5 right-5 bg-[var(--surface-hover)] text-[var(--success)] px-4 py-3 rounded-[var(--radius-md)] shadow-[var(--shadow-soft)] border border-[var(--border)]">
          ✔ Alterações salvas com sucesso!
        </div>
      )}
    </Layout>
  );
};

export default ConfiguracaoUsuario;
