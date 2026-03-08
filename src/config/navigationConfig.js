import { Calendar, Spotlight, MicVocal, Settings, LogOut } from "lucide-react";

export const mainNavigation = [
    {
        id: 1,
        to: "/artista",
        label: "Bandas",
        icon: MicVocal
    },
    {
        id: 2,
        to: "/turne",
        label: "Turnes",
        icon: Spotlight
    },
    {
        id: 3,
        to: "/calendario",
        label: "Calendário",
        icon: Calendar

    },
];

export const footerNavigation = [
    {
        id: 4,
        to: "/configuracao",
        label: "Configurar User",
        icon: Settings,
        hoverClass: "hover:bg-gray-100",
    },
    {
        id: 5,
        to: "/logout",
        label: "Log Out",
        icon: LogOut,
        hoverClass: "hover:bg-red-100 hover:text-red-500",
        isAction: true,
    },
];