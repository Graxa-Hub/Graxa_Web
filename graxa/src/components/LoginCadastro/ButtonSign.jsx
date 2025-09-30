import { Link } from "react-router-dom";

export const ButtonSign = ({ children, className, to }) => {
  return (
    <Link
      className={`block w-full bg-[#252525] py-2 rounded-md text-white transition duration-0 ease-in-out text-center ${className}`}
      to={to}
    >
      {children}
    </Link>
  );
};
