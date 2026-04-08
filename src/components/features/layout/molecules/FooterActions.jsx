import { footerNavigation } from "../../config/footerNavigation";
import { NavItem } from "../atoms/NavItem";

export const FooterActions = () => {
    return (
        <ul className="flex flex-col">
            {Array.isArray(footerNavigation) && footerNavigation.map((item) => (
                <NavItem
                    key={item.id || item.to}
                    to={item.to}
                    label={item.label}
                    icon={item.icon}
                />
            ))}
        </ul>
    )
}
