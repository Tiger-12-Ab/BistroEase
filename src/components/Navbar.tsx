import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Define nav links
  const navLinks = [
    { label: t("nav.home"), to: "/" },
    { label: t("nav.menu"), to: "/menu" },
    { label: t("nav.about"), to: "/about" },
    { label: t("nav.contact"), to: "/contact" }
  ];

  // Close when clicking outside
  const handleOverlayClick = () => setMenuOpen(false);

  return (
    <nav className="bg-bg-light dark:bg-bg-dark">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">

        {/* Logo */}
        <div className="text-xl font-bold text-text-primary dark:text-secondary">
          BistroEase
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="
                font-bold 
                text-text-primary dark:text-text-secondary
                px-3 py-2 rounded-md
                hover:bg-primary hover:text-bg-light
                dark:hover:bg-bg-light dark:hover:text-bg-dark
                transition-colors
              "
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Controls */}
        <div className="hidden md:flex items-center gap-3">
          {!user ? (
            <Link
              to="/signup"
              className="
                bg-primary text-bg-light px-4 py-2 rounded-md 
                hover:bg-secondary hover:text-text-primary
              "
            >
              {t("nav.signup")}
            </Link>
          ) : (
            <>
              <Link
                to="/cart"
                className="
                  bg-primary text-bg-light px-4 py-2 rounded-md 
                  hover:bg-secondary hover:text-text-primary
                "
              >
                {t("nav.cart")}
              </Link>
              <Link
                to="/dashboard"
                className="
                  bg-primary text-bg-light px-4 py-2 rounded-md 
                  hover:bg-secondary hover:text-text-primary
                "
              >
                {t("nav.dashboard")}
              </Link>
              <button
                onClick={logout}
                className="
                  bg-primary text-bg-light px-4 py-2 rounded-md 
                  hover:bg-secondary hover:text-text-primary
                "
              >
                {t("nav.logout")}
              </button>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-primary"
          onClick={() => setMenuOpen(true)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={handleOverlayClick}
        >
          <div
            className="fixed top-0 left-0 w-64 h-full bg-bg-light dark:bg-bg-dark shadow-lg p-6 z-50"
            onClick={(e) => e.stopPropagation()}
          >
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="
                  block py-2 px-3 rounded-md
                  text-text-primary dark:text-text-secondary
                  hover:bg-primary hover:text-bg-light
                  dark:hover:bg-bg-light dark:hover:text-bg-dark
                  transition-colors
                "
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-4">
              {!user ? (
                <Link
                  to="/signup"
                  className="
                    block bg-primary text-bg-light px-4 py-2 rounded-md 
                    hover:bg-secondary hover:text-text-primary
                  "
                  onClick={() => setMenuOpen(false)}
                >
                  {t("nav.signup")}
                </Link>
              ) : (
                <>
                  <Link
                    to="/cart"
                    className="
                      block bg-primary text-bg-light px-4 py-2 rounded-md 
                      hover:bg-secondary hover:text-text-primary
                    "
                    onClick={() => setMenuOpen(false)}
                  >
                    {t("nav.cart")}
                  </Link>
                  <Link
                    to="/dashboard"
                    className="
                      block bg-primary text-bg-light px-4 py-2 rounded-md 
                      hover:bg-secondary hover:text-text-primary
                    "
                    onClick={() => setMenuOpen(false)}
                  >
                    {t("nav.dashboard")}
                  </Link>
                  <button
                    onClick={() => { logout(); setMenuOpen(false); }}
                    className="
                      block bg-primary text-bg-light px-4 py-2 rounded-md 
                      hover:bg-secondary hover:text-text-primary
                    "
                  >
                    {t("nav.logout")}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
