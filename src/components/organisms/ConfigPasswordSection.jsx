import React from "react";

export const ConfigPasswordSection = ({ senhaAtual, setSenhaAtual, novaSenha, setNovaSenha }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="text-xs uppercase tracking-wide text-[var(--text-muted)]">Senha atual</label>
        <input
          type="password"
          className="form-input mt-2"
          value={senhaAtual}
          onChange={(e) => setSenhaAtual(e.target.value)}
        />
      </div>

      <div>
        <label className="text-xs uppercase tracking-wide text-[var(--text-muted)]">Nova senha</label>
        <input
          type="password"
          className="form-input mt-2"
          value={novaSenha}
          onChange={(e) => setNovaSenha(e.target.value)}
        />
      </div>
    </div>
  );
};
