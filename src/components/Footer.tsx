import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="mt-10 bg-bg-dark dark:bg-bg-light text-text-secondary dark:text-text-primary">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        
        {/* Logo & About */}
        <div>
          <h2 className="text-2xl font-bold mb-4 text-primary dark:text-secondary">BistroEase</h2>
          <p className="text-sm text-text-primary dark:text-text-secondary">{t("footer.aboutText")}</p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-bold text-lg mb-4 text-primary dark:text-secondary">{t("footer.quickLinks")}</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="hover:underline text-text-primary dark:text-text-secondary">{t("nav.home")}</Link>
            </li>
            <li>
              <Link to="/menu" className="hover:underline text-text-primary dark:text-text-secondary">{t("nav.menu")}</Link>
            </li>
            <li>
              <Link to="/about" className="hover:underline text-text-primary dark:text-text-secondary">{t("nav.about")}</Link>
            </li>
            <li>
              <Link to="/contact" className="hover:underline text-text-primary dark:text-text-secondary">{t("nav.contact")}</Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="font-bold text-lg mb-4 text-primary dark:text-secondary">{t("footer.support")}</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/faq" className="hover:underline text-text-primary dark:text-text-secondary">{t("footer.faq")}</Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:underline text-text-primary dark:text-text-secondary">{t("footer.privacyPolicy")}</Link>
            </li>
            <li>
              <Link to="/terms" className="hover:underline text-text-primary dark:text-text-secondary">{t("footer.terms")}</Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-bold text-lg mb-4 text-primary dark:text-secondary">{t("footer.contactUs")}</h3>
          <p className="text-sm text-text-primary dark:text-text-secondary">{t("footer.address")}</p>
          <p className="text-sm text-text-primary dark:text-text-secondary">{t("footer.phone")}: +880 1234-567890</p>
          <p className="text-sm text-text-primary dark:text-text-secondary">{t("footer.email")}: support@bistroease.com</p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-text-primary dark:border-text-secondary py-4 text-center text-sm text-text-primary dark:text-text-secondary">
        © {new Date().getFullYear()} BistroEase. {t("footer.rights")}
      </div>
    </footer>
  );
};

export default Footer;
