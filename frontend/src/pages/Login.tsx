import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PasswordInput } from "../components/PasswordInput";
import { login as loginApi } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleLogin = async () => {
    try {
      const res = await loginApi(form);
      const { token, role, user } = res.data;

      // Save user & token in context and localStorage
      login({ id: user.id, name: user.name, email: user.email, role: user.role }, token);

      // Redirect based on role
      if (role === "admin") navigate("/admin");
      else navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || t("auth.invalidCredentials"));
    }
  };

  const inputClass = "border p-2 w-full mb-2 rounded bg-transparent text-text-primary";

  return (
    <div className="flex items-center justify-center min-h-screen bg-bg-light dark:bg-bg-dark">
      <div className="w-full max-w-md p-6 rounded-lg shadow-md bg-primary dark:bg-accent">
        <h2 className="text-2xl font-bold text-primary dark:text-primary mb-4">{t("auth.login")}</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}

        <input
          name="email"
          placeholder={t("auth.email")!}
          value={form.email}
          onChange={handleChange}
          className={inputClass}
        />
        <PasswordInput
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder={t("auth.password")!}
        />

        <button
          onClick={handleLogin}
          className="mt-4 w-full bg-primary hover:bg-highlight text-white p-2 rounded transition"
        >
          {t("auth.login")}
        </button>

        <p className="mt-2 text-sm text-text-secondary dark:text-text-secondary">
          {t("auth.dontHaveAccount")}{" "}
          <a href="/signup" className="text-highlight">{t("nav.signup")}</a>
        </p>
      </div>
    </div>
  );
}
