import { useState, useEffect } from "react";
import {
    criarTurne,
    editarTurne,
} from "../services/turneService";
import {
    adaptTurneFromBackend,
    dateToISO,
} from "../utils/turneAdapter";
import { imagemService } from "../services/imagemService";

export function useTurneForm({
    onSuccess,
    turnesData,
    isEditMode: initialEditMode,
    editingTurne: initialEditingTurne,
    selectedBand
}) {
    const [formData, setFormData] = useState({
        nome: "",
        descricao: "",
        imagem: null,
        bandaId: null,
    });

    const [selectedStartDate, setSelectedStartDate] = useState(null);
    const [selectedEndDate, setSelectedEndDate] = useState(null);
    const [errors, setErrors] = useState({});
    const [submitLoading, setSubmitLoading] = useState(false);
    const [imagemAtual, setImagemAtual] = useState(null);
    const [imagemCarregada, setImagemCarregada] = useState(false);
    const [bandaSearchText, setBandaSearchText] = useState("");
    const [showBandaDropdown, setShowBandaDropdown] = useState(false);

    // Carrega dados iniciais se for edição
    useEffect(() => {
        if (initialEditMode && initialEditingTurne) {
            setFormData({
                nome: initialEditingTurne.name,
                descricao: initialEditingTurne.description,
                imagem: null,
                bandaId:
                    initialEditingTurne.bandaId ||
                    initialEditingTurne.banda?.id ||
                    initialEditingTurne.raw?.bandaId ||
                    initialEditingTurne.raw?.banda?.id ||
                    null,
            });

            const [startDay, startMonth, startYear] = initialEditingTurne.startDate.split("/");
            const [endDay, endMonth, endYear] = initialEditingTurne.endDate.split("/");

            setSelectedStartDate(new Date(startYear, startMonth - 1, startDay));
            setSelectedEndDate(new Date(endYear, endMonth - 1, endDay));
            setImagemCarregada(false);
        } else {
            setFormData({
                nome: "",
                descricao: "",
                imagem: null,
                bandaId: selectedBand?.id || null,
            });
            setSelectedStartDate(null);
            setSelectedEndDate(null);
            setImagemAtual(null);
            setImagemCarregada(false);
        }
        setErrors({});
        setBandaSearchText("");
        setShowBandaDropdown(false);
    }, [initialEditMode, initialEditingTurne, selectedBand]);

    // Carrega imagem se for edição
    useEffect(() => {
        const carregarImagem = async () => {
            if (initialEditingTurne?.raw?.nomeImagem && !imagemCarregada) {
                try {
                    const imageUrl = await imagemService(initialEditingTurne.raw.nomeImagem);
                    setImagemAtual(imageUrl);
                    setImagemCarregada(true);
                } catch (error) {
                    console.error("Erro ao carregar imagem da turnê:", error);
                }
            }
        };
        if (initialEditMode) carregarImagem();
    }, [initialEditingTurne, initialEditMode, imagemCarregada]);

    const validateStep1 = () => {
        const newErrors = {};

        if (!formData.nome.trim()) {
            newErrors.nome = "Nome da turnê é obrigatório";
        } else {
            const existing = turnesData.find(
                (t) =>
                    t.name.toLowerCase() === formData.nome.toLowerCase() &&
                    (!initialEditMode || t.id !== initialEditingTurne.id)
            );
            if (existing) {
                newErrors.nome = "Já existe uma turnê com este nome";
            }
        }

        if (!selectedStartDate) newErrors.inicio = "Data de início é obrigatória";
        if (!selectedEndDate) newErrors.fim = "Data de fim é obrigatória";
        
        // Valida se as datas estão no passado
        const agora = new Date();
        const hoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
        
        if (selectedStartDate && selectedStartDate < hoje) {
            newErrors.inicio = "Data de início não pode ser anterior à data atual";
        }
        
        if (selectedEndDate && selectedEndDate < hoje) {
            newErrors.fim = "Data de fim não pode ser anterior à data atual";
        }
        
        if (selectedStartDate && selectedEndDate && selectedEndDate < selectedStartDate) {
            newErrors.fim = "Data de fim deve ser posterior à data de início";
        }

        if (!formData.bandaId) newErrors.banda = "Selecione uma banda para a turnê";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors = {};
        if (!formData.descricao.trim()) newErrors.descricao = "Descrição é obrigatória";
        if (!initialEditMode && !formData.imagem) newErrors.imagem = "Upload da imagem é obrigatório";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (key, value) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
        if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));

        if (key === "imagem" && value) {
            const reader = new FileReader();
            reader.onloadend = () => setImagemAtual(reader.result);
            reader.readAsDataURL(value);
        }
    };

    const handleDateSelect = (date) => {
        if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
            setSelectedStartDate(date);
            setSelectedEndDate(null);
            setErrors((prev) => ({ ...prev, inicio: undefined, fim: undefined }));
        } else if (date >= selectedStartDate) {
            setSelectedEndDate(date);
            setErrors((prev) => ({ ...prev, fim: undefined }));
        } else {
            setSelectedStartDate(date);
            setSelectedEndDate(null);
            setErrors((prev) => ({ ...prev, inicio: undefined, fim: undefined }));
        }
    };

    const handleFinishTurne = async () => {
        if (!validateStep2()) return;

        setSubmitLoading(true);
        setErrors({});

        try {
            const payload = {
                nomeTurne: formData.nome,
                dataHoraInicioTurne: dateToISO(selectedStartDate),
                dataHoraFimTurne: dateToISO(selectedEndDate),
                descricao: formData.descricao,
                bandaId: formData.bandaId,
            };

            let response;
            if (initialEditMode) {
                response = await editarTurne(initialEditingTurne.id, payload, formData.imagem);
            } else {
                response = await criarTurne(payload, formData.imagem);
            }

            const adaptedTurne = await adaptTurneFromBackend(response);
            // ✅ Aguarda o onSuccess completar antes de finalizar
            await onSuccess(adaptedTurne, initialEditMode);
            return true; // ✅ Indica sucesso para o Modal
        } catch (error) {
            const errorMsg = error.response?.data?.mensagem || error.response?.data?.message;
            if (errorMsg?.toLowerCase().includes("já existe")) {
                setErrors({ nome: "Já existe uma turnê com este nome" });
            } else {
                setErrors({ geral: errorMsg || "Erro ao salvar turnê" });
            }
            return false; // ✅ Indica falha
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleBandaSelectInModal = (banda) => {
        setFormData((prev) => ({ ...prev, bandaId: banda?.id || null }));
        setBandaSearchText(banda?.nome || "");
        setShowBandaDropdown(false);
        if (errors.banda) setErrors((prev) => ({ ...prev, banda: undefined }));
    };

    return {
        formData,
        errors,
        submitLoading,
        selectedStartDate,
        selectedEndDate,
        imagemAtual,
        bandaSearchText,
        showBandaDropdown,
        setFormData,
        setBandaSearchText,
        setShowBandaDropdown,
        handleDateSelect,
        handleFinishTurne,
        handleBandaSelectInModal,
        handleChange,
        validateStep1,
        validateStep2,
    };
}
