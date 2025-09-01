import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import API from "../api/api";
import { Dish } from "../types";
import CategoryToggle from "../components/CategoryToggle";
import DishCard from "../components/DishCard";

const Menu: React.FC = () => {
  const { t } = useTranslation();
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState("all"); 

  useEffect(() => {
    (async () => {
      try {
        const res = await API.get<Dish[]>("/dishes");
        setDishes(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const categories = useMemo(
    () => Array.from(new Set(dishes.map((d) => d.category))).sort(),
    [dishes]
  );

  const filtered = useMemo(
    () =>
      active === "all" ? dishes : dishes.filter((d) => d.category === active),
    [active, dishes]
  );

  if (loading)
    return (
      <div className="p-6 bg-bg-light dark:bg-bg-dark text-text-primary dark:text-text-secondary min-h-screen">
        {t("menu.loading")}
      </div>
    );

  return (
    <section className="bg-bg-light dark:bg-bg-dark min-h-screen text-text-primary dark:text-text-secondary">
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4 text-primary dark:text-highlight">
          {t("menu.title")}
        </h1>

        <CategoryToggle
          categories={["all", ...categories]}
          active={active}
          onChange={setActive}
          translateKey="categories"
        />

        {(active === "all" ? categories : [active]).map((cat) => (
          <section key={cat} className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 text-highlight dark:text-primary">
              {t(`categories.${cat}`, cat)}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered
                .filter((d) => d.category === cat)
                .map((dish) => (
                  <DishCard key={dish.id} dish={dish} />
                ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
};

export default Menu;
