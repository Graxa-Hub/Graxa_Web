import { AuthField } from "../molecules/AuthField";
import { AuthHeader } from "../molecules/AuthHeader";
import { ButtonAlt } from "../atoms/ButtonAlt";
import { ButtonExtra } from "../atoms/ButtonExtra";
import { ButtonSign } from "../atoms/ButtonSign";
import { Logo } from "../atoms/Logo";

export const LoginForm = ({
  title,
  description,
  email,
  senha,
  errors,
  loading,
  onChange,
  onSubmit,
}) => {
  return (
    <div className="p-6 md:p-8 bg-[var(--surface-elevated)] space-y-6">
      <AuthHeader title={title} description={description} />

      <form onSubmit={onSubmit} className="space-y-4">
        <AuthField
          label="Email:"
          placeholder="seu@email.com"
          value={email}
          onChange={(value) => onChange("email", value)}
          error={errors.identificador}
        />

        <AuthField
          label="Senha:"
          type="password"
          placeholder="********"
          value={senha}
          onChange={(value) => onChange("senha", value)}
          error={errors.senha}
        />

        <ButtonExtra to="/recuperar-senha">Esqueceu a senha?</ButtonExtra>

        <ButtonSign type="submit" disabled={loading} className="mt-2">
          {loading ? "Entrando..." : "Entrar"}
        </ButtonSign>

        {errors.geral && (
          <p className="text-[var(--accent)] text-sm mt-1">{errors.geral}</p>
        )}

        <ButtonAlt
          text="Não tem conta?"
          buttonText="Cadastre-se"
          textColor="orange-500"
          to="/cadastro"
        />

        <div className="w-full text-end">
          <Logo textColor="orange" />
        </div>
      </form>
    </div>
  );
};
