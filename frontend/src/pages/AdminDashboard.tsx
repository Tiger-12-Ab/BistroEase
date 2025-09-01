import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/AdminSidebar";

const AdminDashboard = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-bg-light dark:bg-bg-dark">
      {/* Top Navbar / Hamburger */}
      <div className="flex items-center justify-between p-4 bg-primary text-text-primary shadow-md">
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-md bg-bg-light dark:bg-bg-dark"
        >
          {open ? <span className="text-2xl">×</span> : <span className="text-2xl">≡</span>}
        </button>
        <h1 className="font-bold text-lg">Admin</h1>
      </div>

      <div className="flex flex-1 relative">
        {/* Sidebar Overlay */}
        {open && (
          <div
            className="fixed inset-0 z-50 flex bg-black/50"
            onClick={() => setOpen(false)}
          >
            <div
              className="w-64 max-w-full bg-bg-light dark:bg-bg-dark p-4 h-full overflow-y-auto shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <Sidebar closeSidebar={() => setOpen(false)} />
            </div>
            <div className="flex-1" onClick={() => setOpen(false)}></div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 mt-2">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
