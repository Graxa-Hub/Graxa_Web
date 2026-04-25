export const ButtonSign = ({
  children,
  className = "",
  onClick,
  disabled,
  type = "button",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn-primary block w-full text-center ${className}`}
    >
      {children}
    </button>
  );
};
