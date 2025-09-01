import React from "react";
import { useTranslation } from "react-i18next";

interface Props {
  categories: string[];
  active: string;
  onChange: (cat: string) => void;
  translateKey?: string; // optional translation namespace
}

const CategoryToggle: React.FC<Props> = ({ categories, active, onChange, translateKey }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`px-4 py-2 rounded-full border transition 
            ${
              active === cat
                ? "bg-primary text-bg-light border-primary hover:bg-secondary hover:text-text-primary"
                : "bg-bg-light dark:bg-bg-dark text-text-primary dark:text-text-secondary border-secondary hover:bg-accent hover:text-text-primary"
            }
          `}
        >
          {translateKey ? t(`${translateKey}.${cat}`, cat) : cat}
        </button>
      ))}
    </div>
  );
};

export default CategoryToggle;
