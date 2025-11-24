// components/LoginCadastro/Select.jsx

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
      className={`w-full py-2 px-3 rounded-sm border border-gray-400 outline-none bg-transparent focus:ring-2 focus:bg-white ${className}`}
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
