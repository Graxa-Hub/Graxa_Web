import React from "react";
import { CardImage } from "../atoms/CardImage";
import { CardInfo } from "../atoms/CardInfo";
import { OptionButton } from "../../../../components/atoms/OptionButton";

export const Card = ({ banda, onClick, onOptions }) => (
    <div onClick={onClick} className="surface-card overflow-hidden relative cursor-pointer hover:border-[var(--border-hover)] transition-all duration-200 group">
        <CardImage src={banda.imagemUrl} alt={banda.nome} />
        <CardInfo nome={banda.nome} genero={banda.genero} integrantes={banda.integrantes?.length} />
        {onOptions && <OptionButton onClick={e => { e.stopPropagation(); onOptions(e); }} />}
    </div>
);
