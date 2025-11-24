import { Link } from "react-router-dom";

export const ButtonExtra = ({ children, className = "", onClick, to }) => {
  const base = `cursor-pointer bg-transparent text-gray-900 font-semibold underline ${className}`;

  // Se tiver "to", vira Link
  if (to) {
    return (
      <Link to={to} className={base}>
        {children}
      </Link>
    );
  }

  // Senão, vira botão normal (usado na recuperação)
  return (
    <button type="button" onClick={onClick} className={base}>
      {children}
    </button>
  );
};
