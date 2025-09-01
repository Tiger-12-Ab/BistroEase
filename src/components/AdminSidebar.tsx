import { useTranslation } from "react-i18next";
import SidebarItem from "./AdminSidebarItem";

interface SidebarProps {
  closeSidebar?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ closeSidebar }) => {
  const { t } = useTranslation();

  const menuItems = [
    { label: t("Users"), href: "/admin/users" },
    { label: t("Orders"), href: "/admin/orders" },
    { label: t("Dishes"), href: "/admin/dishes" },
    { label: t("Reviews"), href: "/admin/reviews" },
  ];

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-bold text-xl mb-6">Admin</h1>
      {menuItems.map((item) => (
        <SidebarItem
          key={item.href}
          label={item.label}
          href={item.href}
          onClick={closeSidebar}
        />
      ))}
    </div>
  );
};

export default Sidebar;
