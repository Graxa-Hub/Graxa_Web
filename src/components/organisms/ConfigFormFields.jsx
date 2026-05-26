import React from "react";

export const ConfigFormFields = ({
  colaborador,
  setColaborador,
  credencial,
  setCredencial,
}) => {
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
            Nome
          </label>
          <input
            className="form-input mt-2"
            value={colaborador.nome}
            onChange={(e) =>
              setColaborador({ ...colaborador, nome: e.target.value })
            }
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
            Telefone
          </label>
          <input
            className="form-input mt-2"
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
      </div>
      <div>
        <label className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
          Email
        </label>
        <input
          className="form-input mt-2"
          value={credencial.email}
          onChange={(e) =>
            setCredencial({ ...credencial, email: e.target.value })
          }
        />
      </div>
    </div>
  );
};
