import { AuthLayout } from "../components/templates/AuthLayout";
import { CadastroForm } from "../components/organisms/CadastroForm";
import { useCadastroForm } from "../hooks/useCadastroForm";

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
