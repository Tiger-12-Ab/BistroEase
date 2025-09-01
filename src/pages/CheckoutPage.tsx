import React, { useEffect, useState } from "react";
import API from "../api/api";
import { CartItem } from "../types";
import { useNavigate } from "react-router-dom";
import { FaEllipsisV } from "react-icons/fa";

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempUser, setTempUser] = useState(user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User not authenticated");

        // Fetch cart items
        const cartRes = await API.get("/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const mappedItems = cartRes.data.map((it: any) => ({
          cart_id: it.cart_id,
          dish_id: it.dish_id,
          title: it.title,
          quantity: it.quantity,
          price_each: Number(it.price_each),
        }));
        setItems(mappedItems);

        // Fetch user info
        const userRes = await API.get("/admin/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userRes.data);
        setTempUser(userRes.data);
      } catch (err: any) {
        alert("Failed to fetch cart or user info. Please login again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const total = items.reduce((sum, it) => sum + it.price_each * it.quantity, 0);

  const handleConfirm = async () => {
    if (!user.first_name || !user.email || !user.phone || !user.address) {
      alert("Please fill in all your information before confirming.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not authenticated");

      const orderPayload = { ...user, items };
      await API.post("/orders", orderPayload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Order placed successfully!");
      navigate("/");
    } catch (err: any) {
      alert("Failed to place order: " + (err.response?.data?.message || err.message));
    }
  };

  const openModal = () => {
    setTempUser(user);
    setIsModalOpen(true);
  };

  const saveModal = () => {
    setUser(tempUser);
    setIsModalOpen(false);
  };

  const inputClass =
    "border p-2 w-full mb-2 rounded bg-transparent text-text-primary focus:outline-none focus:ring-2 focus:ring-highlight dark:bg-bg-dark dark:text-text-primary";

  if (loading) {
    return (
      <div className="bg-bg-light dark:bg-bg-dark min-h-screen flex items-center justify-center p-6">
        <span className="text-lg font-medium text-text-primary dark:text-text-primary">
          Loading...
        </span>
      </div>
    );
  }

  return (
    <section className="bg-bg-light dark:bg-bg-dark min-h-screen p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <h1 className="text-2xl font-bold mb-4 text-text-primary dark:text-text-primary">Checkout</h1>

        {/* User Info Card */}
        <div className="relative p-6 rounded-lg shadow-md mb-6 bg-primary dark:bg-accent">
          <div className="absolute top-4 right-4 cursor-pointer" onClick={openModal}>
            <FaEllipsisV size={20} className="text-text-primary dark:text-text-primary" />
          </div>
          <div className="space-y-1 text-text-primary dark:text-text-primary">
            <div className="font-semibold text-lg">{user.first_name} {user.last_name}</div>
            <div>{user.email}</div>
            <div>{user.phone}</div>
            <div>{user.address}</div>
          </div>
        </div>

        {/* Cart Items */}
        <div className="space-y-4 mb-6">
          {items.map((it) => (
            <div
              key={it.cart_id}
              className="flex justify-between items-center p-4 rounded shadow-sm bg-bg-light dark:bg-bg-dark"
            >
              <div className="text-text-bg-dark dark:text-bg-light font-medium">
                {it.title} x {it.quantity}
              </div>
              <div className="text-text-bg-dark dark:text-bg-light font-medium">
                ${(it.price_each * it.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        {/* Total & Confirm */}
        <div className="flex flex-col sm:flex-row justify-between items-center font-bold text-lg mb-4 text-text-bg-dark dark:text-bg-light">
          <div>Total:</div>
          <div>${total.toFixed(2)}</div>
        </div>

        <button
          className="w-full sm:w-auto px-6 py-3 bg-primary hover:bg-highlight text-white rounded transition"
          onClick={handleConfirm}
        >
          Confirm Order
        </button>

        {/* Modal for editing user info */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
            <div className="bg-primary dark:bg-accent p-6 rounded shadow-lg w-full max-w-md overflow-y-auto max-h-[80vh]">
              <h2 className="text-xl font-bold mb-4 text-text-primary dark:text-text-primary">Edit Your Info</h2>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="First Name"
                  value={tempUser.first_name}
                  onChange={(e) => setTempUser({ ...tempUser, first_name: e.target.value })}
                  className={inputClass}
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={tempUser.last_name}
                  onChange={(e) => setTempUser({ ...tempUser, last_name: e.target.value })}
                  className={inputClass}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={tempUser.email}
                  onChange={(e) => setTempUser({ ...tempUser, email: e.target.value })}
                  className={inputClass}
                />
                <input
                  type="text"
                  placeholder="Phone"
                  value={tempUser.phone}
                  onChange={(e) => setTempUser({ ...tempUser, phone: e.target.value })}
                  className={inputClass}
                />
                <textarea
                  placeholder="Address"
                  value={tempUser.address}
                  onChange={(e) => setTempUser({ ...tempUser, address: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div className="flex justify-end mt-4 gap-2">
                <button
                  className="px-4 py-2 rounded bg-bg-light dark:bg-bg-dark text-text-primary dark:text-text-primary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded bg-highlight text-white hover:bg-accent"
                  onClick={saveModal}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CheckoutPage;
