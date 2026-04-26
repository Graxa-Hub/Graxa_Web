import { Modal } from "../ModalEventos/Modal";
import { useAddBandaForm } from "../../hooks/useAddBandasForm";
import { BandaFormStep } from "../molecules/BandaFormStep";
import { IntegranteFormStep } from "../molecules/IntegranteFormStep";

export function AddBandaModal({
  onSuccess,
  onClose,
  criarBanda,
  atualizarBanda,
  adicionarIntegrantes,
  bandaParaEditar,
}) {
  const {
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
  } = useAddBandaForm({
    onSuccess,
    criarBanda,
    atualizarBanda,
    adicionarIntegrantes,
    bandaParaEditar,
  });

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={isEditMode ? "Editar banda" : "Adicionar nova banda"}
      totalSteps={2}
      onFinish={handleFinish}
      loading={loading}
      globalError={errors.geral}
    >
      {(currentStep) => (
        <>
          {currentStep === 1 && (
            <BandaFormStep
              draft={draft}
              errors={errors}
              imagemAtual={imagemAtual}
              isEditMode={isEditMode}
              handleChange={handleChange}
              representantes={representantes}
              showNovoRepresentante={showNovoRepresentante}
              setShowNovoRepresentante={setShowNovoRepresentante}
              novoRepresentante={novoRepresentante}
              setNovoRepresentante={setNovoRepresentante}
            />
          )}
          {currentStep === 2 && (
            <IntegranteFormStep
              draft={draft}
              errors={errors}
              handleIntegranteChange={handleIntegranteChange}
              adicionarIntegrante={adicionarIntegrante}
              removerIntegrante={removerIntegrante}
            />
          )}
        </>
      )}
    </Modal>
  );
}
