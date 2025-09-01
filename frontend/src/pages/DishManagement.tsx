import { useEffect, useState } from "react";
import { Plus, Edit, Trash } from "lucide-react";
import { useTranslation } from "react-i18next";
import API from "../api/api";

interface Dish {
  id: number;
  title: string;
  short_description: string;
  description: string;
  category: string;
  image_url: string | null;
  price: number;
}

const DishManagement = () => {
  const { t } = useTranslation();
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [open, setOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [form, setForm] = useState({
    title: "",
    short_description: "",
    description: "",
    category: "",
    image: null as File | null,
    price: "",
  });

  const fetchDishes = async () => {
    try {
      const res = await API.get("/dishes");
      setDishes(res.data.map((d: any) => ({ ...d, price: Number(d.price) || 0 })));
    } catch (err: any) {
      console.error("Error fetching dishes:", err.response?.status, err.response?.data);
    }
  };

  useEffect(() => {
    fetchDishes();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setForm({ ...form, image: e.target.files[0] });
  };

  const handleSubmit = async () => {
    try {
      let payload: any;
      if (form.image) {
        payload = new FormData();
        payload.append("title", form.title);
        payload.append("short_description", form.short_description);
        payload.append("description", form.description);
        payload.append("category", form.category);
        payload.append("price", form.price.toString());
        payload.append("image", form.image);
      } else {
        payload = {
          title: form.title,
          short_description: form.short_description,
          description: form.description,
          category: form.category,
          price: Number(form.price),
        };
      }

      if (editingDish) {
        await API.put(`/dishes/${editingDish.id}`, payload, form.image ? { headers: { "Content-Type": "multipart/form-data" } } : undefined);
      } else {
        await API.post("/dishes", payload, form.image ? { headers: { "Content-Type": "multipart/form-data" } } : undefined);
      }

      fetchDishes();
      setOpen(false);
      setEditingDish(null);
      setForm({ title: "", short_description: "", description: "", category: "", image: null, price: "" });
    } catch (err: any) {
      console.error("Error saving dish:", err.response?.status, err.response?.data);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t("dish.deleteConfirm"))) return;
    await API.delete(`/dishes/${id}`);
    fetchDishes();
  };

  const openEdit = (dish: Dish) => {
    setEditingDish(dish);
    setForm({
      title: dish.title,
      short_description: dish.short_description,
      description: dish.description,
      category: dish.category,
      image: null,
      price: dish.price.toString(),
    });
    setOpen(true);
  };

  return (
    <div className="flex flex-col p-4 sm:p-6 bg-bg-light dark:bg-bg-dark min-h-screen">
      <div className="w-full max-w-6xl mx-auto bg-primary dark:bg-accent rounded-lg shadow-md p-4 sm:p-6">
        {/* Heading */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
          <h1 className="text-xl font-bold text-bg-dark dark:text-bg-light">
            Dish Management
          </h1>
          <button
            onClick={() => {
              setEditingDish(null);
              setForm({ title: "", short_description: "", description: "", category: "", image: null, price: "" });
              setOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded cursor-pointer bg-highlight text-bg-light hover:bg-bg-light dark:hover:bg-bg-dark transition"
          >
            <Plus size={18} /> {t("dish.add")}
          </button>
        </div>

        {/* Modal */}
        {open && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 p-4">
            <div className="w-full max-w-md p-6 rounded shadow bg-primary dark:bg-accent text-bg-light relative">
              <h2 className="text-lg font-bold mb-4">
                {editingDish ? t("dish.edit") : t("dish.add")}
              </h2>
              <div className="flex flex-col gap-3">
                <input type="text" name="title" placeholder={t("dish.fields.title")} value={form.title} onChange={handleChange} className="border rounded p-2 w-full" />
                <input type="text" name="short_description" placeholder={t("dish.fields.short_description")} value={form.short_description} onChange={handleChange} className="border rounded p-2 w-full" />
                <textarea name="description" placeholder={t("dish.fields.description")} value={form.description} onChange={handleChange} className="border rounded p-2 w-full" />
                <input type="number" name="price" placeholder={t("dish.fields.price")} value={form.price} onChange={handleChange} className="border rounded p-2 w-full" step="0.01" min="0" />
                <select name="category" value={form.category} onChange={handleChange} className="border rounded p-2 w-full">
                  <option value="">{t("dish.fields.category")}</option>
                  <option value="Appetizers">Appetizers</option>
                  <option value="Main Course">Main Course</option>
                  <option value="Desserts">Desserts</option>
                  <option value="Beverages">Beverages</option>
                </select>
                <input type="file" onChange={handleFileChange} className="border rounded p-2 w-full" />
                <button onClick={handleSubmit} className="w-full py-2 rounded mt-2 bg-highlight text-bg-light hover:bg-bg-light dark:hover:bg-bg-dark transition">
                  {editingDish ? t("dish.update") : t("dish.add")}
                </button>
              </div>
              <button onClick={() => setOpen(false)} className="absolute top-2 right-2 text-xl hover:text-text-secondary">×</button>
            </div>
          </div>
        )}

        {/* Mobile Cards */}
        <div className="flex flex-col gap-4 lg:hidden">
          {dishes.length > 0 ? dishes.map(dish => (
            <div key={dish.id} className="bg-primary dark:bg-accent rounded-lg p-4 shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <h3 className="font-semibold">{dish.title}</h3>
                <div className="text-sm text-text-secondary dark:text-text-secondary">{dish.category}</div>
                <p className="text-sm mt-1">{dish.short_description}</p>
              </div>
              <div className="flex items-center gap-2 mt-2 sm:mt-0 flex-wrap">
                <span className="text-sm font-semibold">${dish.price.toFixed(2)}</span>
                <button onClick={() => openEdit(dish)} className="px-3 py-1 rounded bg-highlight text-bg-light hover:bg-bg-dark dark:hover:bg-bg-light transition">
                  <Edit size={16} />
                </button>
                <button onClick={() => handleDelete(dish.id)} className="px-3 py-1 rounded bg-accent text-bg-light hover:bg-bg-dark dark:hover:bg-bg-light transition">
                  <Trash size={16} />
                </button>
              </div>
            </div>
          )) : (
            <div className="text-center p-4 text-text-secondary dark:text-text-secondary">{t("dish.noDishes")}</div>
          )}
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full table-auto border-collapse rounded-lg">
            <thead className="bg-secondary dark:bg-secondary-dark">
              <tr>
                <th className="p-3 text-left">{t("dish.fields.title")}</th>
                <th className="p-3 text-left">{t("dish.fields.category")}</th>
                <th className="p-3 text-left">{t("dish.fields.short_description")}</th>
                <th className="p-3 text-left">{t("dish.fields.price")}</th>
                <th className="p-3 text-left">{t("dish.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {dishes.length > 0 ? dishes.map(dish => (
                <tr key={dish.id} className="border-t border-gray-200 dark:border-gray-700 hover:bg-bg-dark dark:hover:bg-bg-light transition cursor-pointer">
                  <td className="p-3">{dish.title}</td>
                  <td className="p-3">{dish.category}</td>
                  <td className="p-3">{dish.short_description}</td>
                  <td className="p-3">${dish.price.toFixed(2)}</td>
                  <td className="p-3 flex gap-2">
                    <button onClick={() => openEdit(dish)} className="px-3 py-1 rounded bg-highlight text-bg-light hover:bg-bg-dark dark:hover:bg-bg-light transition"><Edit size={18} /></button>
                    <button onClick={() => handleDelete(dish.id)} className="px-3 py-1 rounded bg-accent text-bg-light hover:bg-bg-dark dark:hover:bg-bg-light transition"><Trash size={18} /></button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="text-center p-6 text-text-secondary dark:text-text-secondary">{t("dish.noDishes")}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DishManagement;
