import { useTranslation } from "react-i18next";
import SidebarItem from "./UserSidebarItem";

interface SidebarProps {
  closeSidebar?: () => void;
}

const UserSidebar: React.FC<SidebarProps> = ({ closeSidebar }) => {
  const { t } = useTranslation();

  const menuItems = [
    { label: t("sidebar.accountDetails"), href: "/dashboard/account" },
    { label: t("sidebar.orderHistory"), href: "/dashboard/orders" },
  ];

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-bold text-xl mb-6">User</h1>
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

export default UserSidebar;
