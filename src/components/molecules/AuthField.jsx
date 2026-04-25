import { Input } from "../atoms/Input";
import { Label } from "../atoms/Label";

export const AuthField = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
}) => {
  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={error ? "border-[var(--accent)]" : ""}
      />
      {error && <p className="text-[var(--accent)] text-sm">{error}</p>}
    </div>
  );
};
