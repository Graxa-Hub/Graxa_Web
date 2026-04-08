import { Input } from "../ModalEventos/Input";
import { BandaInput } from "../ModalEventos/BandaInput";
import { Calendar } from "../Calendar";

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
      <div className="flex-1 min-w-0 max-w-[500px] space-y-5">
        <Input
          label="Nome da turne:"
          placeholder="Chuva dos olhos"
          value={formData.nome}
          onChange={(e) => handleInputChange("nome", e.target.value)}
          required
          disabled={submitLoading}
        />
        {errors.nome && (
          <p className="text-[var(--accent)] text-sm mt-1">{errors.nome}</p>
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

        <div className="space-y-5">
          <div>
            <Input
              label="Inicio da turne:"
              placeholder="13/03/2021"
              value={formatDate(selectedStartDate)}
              readOnly
              required
            />
            {errors.inicio && (
              <p className="text-[var(--accent)] text-sm mt-1">
                {errors.inicio}
              </p>
            )}
          </div>

          <div>
            <Input
              label="Fim da turne:"
              placeholder="15/03/2021"
              value={formatDate(selectedEndDate)}
              readOnly
              required
            />
            {errors.fim && (
              <p className="text-[var(--accent)] text-sm mt-1">{errors.fim}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 flex items-start pt-1 w-[320px]">
        <Calendar
          selectedStartDate={selectedStartDate}
          selectedEndDate={selectedEndDate}
          onDateSelect={handleDateSelect}
          disablePastDates
        />
      </div>
    </div>
  );
}
