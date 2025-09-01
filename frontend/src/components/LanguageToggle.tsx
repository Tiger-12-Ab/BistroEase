import { useTranslation } from "react-i18next";

export default function LanguageToggle() {
  const { i18n } = useTranslation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  return (
    <div className="flex gap-1 border rounded-lg overflow-hidden bg-bg-light dark:bg-bg-dark">
      <button
        onClick={() => changeLanguage("en")}
        className={`px-3 py-1 text-sm font-medium ${
          i18n.language === "en"
            ? "bg-primary text-white"
            : "bg-bg-light dark:bg-bg-dark text-text-primary dark:text-white"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => changeLanguage("bn")}
        className={`px-3 py-1 text-sm font-medium ${
          i18n.language === "bn"
            ? "bg-primary text-white"
            : "bg-bg-light dark:bg-bg-dark text-text-primary dark:text-white"
        }`}
      >
        বাংলা
      </button>
    </div>
  );
}
