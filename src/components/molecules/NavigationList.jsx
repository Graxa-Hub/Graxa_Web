import { NavItem } from "../atoms/NavItem";
import { mainNavigation } from "../../config/navigationConfig";

export const NavigationList = () => {
    return (
        <ul className="flex flex-col gap-1.5">
            {mainNavigation.map(item => (
                <NavItem
                    key={item.id}
                    to={item.to}
                    label={item.label}
                    icon={item.icon}
                />
            ))}
        </ul>
    );
};
