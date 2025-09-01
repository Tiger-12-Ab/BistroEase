import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/api";
import { Dish } from "../types";
import { useTranslation } from "react-i18next";
import { getImageUrl } from "../api/image";

const DishDetailsPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [dish, setDish] = useState<Dish | null>(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    (async () => {
      try {
        const res = await API.get<Dish>(`/dishes/${id}`);
        setDish(res.data);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [id]);

  const addToCart = async (redirectToCart: boolean) => {
    if (!id) return;
    try {
      await API.post("/cart", { dishId: Number(id), quantity: qty });

      if (redirectToCart) navigate("/cart");
      else alert(t("cart.added"));
    } catch (err: any) {
      console.error(err);
      if (err?.response?.status === 401) {
        alert(t("auth.loginRequired"));
        navigate("/login");
      } else {
        alert(t("cart.failed"));
      }
    }
  };

  if (!dish)
    return (
      <div className="p-6 min-h-screen bg-bg-light dark:bg-bg-dark">
        {t("loading")}
      </div>
    );

  // ✅ Compute total price
  const totalPrice = Number(dish.price) * qty;

  return (
    <section className="bg-bg-light dark:bg-bg-dark min-h-screen">
      <div className="max-w-5xl mx-auto p-6 text-text-primary dark:text-text-secondary">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Dish Image */}
          <div className="border border-secondary rounded-xl overflow-hidden">
            <img
              src={getImageUrl(dish.image_url)}
              alt={dish.title}
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Dish Info */}
          <div>
            <h1 className="text-3xl font-bold">{dish.title}</h1>
            <div className="text-xl font-semibold mt-2 text-highlight">
              ${Number(dish.price).toFixed(2)}
            </div>

            <p className="mt-4 font-medium text-text-secondary">
              {dish.short_description}
            </p>
            <p className="mt-2">{dish.description}</p>

            {/* Quantity Selector */}
            <div className="mt-6 flex items-center gap-3">
              <span className="text-sm font-medium">{t("cart.qty")}</span>
              <div className="flex items-center border border-secondary rounded overflow-hidden">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-3 py-2 bg-accent hover:bg-secondary transition"
                >
                  −
                </button>
                <span className="px-4">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="px-3 py-2 bg-accent hover:bg-secondary transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* Total Price */}
            <div className="mt-4 text-lg font-semibold text-primary">
              {t("cart.total")}: ${totalPrice.toFixed(2)}
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => addToCart(false)}
                className="px-5 py-3 rounded-xl border border-primary 
                           text-primary hover:bg-primary hover:text-bg-light 
                           transition-colors"
              >
                {t("buttons.addToCart")}
              </button>
              <button
                onClick={() => addToCart(true)}
                className="px-5 py-3 rounded-xl bg-primary text-bg-light 
                           hover:bg-secondary hover:text-text-primary 
                           transition-colors"
              >
                {t("buttons.orderNow")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DishDetailsPage;
