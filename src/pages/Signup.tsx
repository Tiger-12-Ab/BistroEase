import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PasswordInput } from "../components/PasswordInput";
import { signup, verifyOtp } from "../api/authApi";

export default function Signup() {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    password: ""
  });
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"signup" | "otp">("signup");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSignup = async () => {
    try {
      await signup(form);
      setSuccess(t("auth.signupSuccess"));
      setStep("otp");
    } catch (err: any) {
      setError(err.response?.data?.message || "Error");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      await verifyOtp({ email: form.email, otp });
      setSuccess(t("auth.otpSuccess"));
      setError("");
      setTimeout(() => window.location.href = "/login", 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error");
    }
  };

  const inputClass = "border p-2 w-full mb-2 rounded bg-transparent text-text-primary";

  return (
    <div className="flex items-center justify-center min-h-screen bg-bg-light dark:bg-bg-dark">
      <div className="w-full max-w-md p-6 rounded-lg shadow-md bg-primary dark:bg-accent">
        {step === "signup" ? (
          <>
            <h2 className="text-2xl font-bold text-primary dark:text-primary mb-4">
              {t("nav.signup")}
            </h2>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            {success && <p className="text-green-500 mb-2">{success}</p>}

            <input name="first_name" placeholder={t("auth.firstName")!} value={form.first_name} onChange={handleChange} className={inputClass} />
            <input name="last_name" placeholder={t("auth.lastName")!} value={form.last_name} onChange={handleChange} className={inputClass} />
            <input name="email" placeholder={t("auth.email")!} value={form.email} onChange={handleChange} className={inputClass} />
            <input name="phone" placeholder={t("auth.phone")!} value={form.phone} onChange={handleChange} className={inputClass} />
            <input name="address" placeholder={t("auth.address")!} value={form.address} onChange={handleChange} className={inputClass} />
            <PasswordInput value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder={t("auth.password")!} />

            <button onClick={handleSignup} className="mt-4 w-full bg-primary hover:bg-highlight text-white p-2 rounded transition">
              {t("auth.signup")}
            </button>
            <p className="mt-2 text-sm text-text-secondary dark:text-text-secondary">
              {t("auth.alreadyHaveAccount")} <a href="/login" className="text-highlight">{t("auth.login")}</a>
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-primary dark:text-primary mb-4">
              {t("auth.verifyOtp")}
            </h2>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            {success && <p className="text-green-500 mb-2">{success}</p>}

            <input placeholder={t("auth.otp")!} value={otp} onChange={(e) => setOtp(e.target.value)} className={inputClass} />
            <button onClick={handleVerifyOtp} className="w-full bg-highlight hover:bg-primary text-white p-2 rounded transition">
              {t("auth.verifyOtp")}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
