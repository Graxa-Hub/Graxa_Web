export const ButtonSign = ({ children, className = "", onClick, disabled }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`btn-primary block w-full text-center ${className}`}
    >
      {children}
    </button>
  );
};
