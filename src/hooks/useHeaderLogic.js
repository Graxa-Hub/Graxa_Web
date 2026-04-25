import { useState, useCallback, useMemo, useEffect } from "react";

export const useHeaderLogic = ({
    bandas,
    turnes,
    bandaSelecionada,
    onBandaChange,
    onTurneChange,
}) => {
    const [isOpen, setOpen] = useState(false);
    const [artistOpen, setArtistOpen] = useState(false);
    const [tourOpen, setTourOpen] = useState(false);
    const [activeOption, setActiveOption] = useState(null);

    // Turnês da banda selecionada
    const turnesDaBanda = useMemo(() => {
        if (!bandaSelecionada) return [];
        return turnes.filter(
            (t) => String(t.banda?.id || t.bandaId) === String(bandaSelecionada.id)
        );
    }, [turnes, bandaSelecionada]);

    const alternarDropdown = useCallback(() => setOpen((prev) => !prev), []);
    const fecharDropdown = useCallback(() => setOpen(false), []);

    useEffect(() => {
        if (!isOpen) return;
        const onKeyDown = (e) => e.key === "Escape" && fecharDropdown();
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [isOpen, fecharDropdown]);

    const handleOpenArtist = useCallback(() => {
        setActiveOption("artist");
        setArtistOpen(true);
        fecharDropdown();
    }, [fecharDropdown]);

    const handleOpenTour = useCallback(() => {
        setActiveOption("tour");
        setTourOpen(true);
        fecharDropdown();
    }, [fecharDropdown]);

    const handleBandaSelect = useCallback(
        (banda) => {
            onBandaChange(banda);
            onTurneChange(null); // reset turnê ao trocar banda
            // NÃO fechar o dropdown para permitir seleção de turnê
        },
        [onBandaChange, onTurneChange]
    );

    const handleTurneSelect = useCallback(
        (turne) => {
            onTurneChange(turne);
            fecharDropdown();
        },
        [onTurneChange, fecharDropdown]
    );

    const handleBandaSelectFromModal = useCallback(
        (banda) => {
            onBandaChange(banda);
            setArtistOpen(false);
        },
        [onBandaChange]
    );

    const handleTurneSelectFromModal = useCallback(
        (turne) => {
            onTurneChange(turne);
            const turneIdBanda = turne.banda?.id || turne.bandaId;
            if (turneIdBanda && turneIdBanda !== bandaSelecionada?.id) {
                const banda = bandas.find((b) => b.id === turneIdBanda);
                if (banda) onBandaChange(banda);
            }
            setTourOpen(false);
        },
        [bandas, bandaSelecionada, onBandaChange, onTurneChange]
    );

    return {
        isOpen,
        artistOpen,
        tourOpen,
        activeOption,
        turnesDaBanda,
        alternarDropdown,
        setArtistOpen,
        setTourOpen,
        handleOpenArtist,
        handleOpenTour,
        handleBandaSelect,
        handleTurneSelect,
        handleBandaSelectFromModal,
        handleTurneSelectFromModal,
    };
};
