import { useState, useRef, useEffect } from "react";

const ClearIcon = ({ className = "" }) => (
  <svg
    className={className}
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
  >
    <path
      d="M2 2L12 12M12 2L2 12"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const LoadingIcon = ({ className = "" }) => (
  <svg
    className={`animate-spin ${className}`}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
  >
    <circle
      cx="8"
      cy="8"
      r="6"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeOpacity="0.2"
    />
    <path
      d="M8 2a6 6 0 0 1 6 6"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const sizeConfig = {
  sm: {
    wrapper: "h-10",
    input: "text-xs pl-10 pr-10",
    icon: "left-3",
    action: "right-3",
  },
  md: {
    wrapper: "h-11",
    input: "text-sm pl-11 pr-11",
    icon: "left-3.5",
    action: "right-3",
  },
  lg: {
    wrapper: "h-12",
    input: "text-sm pl-12 pr-12",
    icon: "left-4",
    action: "right-3.5",
  },
};

/**
 * SearchBar — componente reutilizável de busca
 *
 * Props:
 * @param {string}   placeholder  - Texto do placeholder
 * @param {string}   value        - Valor controlado (opcional)
 * @param {function} onChange     - Callback a cada keystroke: (value: string) => void
 * @param {function} onSearch     - Callback ao submeter (Enter): (value: string) => void
 * @param {function} onClear      - Callback ao limpar
 * @param {number}   debounce     - Delay em ms antes de chamar onChange (default: 0)
 * @param {boolean}  loading      - Exibe spinner
 * @param {boolean}  disabled     - Desabilita o input
 * @param {boolean}  autoFocus    - Foca ao montar
 * @param {string}   size         - "sm" | "md" | "lg" (default: "md")
 * @param {string}   className    - Classes extras no container
 */
export const SearchBar = ({
  placeholder = "Buscar...",
  value: controlledValue,
  onChange,
  onSearch,
  onClear,
  debounce = 0,
  loading = false,
  disabled = false,
  autoFocus = false,
  size = "md",
  className = "",
}) => {
  // displayValue: sempre reflete o que está visível no input — nunca tem delay
  const [displayValue, setDisplayValue] = useState(controlledValue ?? "");
  const debounceRef = useRef(null);
  const inputRef = useRef(null);

  // Sincroniza quando o pai muda o valor controlado externamente (ex: limpar de fora)
  useEffect(() => {
    if (controlledValue !== undefined) {
      setDisplayValue(controlledValue);
    }
  }, [controlledValue]);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  useEffect(() => () => clearTimeout(debounceRef.current), []);

  const handleChange = (e) => {
    const val = e.target.value;

    // 1. Atualiza o input imediatamente — sem delay, sem travamento
    setDisplayValue(val);

    // 2. Notifica o pai com debounce (só para disparar a busca)
    if (debounce > 0) {
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => onChange?.(val), debounce);
    } else {
      onChange?.(val);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      clearTimeout(debounceRef.current);
      onSearch?.(displayValue);
    }
    if (e.key === "Escape") handleClear();
  };

  const handleClear = () => {
    clearTimeout(debounceRef.current);
    setDisplayValue("");
    onChange?.("");
    onClear?.();
    inputRef.current?.focus();
  };

  const s = sizeConfig[size] ?? sizeConfig.md;

  return (
    <div className="flex justify-center w-full">
      <div className={`relative w-1/3 ${s.wrapper} ${className}`}>
        <input
          ref={inputRef}
          type="search"
          value={displayValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          className={`
          form-input search-bar__input
          h-full outline-none
          disabled:opacity-50 disabled:cursor-not-allowed
          [&::-webkit-search-cancel-button]:hidden
          ${s.input}
        `}
        />

        <span
          className={`absolute ${s.action} top-1/2 -translate-y-1/2 flex items-center`}
        >
          {loading ? (
            <LoadingIcon className="search-bar__icon" />
          ) : displayValue ? (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Limpar busca"
              className="search-bar__clear flex items-center justify-center w-6 h-6 rounded active:scale-95"
            >
              \
              <ClearIcon />
            </button>
          ) : null}
        </span>
      </div>
    </div>
  );
};
