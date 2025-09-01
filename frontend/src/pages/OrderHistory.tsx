import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../api/api";

interface OrderItem {
  title: string;
  quantity: number;
  price_each: number;
}

interface Order {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  status: string;
  created_at: string;
  items: OrderItem[];
}

const OrderHistory = () => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await api.get("/orders/user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Convert totals and prices to numbers
      const parsedOrders = data.map((order: any) => ({
        ...order,
        total: Number(order.total),
        items: order.items.map((item: any) => ({
          ...item,
          price_each: Number(item.price_each),
        })),
      }));

      setOrders(parsedOrders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">{t("loading_orders")}</div>;

  return (
    <div className="p-4 sm:p-6 bg-bg-light dark:bg-bg-dark min-h-screen">
      <div className="w-full max-w-6xl mx-auto bg-primary dark:bg-accent rounded-lg shadow-md p-4 sm:p-6">
        <h2 className="text-xl font-bold mb-6 text-bg-dark dark:text-bg-light">
          {t("orderHistory.title")}
        </h2>

        {/* Mobile Cards */}
        <div className="flex flex-col gap-4 lg:hidden">
          {orders.length > 0 ? (
            orders.map((order) => (
              <div
                key={order.id}
                className="bg-primary dark:bg-accent rounded-lg p-4 shadow flex flex-col gap-2"
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold">
                    {t("orderHistory.orderId")}: {order.id}
                  </span>
                  <span className="capitalize">{order.status}</span>
                </div>
                <div className="text-sm text-text-secondary dark:text-text-secondary">
                  {order.items.map((item) => (
                    <div key={item.title}>
                      {item.title} x {item.quantity} (${item.price_each.toFixed(2)})
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-sm font-medium">
                  <span>{t("orderHistory.total")}: ${order.total.toFixed(2)}</span>
                  <span>{new Date(order.created_at).toLocaleString()}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-4 text-text-secondary dark:text-text-secondary">
              {t("orderHistory.noOrders")}
            </div>
          )}
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full table-auto border-collapse rounded-lg">
            <thead className="bg-secondary dark:bg-secondary-dark">
              <tr>
                <th className="p-3 text-left">{t("orderHistory.orderId")}</th>
                <th className="p-3 text-left">{t("orderHistory.items")}</th>
                <th className="p-3 text-left">{t("orderHistory.total")}</th>
                <th className="p-3 text-left">{t("orderHistory.status")}</th>
                <th className="p-3 text-left">{t("orderHistory.date")}</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-t border-gray-200 dark:border-gray-700 hover:bg-bg-dark dark:hover:bg-bg-light transition"
                  >
                    <td className="p-3">{order.id}</td>
                    <td className="p-3">
                      {order.items.map((item) => (
                        <div key={item.title}>
                          {item.title} x {item.quantity} (${item.price_each.toFixed(2)})
                        </div>
                      ))}
                    </td>
                    <td className="p-3 font-medium">${order.total.toFixed(2)}</td>
                    <td className="p-3 capitalize">{order.status}</td>
                    <td className="p-3">{new Date(order.created_at).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center p-6 text-text-secondary dark:text-text-secondary"
                  >
                    {t("orderHistory.noOrders")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
