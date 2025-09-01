import { NavLink } from "react-router-dom";

interface SidebarItemProps {
  label: string;
  href: string;
  onClick?: () => void; // optional, for closing overlay
}

const SidebarItem: React.FC<SidebarItemProps> = ({ label, href, onClick }) => {
  return (
    <NavLink
      to={href}
      onClick={onClick}
      className={({ isActive }) =>
        `block px-4 py-2 rounded mb-2 cursor-pointer hover:bg-primary/10 dark:hover:bg-primary/20 ${
          isActive ? "bg-primary/30 font-semibold" : ""
        }`
      }
    >
      {label}
    </NavLink>
  );
};

export default SidebarItem;
