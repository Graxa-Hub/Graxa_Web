import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useColaboradores } from "./useColaboradores";
import { colaboradorService } from "../services/colaboradorService";

export const useConfigForm = () => {
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

    // Fetch initial data
    useEffect(() => {
        if (!usuarioLogado?.id) return;

        const fetchData = async () => {
            try {
                const dataColab = await buscarColaboradorPorId(usuarioLogado.id);
                setColaborador(dataColab);
                setPreviewFoto(dataColab.fotoUrl);

                const telefones = await colaboradorService.buscarTelefonesPorUsuarioId(usuarioLogado.id);
                setColaborador((prev) => ({
                    ...prev,
                    telefone: telefones.length > 0 ? telefones[0] : null,
                }));

                const dataCred = await colaboradorService.buscarCredencialPorUsuarioId(usuarioLogado.id);
                setCredencial(dataCred);
            } catch (err) {
                console.error("Erro ao carregar usuário:", err);
                setErro("Erro ao carregar dados do usuário.");
            }
        };

        fetchData();
    }, [usuarioLogado, buscarColaboradorPorId]);

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

            if (arquivoFoto) {
                novoFotoNome = await colaboradorService.uploadFoto(arquivoFoto);
            }

            const colaboradorAtualizado = await atualizarColaborador(usuarioLogado.id, {
                nome: colaborador.nome,
                cpf: colaborador.cpf,
                dataNascimento: colaborador.dataNascimento,
                tipoUsuario: colaborador.tipoUsuario,
                fotoNome: novoFotoNome,
            }, null);

            await colaboradorService.atualizarCredencial(usuarioLogado.id, {
                nomeUsuario: credencial.nomeUsuario,
                email: credencial.email,
                usuarioId: usuarioLogado.id,
                senha: novaSenha || credencial.senha,
            });

            setColaborador(colaboradorAtualizado);
            setPreviewFoto(colaboradorAtualizado.fotoUrl);

            setUsuario((prev) => ({
                ...prev,
                nome: colaboradorAtualizado.nome,
                fotoNome: colaboradorAtualizado.fotoNome,
            }));

            localStorage.setItem("usuario", JSON.stringify({
                ...usuarioLogado,
                nome: colaboradorAtualizado.nome,
                fotoNome: colaboradorAtualizado.fotoNome,
            }));

            setNovaSenha("");
            setSenhaAtual("");
            setArquivoFoto(null);
            setSalvo(true);
            setTimeout(() => setSalvo(false), 2500);
            setErro("");
        } catch (err) {
            console.error("Erro ao salvar:", err);
            setErro("Erro ao salvar alterações.");
        }
    };

    return {
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
        error: error || erro,
        salvo,
        handleFotoUpload,
        handleSave,
    };
};
