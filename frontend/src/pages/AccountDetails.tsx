import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../api/api";
import { FaEllipsisV } from "react-icons/fa";

interface User {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
}

const AccountDetails = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState<User | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState<User>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: ""
  });

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await api.get("/admin/user/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(data);
      setForm(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const { data } = await api.put("/admin/user/profile", form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(data.user || data); // support both /user/profile and /admin/user/profile response
      setEditOpen(false);
    } catch (err: any) {
      console.error(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-bg-light dark:bg-bg-dark min-h-screen">
      <div className="w-full max-w-3xl mx-auto bg-primary dark:bg-accent rounded-lg shadow-md p-4 sm:p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-bg-dark dark:text-bg-light">{t("accountDetails.title")}</h2>
          <button
            onClick={() => setEditOpen(true)}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          >
            <FaEllipsisV />
          </button>
        </div>

        {/* User Info */}
        {user ? (
          <div className="space-y-2">
            <p><strong>{t("accountDetails.name")}:</strong> {user.first_name} {user.last_name}</p>
            <p><strong>{t("accountDetails.email")}:</strong> {user.email}</p>
            <p><strong>{t("accountDetails.phone")}:</strong> {user.phone}</p>
            <p><strong>{t("accountDetails.address")}:</strong> {user.address}</p>
          </div>
        ) : (
          <p>{t("loading")}</p>
        )}

        {/* Edit Modal */}
        {editOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-bg-light dark:bg-bg-dark p-6 rounded-lg shadow-lg w-full max-w-md relative">
              <h3 className="text-lg font-bold mb-4">{t("accountDetails.editProfile")}</h3>
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  name="first_name"
                  value={form.first_name}
                  onChange={handleChange}
                  placeholder={t("accountDetails.firstName")}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  name="last_name"
                  value={form.last_name}
                  onChange={handleChange}
                  placeholder={t("accountDetails.lastName")}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder={t("accountDetails.email")}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder={t("accountDetails.phone")}
                  className="w-full p-2 border rounded"
                />
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder={t("accountDetails.address")}
                  className="w-full p-2 border rounded"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditOpen(false)}
                    className="px-4 py-2 border rounded"
                  >
                    {t("accountDetails.cancel")}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-highlight text-bg-light rounded hover:bg-bg-light dark:hover:bg-bg-dark transition"
                  >
                    {t("accountDetails.save")}
                  </button>
                </div>
              </form>
              <button
                onClick={() => setEditOpen(false)}
                className="absolute top-2 right-2 text-xl font-bold hover:text-text-secondary"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountDetails;
