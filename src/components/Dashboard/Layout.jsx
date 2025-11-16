import { Sidebar } from "./Sidebar";
import { Outlet } from "react-router-dom";

export const Layout = () => {
  return (
    <div className="min-h-screen overflow-hidden flex">
      <Sidebar />
      {/* Aqui vira um flex container também */}
      <div className="flex-1 flex min-h-0">
        <Outlet />
      </div>
    </div>
  );
};
