import { Link } from "react-router-dom";

export const ButtonExtra = ({
  children,
  className = "",
  onClick,
  to,
  hoverClass = "hover:text-[var(--accent)]",
}) => {
  const base = `cursor-pointer bg-transparent text-[var(--text-secondary)] font-semibold underline underline-offset-4 ${hoverClass} ${className}`;

  if (to) {
    return (
      <Link to={to} className={base}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={base}>
      {children}
    </button>
  );
};
