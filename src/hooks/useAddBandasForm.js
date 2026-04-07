import { useState, useEffect } from "react";
import { useRepresentantes } from "./useRepresentantes";
import { useArtistas } from "./useArtistas";
import { bandaService } from "../services/bandaService";

export function useAddBandaForm({
  bandaParaEditar,
  criarBanda,
  atualizarBanda,
  adicionarIntegrantes,
  onSuccess,
}) {
  const isEditMode = !!bandaParaEditar;
  const [imagemAtual, setImagemAtual] = useState(
    bandaParaEditar?.imagemUrl || null,
  );

  const [draft, setDraft] = useState({
    nome: bandaParaEditar?.nome || "",
    descricao: bandaParaEditar?.descricao || "",
    genero: bandaParaEditar?.genero || "ROCK",
    representanteId: bandaParaEditar?.representante?.id || null,
    foto: null,
    quantidadeIntegrantes: bandaParaEditar?.integrantes?.length || 1,
    integrantes: bandaParaEditar?.integrantes?.map((int) => ({
      id: int.id,
      nome: int.nome || "",
      cpf: int.cpf || "",
    })) || [{ nome: "", cpf: "" }],
  });

  const [showNovoRepresentante, setShowNovoRepresentante] = useState(false);
  const [novoRepresentante, setNovoRepresentante] = useState({
    nome: "",
    email: "",
  });

  const { representantes, listarRepresentantes, criarRepresentante } =
    useRepresentantes();
  const { criarArtista, atualizarArtista, excluirArtista } = useArtistas();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    listarRepresentantes();
  }, [listarRepresentantes]);

  const handleChange = (key, value) => {
    setDraft((d) => ({ ...d, [key]: value }));
    setErrors((e) => ({ ...e, [key]: null }));
    if (key === "foto" && value) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagemAtual(reader.result);
      };
      reader.readAsDataURL(value);
    } else if (key === "foto" && value === null) {
      setImagemAtual(bandaParaEditar?.imagemUrl || null);
    }
  };

  const handleIntegranteChange = (index, key, value) => {
    const updated = draft.integrantes.map((integrante, i) =>
      i === index ? { ...integrante, [key]: value } : integrante,
    );
    setDraft((d) => ({ ...d, integrantes: updated }));
  };

  const adicionarIntegrante = () => {
    setDraft((d) => ({
      ...d,
      integrantes: [...d.integrantes, { nome: "", cpf: "" }],
      quantidadeIntegrantes: d.integrantes.length + 1,
    }));
  };

  const removerIntegrante = async (index) => {
    const integrante = draft.integrantes[index];
    if (integrante.id) {
      const confirmar = window.confirm(
        `Tem certeza que deseja remover ${integrante.nome} da banda?`,
      );
      if (!confirmar) return;
      try {
        // Aqui pode chamar excluirArtista se quiser remover do backend
      } catch (error) {
        console.error("Erro ao remover integrante:", error);
        alert("Erro ao remover integrante. Tente novamente.");
        return;
      }
    }
    const updated = draft.integrantes.filter((_, i) => i !== index);
    setDraft((d) => ({
      ...d,
      integrantes: updated,
      quantidadeIntegrantes: updated.length,
    }));
  };

  async function handleFinish() {
    try {
      setLoading(true);
      setErrors({});
      if (!draft.nome) {
        setErrors({ nome: "Nome da banda é obrigatório" });
        return;
      }

      // Validar se banda já existe (prevenção de erro 500)
      try {
        const bandasExistentes = await bandaService.listarBandas();
        const bandaJaExiste = bandasExistentes?.some(
          (b) => b.nome.toLowerCase() === draft.nome.toLowerCase(),
        );
        if (bandaJaExiste) {
          setErrors({ geral: `A banda "${draft.nome}" já existe no sistema.` });
          return;
        }
      } catch (err) {
        console.warn(
          "[useAddBandaForm] Aviso: não foi possível validar banda existente",
        );
      }

      if (isEditMode) {
        const dadosAtualizacao = {
          nome: draft.nome,
          descricao: draft.descricao,
          genero: draft.genero,
          representanteId: draft.representanteId,
        };
        await atualizarBanda(bandaParaEditar.id, dadosAtualizacao, draft.foto);
        for (const integrante of draft.integrantes) {
          if (integrante.id) {
            await atualizarArtista(integrante.id, {
              nome: integrante.nome,
              cpf: integrante.cpf,
            });
          } else if (integrante.nome && integrante.cpf) {
            const artistaCriado = await criarArtista({
              nome: integrante.nome,
              cpf: integrante.cpf,
              fotoNome: null,
            });
            await adicionarIntegrantes(bandaParaEditar.id, [artistaCriado.id]);
          }
        }
        onSuccess();
        return;
      }
      let representanteId = draft.representanteId;
      if (showNovoRepresentante) {
        if (!novoRepresentante.nome || !novoRepresentante.email) {
          setErrors({ representante: "Preencha todos os campos obrigatórios" });
          return;
        }
        const representanteCriado = await criarRepresentante(novoRepresentante);
        representanteId = representanteCriado.id;
      }
      if (!representanteId) {
        setErrors({ representanteId: "Selecione um representante" });
        return;
      }
      const integrantesValidos = draft.integrantes.filter(
        (int) => int.nome?.trim() && int.cpf?.trim(),
      );
      if (integrantesValidos.length === 0) {
        setErrors({
          integrantes:
            "Adicione pelo menos um integrante com nome e CPF preenchidos",
        });
        return;
      }
      const cpfs = integrantesValidos.map((int) => int.cpf.replace(/\D/g, ""));
      const cpfsDuplicados = cpfs.filter(
        (cpf, index) => cpfs.indexOf(cpf) !== index,
      );
      if (cpfsDuplicados.length > 0) {
        setErrors({
          integrantes: `CPF duplicado na lista: ${cpfsDuplicados.join(", ")}`,
        });
        return;
      }
      const bandaCriada = await criarBanda(
        {
          nome: draft.nome,
          descricao: draft.descricao,
          genero: draft.genero,
          representanteId,
        },
        draft.foto,
      );
      const integrantesIds = [];
      for (let i = 0; i < integrantesValidos.length; i++) {
        const integrante = integrantesValidos[i];
        try {
          const artistaCriado = await criarArtista({
            nome: integrante.nome.trim(),
            cpf: integrante.cpf.replace(/\D/g, ""),
            fotoNome: null,
          });
          integrantesIds.push(artistaCriado.id);
        } catch (error) {
          const errorMsg =
            error.response?.data?.message ||
            error.response?.data?.mensagem ||
            error.message ||
            "Erro desconhecido";
          if (
            errorMsg.includes("Unique index") ||
            errorMsg.includes("duplicate") ||
            errorMsg.includes("CPF")
          ) {
            throw new Error(
              `O CPF ${integrante.cpf} já está cadastrado no sistema`,
            );
          }
          throw new Error(
            `Erro ao criar integrante "${integrante.nome}": ${errorMsg}`,
          );
        }
      }
      if (integrantesIds.length > 0) {
        await adicionarIntegrantes(bandaCriada.id, integrantesIds);
      }
      onSuccess();
    } catch (error) {
      let errorMessage = "Erro ao processar banda";
      const serverMessage =
        error.response?.data?.message || error.response?.data?.mensagem;
      const serverData =
        error.response?.data?.mensagem || error.response?.data?.message || "";

      if (serverMessage) {
        if (
          serverMessage.includes("uploads\\") ||
          serverMessage.includes("uploads/")
        ) {
          errorMessage =
            "Erro ao fazer upload da imagem. Verifique se o servidor tem permissão para salvar arquivos.";
        } else if (
          serverMessage.includes("Unique index") ||
          serverMessage.includes("duplicate")
        ) {
          errorMessage =
            "CPF já cadastrado no sistema. Verifique os dados dos integrantes.";
        } else if (
          serverMessage.includes("Já existe") ||
          serverData.includes("Já existe")
        ) {
          errorMessage = serverData || serverMessage;
        } else {
          errorMessage = serverMessage;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      setErrors({ geral: errorMessage });
    } finally {
      setLoading(false);
    }
  }
  return {
    isEditMode,
    draft,
    errors,
    loading,
    imagemAtual,
    handleChange,
    handleIntegranteChange,
    adicionarIntegrante,
    removerIntegrante,
    handleFinish,
    representantes,
    showNovoRepresentante,
    setShowNovoRepresentante,
    novoRepresentante,
    setNovoRepresentante,
  };
}
