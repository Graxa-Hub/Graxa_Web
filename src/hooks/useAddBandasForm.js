import { useState, useEffect } from "react";
import { useRepresentantes } from "./useRepresentantes";
import { useArtistas } from "./useArtistas";
import { useToast } from "./useToast";
import { bandaService } from "../services/bandaService";

// Função para limpar máscara de CPF
const limparCPF = (cpf) => cpf.replace(/\D/g, "");

// Função para formatar CPF com máscara
const formatarCPF = (valor) => {
  const apenasNumeros = limparCPF(valor).slice(0, 11);
  if (apenasNumeros.length <= 3) return apenasNumeros;
  if (apenasNumeros.length <= 6) return `${apenasNumeros.slice(0, 3)}.${apenasNumeros.slice(3)}`;
  if (apenasNumeros.length <= 9) return `${apenasNumeros.slice(0, 3)}.${apenasNumeros.slice(3, 6)}.${apenasNumeros.slice(6)}`;
  return `${apenasNumeros.slice(0, 3)}.${apenasNumeros.slice(3, 6)}.${apenasNumeros.slice(6, 9)}-${apenasNumeros.slice(9)}`;
};

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
      cpf: formatarCPF(int.cpf || ""),
    })) || [{ nome: "", cpf: "" }],
  });

  // Rastrear IDs de integrantes removidos para deletar do backend
  const [integrantesRemovidos, setIntegrantesRemovidos] = useState([]);

  const [showNovoRepresentante, setShowNovoRepresentante] = useState(false);
  const [novoRepresentante, setNovoRepresentante] = useState({
    nome: "",
    email: "",
  });

  const { representantes, listarRepresentantes, criarRepresentante } =
    useRepresentantes();
  const { criarArtista, atualizarArtista, excluirArtista, listarArtistas } = useArtistas();
  const { showSuccess, showError } = useToast();

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
      
      // Rastrear ID para deletar depois
      setIntegrantesRemovidos((prev) => [...prev, integrante.id]);
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
        return false; // ✅ Indica falha
      }

      // ✅ Só valida duplicação se NÃO está editando (criando nova banda)
      if (!isEditMode) {
        try {
          const bandasExistentes = await bandaService.listarBandas();
          const bandaJaExiste = bandasExistentes?.some(
            (b) => b.nome.toLowerCase() === draft.nome.toLowerCase(),
          );
          if (bandaJaExiste) {
            setErrors({ geral: `A banda "${draft.nome}" já existe no sistema.` });
            return false; // ✅ Indica falha
          }
        } catch (err) {
          console.warn(
            "[useAddBandaForm] Aviso: não foi possível validar banda existente",
          );
        }
      }

      if (isEditMode) {
        const dadosAtualizacao = {
          nome: draft.nome,
          descricao: draft.descricao,
          genero: draft.genero,
          representanteId: draft.representanteId,
        };
        await atualizarBanda(bandaParaEditar.id, dadosAtualizacao, draft.foto);

        // Deletar integrantes removidos
        for (const integranteId of integrantesRemovidos) {
          try {
            await excluirArtista(integranteId);
          } catch (error) {
            console.error(`Erro ao remover integrante ${integranteId}:`, error);
            // Não bloqueia o fluxo se falhar a exclusão
          }
        }

        // Adicionar/Atualizar integrantes
        for (const integrante of draft.integrantes) {
          if (integrante.id) {
            await atualizarArtista(integrante.id, {
              nome: integrante.nome,
              cpf: limparCPF(integrante.cpf),
            });
          } else if (integrante.nome && integrante.cpf) {
            const artistaCriado = await criarArtista({
              nome: integrante.nome,
              cpf: limparCPF(integrante.cpf),
              fotoNome: null,
            });
            await adicionarIntegrantes(bandaParaEditar.id, [artistaCriado.id]);
          }
        }

        showSuccess(`"${draft.nome}" foi atualizada com sucesso!`, 'Banda atualizada');
        await onSuccess(); // ✅ Aguarda antes de retornar
        return true; // ✅ Indica sucesso
      }
      let representanteId = draft.representanteId;
      if (showNovoRepresentante) {
        if (!novoRepresentante.nome || !novoRepresentante.email) {
          setErrors({ representante: "Preencha todos os campos obrigatórios" });
          return false; // ✅ Indica falha
        }
        const representanteCriado = await criarRepresentante(novoRepresentante);
        representanteId = representanteCriado.id;
      }
      if (!representanteId) {
        setErrors({ representanteId: "Selecione um representante" });
        return false; // ✅ Indica falha
      }
      const integrantesValidos = draft.integrantes.filter(
        (int) => int.nome?.trim() && int.cpf?.trim(),
      );
      if (integrantesValidos.length === 0) {
        setErrors({
          integrantes:
            "Adicione pelo menos um integrante com nome e CPF preenchidos",
        });
        return false; // ✅ Indica falha
      }
      const cpfs = integrantesValidos.map((int) => limparCPF(int.cpf));
      const cpfsDuplicados = cpfs.filter(
        (cpf, index) => cpfs.indexOf(cpf) !== index,
      );
      if (cpfsDuplicados.length > 0) {
        setErrors({
          integrantes: `CPF duplicado na lista: ${cpfsDuplicados.join(", ")}`,
        });
        return false; // ✅ Indica falha
      }

      // ✅ Validar se CPFs já existem no banco de dados
      try {
        const artistasExistentes = await listarArtistas();
        const cpfsExistentes = artistasExistentes.map((a) =>
          limparCPF(a.cpf || ""),
        );

        const cpfComDuplicataNoBanco = integrantesValidos.find((integrante) => {
          const cpfLimpo = limparCPF(integrante.cpf);
          return cpfsExistentes.includes(cpfLimpo);
        });

        if (cpfComDuplicataNoBanco) {
          setErrors({
            integrantes: `❌ CPF ${cpfComDuplicataNoBanco.cpf} já existe no banco de dados. Integrante: "${cpfComDuplicataNoBanco.nome}"`,
          });
          return false; // ✅ Indica falha
        }
      } catch (err) {
        console.warn(
          "[useAddBandaForm] Aviso ao validar CPFs no banco:",
          err.message,
        );
        // Não bloqueia o fluxo se falhar a validação
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
      showSuccess(`"${draft.nome}" foi criada com sucesso!`, 'Banda criada');
      await onSuccess(); // ✅ Aguarda antes de retornar
      return true; // ✅ Indica sucesso
    } catch (error) {
      let errorMessage = "Desculpe, não foi possível salvar a banda. Tente novamente.";
      const serverMessage =
        error.response?.data?.message || error.response?.data?.mensagem;
      const serverData =
        error.response?.data?.mensagem || error.response?.data?.message || "";
      const statusCode = error.response?.status;

      // Tratamento amigável de erros
      if (error.code === "ECONNABORTED") {
        errorMessage = "A requisição demorou muito tempo. Verifique sua conexão e tente novamente.";
      } else if (statusCode === 500 || statusCode === 502 || statusCode === 503) {
        errorMessage = "O servidor está indisponível no momento. Tente novamente em alguns segundos.";
      } else if (statusCode === 400) {
        if (serverMessage?.includes("uploads")) {
          errorMessage = "❌ Problema ao fazer upload da imagem. Verifique o tamanho e formato do arquivo.";
        } else if (serverMessage?.includes("Unique") || serverMessage?.includes("duplicate") || serverMessage?.includes("CPF")) {
          errorMessage = "❌ Um integrante com este CPF já existe no sistema. Verifique os dados.";
        } else if (serverMessage?.includes("Já existe")) {
          errorMessage = `❌ ${serverData || serverMessage}`;
        } else if (serverMessage) {
          errorMessage = `❌ ${serverMessage}`;
        }
      } else if (statusCode === 404) {
        errorMessage = "❌ Recurso não encontrado. Verifique os dados e tente novamente.";
      } else if (statusCode === 409) {
        errorMessage = "❌ Conflito ao salvar. Pode ser que a banda ou um integrante já exista.";
      } else if (serverMessage) {
        errorMessage = `❌ ${serverMessage}`;
      } else if (error.message && !error.message.includes("Network")) {
        errorMessage = `❌ ${error.message}`;
      }

      console.error("[useAddBandaForm] Erro:", { statusCode, serverMessage, error });
      setErrors({ geral: errorMessage });
      showError(errorMessage, '⚠️ Erro ao processar');
      return false; // ✅ Indica falha
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
