// BOTÃO PARA O LOGIN EM CASO DE:
// ESQUECI A SENHA, JÁ ESTÁ CADASTRADO, ETC...

import { Link } from "react-router-dom";

export const ButtonExtra = ({ children, className, to }) => {
  return (
    <Link
      to={to}
      className={`bg-transparent text-sm text-gray-900 font-semibold outline-none ${className}`}
    >
      {children}
    </Link>
  );
};
