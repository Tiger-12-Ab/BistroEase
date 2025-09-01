import LanguageToggle from "./LanguageToggle";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="w-full flex justify-end items-center px-4 py-2 bg-bg-light dark:bg-bg-dark">
      <div className="flex items-center gap-4">
        <LanguageToggle />
        <ThemeToggle />
      </div>
    </header>
  );
}
