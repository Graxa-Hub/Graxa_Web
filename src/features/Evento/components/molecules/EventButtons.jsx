import React from "react";
import { GeneratePdf } from "../atoms/GeneraratePdf";
import { EventEditButton } from "../atoms/EventEditButton";
import { DiaInfoCard } from "../../../../components/atoms/DiaInfoCard";

export const EventButtons = ({
  handleGerarPdf,
  tipoEvento,
  id,
  navigate,
  dataInfo,
}) => {
  return (
    <div className="flex items-center gap-4">
      <GeneratePdf
        onClick={handleGerarPdf}
        disabled={tipoEvento !== "show"}
        title={
          tipoEvento !== "show"
            ? "PDF disponível apenas para Shows"
            : "Ver Relatório do Evento"
        }
        label="Ver Relatório"
      />
      <EventEditButton
        onClick={() => navigate(`/criar-evento/${tipoEvento}/${id}`)}
        label="Editar Evento"
      />
      <DiaInfoCard info={dataInfo} />
    </div>
  );
};
