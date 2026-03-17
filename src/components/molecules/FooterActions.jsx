import { footerNavigation } from "../../config/footerNavigation";
import { NavItem } from "../atoms/NavItem";

export const FooterActions = () => {
    return (
        <ul className="flex flex-col gap-1.5 border-t border-[var(--border)] pt-3 mt-3">
            {footerNavigation.map((item) => (
                <NavItem
                    key={item.id}
                    to={item.to}
                    label={item.label}
                    icon={item.icon}
                />
            ))}
        </ul>
    )
}
