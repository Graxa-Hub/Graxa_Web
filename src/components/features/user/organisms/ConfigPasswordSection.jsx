import React from "react";

export const ConfigPasswordSection = ({ senhaAtual, setSenhaAtual, novaSenha, setNovaSenha }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
    );
};
