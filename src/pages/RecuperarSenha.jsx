import { AuthLayout } from "../components/templates/AuthLayout";
import { RecuperarSenhaForm } from "../components/organisms/RecuperarSenhaForm";
import { useRecuperarSenhaForm } from "../hooks/useRecuperarSenhaForm";

export const RecuperarSenha = () => {
  const { fields, etapa, errors, successMessage, loading, handleChange, handleSubmit } =
    useRecuperarSenhaForm();

  return (
    <AuthLayout columns={1}>
      <RecuperarSenhaForm
        etapa={etapa}
        fields={fields}
        errors={errors}
        successMessage={successMessage}
        loading={loading}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </AuthLayout>
  );
};
