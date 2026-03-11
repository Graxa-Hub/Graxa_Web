import React from "react";
import { Input } from "../../../../components/ModalEventos/Input";
import { BandaInput } from "../../../../components/ModalEventos/BandaInput";
import { Calendar } from "../../../../components/Calendar";

export function TurneMainForm({
    formData,
    errors,
    submitLoading,
    bandaSearchText,
    showBandaDropdown,
    filteredBandas,
    selectedStartDate,
    selectedEndDate,
    handleInputChange,
    setBandaSearchText,
    setShowBandaDropdown,
    handleBandaSelectInModal,
    handleDateSelect,
    formatDate,
    getSelectedBandaName,
}) {
    return (
        <div className="flex gap-6">
            {/* Form fields */}
            <div className="flex-1 min-w-0 space-y-5">
                <Input
                    label="Nome da turnê:"
                    placeholder="Chuva dos olhos"
                    value={formData.nome}
                    onChange={(e) => handleInputChange("nome", e.target.value)}
                    required
                    disabled={submitLoading}
                />
                {errors.nome && (
                    <p className="text-red-500 text-sm mt-1">{errors.nome}</p>
                )}

                <BandaInput
                    label="Banda:"
                    placeholder="Pesquisar banda..."
                    value={getSelectedBandaName()}
                    searchText={bandaSearchText}
                    onSearchChange={(text) => {
                        setBandaSearchText(text);
                        setShowBandaDropdown(true);
                    }}
                    onFocus={() => {
                        setBandaSearchText(getSelectedBandaName());
                        setShowBandaDropdown(true);
                    }}
                    showDropdown={showBandaDropdown}
                    filteredBandas={filteredBandas}
                    onSelectBanda={handleBandaSelectInModal}
                    error={errors.banda}
                    disabled={submitLoading}
                    required
                />

                <Input
                    label="Início da turnê:"
                    placeholder="13/03/2021"
                    value={formatDate(selectedStartDate)}
                    readOnly
                    required
                />
                {errors.inicio && (
                    <p className="text-red-500 text-sm mt-1">{errors.inicio}</p>
                )}

                <Input
                    label="Fim da turnê:"
                    placeholder="15/03/2021"
                    value={formatDate(selectedEndDate)}
                    readOnly
                    required
                />
                {errors.fim && (
                    <p className="text-red-500 text-sm mt-1">{errors.fim}</p>
                )}
            </div>

            {/* Calendar */}
            <div className="flex-shrink-0 flex items-start pt-2">
                <Calendar
                    selectedStartDate={selectedStartDate}
                    selectedEndDate={selectedEndDate}
                    onDateSelect={handleDateSelect}
                />
            </div>
        </div>
    );
}
