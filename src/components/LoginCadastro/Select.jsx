export const Select = ({
  value,
  onChange,
  name,
  disabled,
  className = "",
  options = [],
}) => {
  return (
    <select
      value={value}
      onChange={onChange}
      name={name}
      disabled={disabled}
      className={`form-input ${className}`}
    >
      <option value="">Selecione...</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
};
