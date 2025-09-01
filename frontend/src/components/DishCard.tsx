import React from "react";
import { Dish } from "../types";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getImageUrl } from "../api/image";

interface Props {
  dish: Dish;
}

const DishCard: React.FC<Props> = ({ dish }) => {
  const { t } = useTranslation();

  return (
    <div className="border border-secondary rounded-lg overflow-hidden shadow hover:shadow-md transition bg-bg-light dark:bg-bg-dark text-text-primary dark:text-text-secondary">
      <img
        src={getImageUrl(dish.image_url)}
        alt={dish.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 text-primary dark:text-highlight">
          {dish.title}
        </h3>
        <p className="text-sm text-text-secondary mb-3">{dish.short_description}</p>
        <div className="flex justify-between items-center">
          <span className="font-bold text-lg text-highlight dark:text-primary">
            ${dish.price ? Number(dish.price).toFixed(2) : "0.00"}
          </span>
          <Link
            to={`/dish/${dish.id}`}
            className="bg-primary text-bg-light px-3 py-1 rounded-lg hover:bg-secondary hover:text-text-primary transition-colors"
          >
            {t("buttons.viewDetails")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DishCard;
