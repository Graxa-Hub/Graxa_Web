export const ButtonLogarCadastrar = ({ children, className }) => {
  return (
    <button
      className={`w-full bg-[#252525] py-2 rounded-md text-white transition duration-250 ease-in-out ${className}`}
    >
      {children}
    </button>
  );
};
