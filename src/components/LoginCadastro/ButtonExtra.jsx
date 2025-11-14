// BOTÃO PARA O LOGIN EM CASO DE:
// ESQUECI A SENHA, JÁ ESTÁ CADASTRADO, ETC...

import { Link } from "react-router-dom";

// Botão link reutilizável. Se nenhuma rota for passada, cai no fluxo de recuperar senha.
export const ButtonExtra = ({
  children,
  className = "",
  to = "/recuperar-senha",
}) => {
  return (
    <Link
      to={to}
      className={`bg-transparent text-gray-900 font-semibold outline-none underline ${className}`}
    >
      {children}
    </Link>
  );
};
