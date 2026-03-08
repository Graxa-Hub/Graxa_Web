import React from "react";

export const ConfigFormFields = ({ colaborador, setColaborador, credencial, setCredencial }) => {
    return (
        <>
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
                                tipoTelefone:
                                    colaborador.telefone?.tipoTelefone ?? "CELULAR",
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
        </>
    );
};
