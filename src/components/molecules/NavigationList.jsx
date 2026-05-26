import { NavItem } from "../atoms/NavItem";
import { mainNavigation } from "../../config/navigationConfig";
import { useRole } from "../../hooks/useRole";

export const NavigationList = () => {
  const { checkRole } = useRole();

  const filteredNavigation = mainNavigation.filter((item) => {
    if (!item.requiredRole) {
      return true;
    }
    return checkRole(item.requiredRole);
  });

  return (
    <ul className="flex flex-col gap-1.5">
      {filteredNavigation.map((item) => (
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
