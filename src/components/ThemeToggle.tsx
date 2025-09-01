import { useTheme } from "../context/ThemeContext";
import { FaSun, FaMoon } from "react-icons/fa"; // Install react-icons if not already

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      onClick={toggleTheme}
      className="flex items-center justify-between w-16 p-1 rounded-full cursor-pointer bg-secondary dark:bg-primary transition-colors"
    >
      <div
        className={`flex items-center justify-center w-6 h-6 rounded-full bg-white text-sm text-yellow-400 dark:text-yellow-300 shadow-md transform transition-transform ${
          theme === "dark" ? "translate-x-8" : "translate-x-0"
        }`}
      >
        {theme === "light" ? <FaSun /> : <FaMoon />}
      </div>
    </div>
  );
}
