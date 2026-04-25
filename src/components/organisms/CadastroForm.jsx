import { AuthField } from "../molecules/AuthField";
import { AuthHeader } from "../molecules/AuthHeader";
import { ButtonAlt } from "../atoms/ButtonAlt";
import { ButtonSign } from "../atoms/ButtonSign";
import { Logo } from "../atoms/Logo";
import { ComboBox } from "../molecules/ComboBox";
import { TIPOS_USUARIO } from "../../constants/tipoUsuario";

export const CadastroForm = ({
  fields,
  errors,
  loading,
  onChange,
  onSubmit,
}) => {
  return (
    <div className="p-6 md:p-8 bg-[var(--surface-elevated)] space-y-6">
      <AuthHeader
        title="Crie a sua conta"
        description="Comece a sua jornada conosco!"
      />

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AuthField
            label="Nome:"
            value={fields.nome}
            onChange={(value) => onChange("nome", value)}
            placeholder="Nome"
            error={errors.nome}
          />
          <AuthField
            label="Apelido:"
            value={fields.apelido}
            onChange={(value) => onChange("apelido", value)}
            placeholder="Apelido"
            error={errors.apelido}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AuthField
            label="Data de Nascimento:"
            type="date"
            value={fields.dataNascimento}
            onChange={(value) => onChange("dataNascimento", value)}
            error={errors.dataNascimento}
          />
          <AuthField
            label="Telefone:"
            value={fields.telefone}
            onChange={(value) => onChange("telefone", value)}
            placeholder="(11) 99999-8888"
            error={errors.telefone}
          />
        </div>

        <AuthField
          label="CPF:"
          value={fields.cpf}
          onChange={(value) => onChange("cpf", value)}
          placeholder="000.000.000-00"
          error={errors.cpf}
        />

        <div className="space-y-1">
          <label className="text-sm font-semibold text-[var(--text-secondary)]">
            Tipo de Usuário:
          </label>
          <ComboBox
            label={null}
            value={fields.tipoUsuario}
            onChange={(value) => onChange("tipoUsuario", value)}
            options={TIPOS_USUARIO}
            placeholder="Selecione o tipo de usuário"
          />
          {errors.tipoUsuario && (
            <p className="text-[var(--accent)] text-sm">{errors.tipoUsuario}</p>
          )}
        </div>

        <AuthField
          label="Email:"
          type="email"
          value={fields.email}
          onChange={(value) => onChange("email", value)}
          placeholder="seu@email.com"
          error={errors.email}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AuthField
            label="Senha:"
            type="password"
            value={fields.senha}
            onChange={(value) => onChange("senha", value)}
            placeholder="********"
            error={errors.senha}
          />
          <AuthField
            label="Confirmar Senha:"
            type="password"
            value={fields.confirmarSenha}
            onChange={(value) => onChange("confirmarSenha", value)}
            placeholder="********"
            error={errors.confirmarSenha}
          />
        </div>

        {errors.geral && (
          <p className="text-[var(--accent)] text-sm">• {errors.geral}</p>
        )}

        <ButtonSign type="submit" disabled={loading} className="mt-2">
          {loading ? "Cadastrando..." : "Cadastrar"}
        </ButtonSign>

        <ButtonAlt
          text="Já tem uma conta?"
          buttonText="Faça Login"
          textColor="secondary"
          hoverColor="grid"
          to="../login"
        />

        <div className="w-full text-end">
          <Logo textColor="purple" />
        </div>
      </form>
    </div>
  );
};
