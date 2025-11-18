export const ButtonSign = ({ children, className, onClick, disabled }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`cursor-pointer block w-full bg-[#252525] py-2 rounded-md text-white transition duration-0 ease-in-out text-center ${className}`}
    >
      {children}
    </button>
  );
};
