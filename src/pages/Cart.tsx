import { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import { FaEllipsisV } from "react-icons/fa";

interface CartItem {
  cart_id: number;
  title: string;
  short_description: string;
  price_each: number;
  quantity: number;
  image_url: string | null;
}

const Cart = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await API.get<CartItem[]>("/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setItems(
          res.data.map((item) => ({
            cart_id: item.cart_id,
            title: item.title,
            short_description: item.short_description || "",
            price_each: Number(item.price_each),
            quantity: item.quantity,
            image_url: item.image_url || null,
          }))
        );
      } catch (err) {
        console.error("Failed to fetch cart:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [token]);

  const updateQty = async (cart_id: number, newQty: number) => {
    if (newQty < 1) return;
    try {
      await API.put(
        `/cart/${cart_id}`,
        { quantity: newQty },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setItems((prev) =>
        prev.map((i) => (i.cart_id === cart_id ? { ...i, quantity: newQty } : i))
      );
    } catch (err) {
      console.error("Failed to update qty:", err);
    }
  };

  const removeItem = async (cart_id: number) => {
    try {
      await API.delete(`/cart/${cart_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems((prev) => prev.filter((i) => i.cart_id !== cart_id));
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };

  const checkout = async () => {
    try {
      await Promise.all(
        items.map((item) =>
          API.put(
            `/cart/${item.cart_id}`,
            { quantity: item.quantity },
            { headers: { Authorization: `Bearer ${token}` } }
          )
        )
      );
      navigate("/checkout");
    } catch (err) {
      console.error("Checkout failed:", err);
    }
  };

  if (loading)
    return (
      <p className="p-4 min-h-screen text-text-primary dark:text-text-primary bg-bg-light dark:bg-bg-dark">
        Loading cart...
      </p>
    );

  return (
    <section className="bg-bg-light dark:bg-bg-dark">
      <div className="p-6 max-w-4xl mx-auto min-h-screen bg-bg-light dark:bg-bg-dark">
      <h2 className="text-2xl font-bold mb-4 text-text-primary dark:text-text-primary">
        Your Cart
      </h2>
      {items.length === 0 ? (
        <p className="text-text-secondary dark:text-text-secondary">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.cart_id}
              className="flex items-center rounded-lg shadow p-4 bg-primary dark:bg-accent"
            >
              {item.image_url && (
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-20 h-20 object-cover rounded mr-4"
                />
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-text-primary dark:text-text-primary">{item.title}</h3>
                <p className="text-text-secondary dark:text-text-secondary">{item.short_description}</p>
                <p className="text-text-primary dark:text-text-primary font-medium">
                  Price each: ${item.price_each.toFixed(2)}
                </p>
                <p className="text-text-primary dark:text-text-primary font-semibold">
                  Total: ${(item.price_each * item.quantity).toFixed(2)}
                </p>
                <div className="flex items-center mt-2 gap-2">
                  <button
                    className="px-2 py-1 rounded bg-bg-light dark:bg-bg-dark text-bg-dark dark:text-bg-light"
                    onClick={() => updateQty(item.cart_id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span className="px-3 text-bg-dark dark:text-bg-light">{item.quantity}</span>
                  <button
                    className="px-2 py-1 rounded bg-bg-light dark:bg-bg-dark text-bg-dark dark:text-bg-light"
                    onClick={() => updateQty(item.cart_id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="ml-4 flex flex-col items-end">
                <button
                  className="text-highlight hover:text-accent transition"
                  onClick={() => removeItem(item.cart_id)}
                >
                  Remove
                </button>
          </div>
            </div>
          ))}
          <div className="flex justify-between items-center border-t pt-4">
            <p className="text-lg font-bold text-text-bg-dark dark:text-bg-light">
              Grand Total: $
              {items.reduce((acc, i) => acc + i.price_each * i.quantity, 0).toFixed(2)}
            </p>
            <button
              className="bg-primary hover:bg-highlight text-white px-4 py-2 rounded transition"
              onClick={checkout}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
      </div>
    </section>
  );
};

export default Cart;
