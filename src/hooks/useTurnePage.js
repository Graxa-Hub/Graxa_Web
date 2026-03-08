import { useState, useEffect, useMemo, useCallback } from "react";
import { useBandas } from "./useBandas";
import { getTurnes, deletarTurne } from "../services/turneService";
import { adaptTurnesFromBackend } from "../utils/turneAdapter";
import { useParams } from "react-router-dom";

export function useTurnePage() {
    const { bandaId } = useParams();
    const { bandas, loading: bandasLoading, listarBandas } = useBandas();

    const [selectedBand, setSelectedBand] = useState(null);
    const [turnesData, setTurnesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingTurne, setEditingTurne] = useState(null);
    const [errorHeader, setErrorHeader] = useState(null);

    const fetchTurnes = useCallback(async () => {
        try {
            setLoading(true);
            const turnes = await getTurnes();
            const adaptedTurnes = await adaptTurnesFromBackend(turnes);
            setTurnesData(adaptedTurnes);
        } catch (error) {
            console.error("❌ Erro ao carregar turnês:", error);
            setErrorHeader("Erro ao carregar turnês");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            await listarBandas();
            await fetchTurnes();
        };
        fetchData();
    }, [listarBandas, fetchTurnes]);

    // Sincroniza bandaId da URL
    useEffect(() => {
        if (bandaId && bandas.length > 0) {
            const banda = bandas.find((b) => String(b.id) === String(bandaId));
            if (banda) setSelectedBand(banda);
        }
    }, [bandaId, bandas]);

    const filteredTurnes = useMemo(() => {
        if (selectedBand && selectedBand.id) {
            return turnesData
                .filter(
                    (t) =>
                        t.bandaId === selectedBand.id ||
                        t.banda?.id === selectedBand.id ||
                        t.raw?.bandaId === selectedBand.id ||
                        t.raw?.banda?.id === selectedBand.id
                )
                .sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        }
        return turnesData.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    }, [turnesData, selectedBand]);

    const handleBandSelect = (banda) => {
        setSelectedBand(banda);
    };

    const handleCreateTurne = () => {
        setIsEditMode(false);
        setEditingTurne(null);
        setIsModalOpen(true);
    };

    const handleEditTurne = (turne) => {
        setIsEditMode(true);
        setEditingTurne(turne);
        setIsModalOpen(true);
    };

    const handleDeleteTurne = async (turne) => {
        try {
            await deletarTurne(turne.id);
            setTurnesData((prev) => prev.filter((t) => t.id !== turne.id));
        } catch (error) {
            console.error("Erro ao excluir turnê:", error);
            setErrorHeader(error.response?.data?.mensagem || "Erro ao excluir turnê");
        }
    };

    const handleSuccess = (adaptedTurne, isEdit) => {
        if (isEdit) {
            setTurnesData((prev) =>
                prev.map((t) => (t.id === editingTurne.id ? adaptedTurne : t))
            );
        } else {
            setTurnesData((prev) => [...prev, adaptedTurne]);
        }
        setIsModalOpen(false);
    };

    return {
        bandas,
        bandasLoading,
        selectedBand,
        turnesData,
        loading,
        isModalOpen,
        isEditMode,
        editingTurne,
        errorHeader,
        filteredTurnes,
        setIsModalOpen,
        handleBandSelect,
        handleCreateTurne,
        handleEditTurne,
        handleDeleteTurne,
        handleSuccess,
        setErrorHeader,
    };
}
