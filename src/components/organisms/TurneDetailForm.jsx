import React from "react";
import { Textarea } from "../Textarea";
import { InputFile } from "../InputFile";

export function TurneDetailForm({
    formData,
    errors,
    submitLoading,
    isEditMode,
    imagemAtual,
    handleInputChange,
    handleChange,
}) {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <Textarea
                    label="Descrição da turnê:"
                    placeholder="Descreva a turnê, objetivos, público-alvo..."
                    value={formData.descricao}
                    onChange={(e) => handleInputChange("descricao", e.target.value)}
                    rows={8}
                    maxLength={500}
                    disabled={submitLoading}
                />
                {errors.descricao && (
                    <p className="text-red-500 text-sm mt-1">{errors.descricao}</p>
                )}
            </div>

            <div>
                <InputFile
                    label="Foto da Turnê"
                    onFileSelect={(file) => handleChange("imagem", file)}
                    currentImage={imagemAtual}
                />
                {errors.imagem && (
                    <p className="text-red-500 text-sm mt-1">{errors.imagem}</p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                    {isEditMode
                        ? "Envie apenas se quiser alterar a imagem atual"
                        : "A imagem é obrigatória para criar uma nova turnê"}
                </p>
            </div>
        </div>
    );
}
