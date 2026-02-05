import { NavItem } from "../ui/NavItem";
import { mainNavigation } from "../../config/NavigationConfig";

export const NavigationList = () => {
    return (
        <ul className="flex flex-col gap-2">
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
