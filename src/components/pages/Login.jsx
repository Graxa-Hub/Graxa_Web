import { AuthLayout } from "../components/templates/AuthLayout";
import { LoginForm } from "../components/organisms/LoginForm";
import { useLoginForm } from "../hooks/useLoginForm";

export const Login = () => {
  const { email, senha, errors, loading, handleChange, handleSubmit } =
    useLoginForm();

  return (
    <AuthLayout>
      <LoginForm
        title="Faça seu login"
        description="Entre na sua conta para organizar a sua vida"
        email={email}
        senha={senha}
        errors={errors}
        loading={loading}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </AuthLayout>
  );
};
