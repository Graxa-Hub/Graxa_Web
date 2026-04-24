import { AuthLayout } from "../templates/AuthLayout";
import { CadastroForm } from "../organisms/CadastroForm";
import { useCadastroForm } from "../../hooks/useCadastroForm";

export const Cadastro = () => {
  const { fields, errors, loading, handleChange, handleSubmit } =
    useCadastroForm();

  return (
    <AuthLayout panelPosition="left" rightPanelColor="bg-[#5005a5]">
      <CadastroForm
        fields={fields}
        errors={errors}
        loading={loading}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </AuthLayout>
  );
};
