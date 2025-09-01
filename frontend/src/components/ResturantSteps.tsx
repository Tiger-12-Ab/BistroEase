import React from "react";
import { FaUtensils, FaShoppingCart, FaMotorcycle } from "react-icons/fa";

interface Step {
  id: number;
  icon: JSX.Element;
  title: string;
  description: string;
}

export default function RestaurantSteps() {
  const steps: Step[] = [
    {
      id: 1,
      icon: <FaUtensils className="w-10 h-10 text-primary" />,
      title: "Select Dish",
      description: "Browse our menu and pick your favorite dishes.",
    },
    {
      id: 2,
      icon: <FaShoppingCart className="w-10 h-10 text-primary" />,
      title: "Place Order",
      description: "Add items to your cart and place your order quickly.",
    },
    {
      id: 3,
      icon: <FaMotorcycle className="w-10 h-10 text-primary" />,
      title: "Get Delivered",
      description: "Sit back and relax while we deliver your food hot and fresh.",
    },
  ];

  return (
    <div className="py-16 bg-bg-light dark:bg-bg-dark">
      <h2 className="text-3xl font-bold text-center mb-12 text-bg-dark dark:text-bg-light">
        How It Works
      </h2>

      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 px-4">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className="flex flex-col items-center text-center relative bg-primary dark:bg-accent rounded-lg p-6 shadow-lg"
          >
            {/* Step Icon */}
            <div className="bg-bg-light dark:bg-bg-dark rounded-full p-4 shadow-md mb-4">
              {step.icon}
            </div>

            {/* Step Title */}
            <h3 className="text-xl font-semibold text-text-primary dark:text-text-primary mb-2">
              {step.title}
            </h3>

            {/* Step Description */}
            <p className="text-text-secondary dark:text-text-secondary max-w-xs">
              {step.description}
            </p>

            
          </div>
        ))}
      </div>
    </div>
  );
}
