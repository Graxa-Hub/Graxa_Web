import { AuthField } from "../molecules/AuthField";
import { AuthHeader } from "../molecules/AuthHeader";
import { ButtonAlt } from "../atoms/ButtonAlt";
import { ButtonSign } from "../atoms/ButtonSign";
import { Logo } from "../atoms/Logo";

const getPrimaryLabel = (etapa, loading) => {
  if (loading) return "Enviando...";
  if (etapa === "email") return "Enviar código";
  if (etapa === "codigo") return "Validar código";
  return "Salvar nova senha";
};

export const RecuperarSenhaForm = ({
  etapa,
  fields,
  errors,
  successMessage,
  loading,
  onChange,
  onSubmit,
}) => {
  return (
    <div className="p-6 md:p-8 bg-[var(--surface-elevated)] space-y-6">
      <AuthHeader
        title="Recuperando a senha"
        description="Informe seu e-mail, valide o código e defina a nova senha."
      />

      <form onSubmit={onSubmit} className="space-y-4">
        {etapa === "email" && (
          <AuthField
            label="E-mail:"
            type="email"
            placeholder="seuemail@empresa.com"
            value={fields.email}
            onChange={(value) => onChange("email", value)}
            error={errors.email}
          />
        )}

        {etapa === "codigo" && (
          <AuthField
            label="Código:"
            placeholder="Código recebido"
            value={fields.codigo}
            onChange={(value) => onChange("codigo", value)}
            error={errors.codigo}
          />
        )}

        {etapa === "novaSenha" && (
          <AuthField
            label="Nova senha:"
            type="password"
            placeholder="Digite sua nova senha"
            value={fields.novaSenha}
            onChange={(value) => onChange("novaSenha", value)}
            error={errors.novaSenha}
          />
        )}

        {successMessage && (
          <p className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--success)]">
            {successMessage}
          </p>
        )}
        {errors.geral && (
          <p className="text-[var(--accent)] text-sm">{errors.geral}</p>
        )}

        <ButtonSign type="submit" disabled={loading} className="mt-1">
          {getPrimaryLabel(etapa, loading)}
        </ButtonSign>

        <ButtonAlt
          text="Voltar ao Login"
          buttonText="Login"
          textColor="secondary"
          to="/login"
        />

        <div className="w-full text-end">
          <Logo textColor="purple" />
        </div>
      </form>
    </div>
  );
};
