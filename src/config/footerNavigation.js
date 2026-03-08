import { Settings, LogOut } from "lucide-react";

export const footerNavigation = [
    {
        to: "/configuracao",
        label: "Configurar User",
        icon: Settings,
        hoverClass: "hover:bg-gray-100",
    },
    {
        to: "/logout",
        label: "Log Out",
        icon: LogOut,
        hoverClass: "hover:bg-red-100 hover:text-red-500",
    },
];