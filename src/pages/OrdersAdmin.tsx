import { useEffect, useState } from "react";
import { Trash2, Edit } from "lucide-react";
import API from "../api/api";
import { useTranslation } from "react-i18next";

interface OrderItem {
  order_id: number;
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
  status: "pending" | "confirmed" | "shipped" | "delivered";
  created_at: string;
  items?: OrderItem[];
}

const OrdersAdmin: React.FC = () => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<Order["status"]>("pending");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/orders");
      const normalizedOrders: Order[] = res.data.map((o: any) => ({
        ...o,
        total: Number(o.total),
      }));
      setOrders(normalizedOrders);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async () => {
    if (!selectedOrder) return;
    try {
      await API.put(`/admin/orders/${selectedOrder.id}/status`, {
        status: newStatus,
      });
      setOrders((prev) =>
        prev.map((o) =>
          o.id === selectedOrder.id ? { ...o, status: newStatus } : o
        )
      );
      setStatusModalOpen(false);
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const handleDeleteOrder = async () => {
    if (!selectedOrder) return;
    try {
      await API.delete(`/admin/orders/${selectedOrder.id}`);
      setOrders((prev) => prev.filter((o) => o.id !== selectedOrder.id));
      setDeleteModalOpen(false);
    } catch (err) {
      console.error("Failed to delete order", err);
    }
  };

  if (loading) return <p className="p-6">{t("loading_orders")}</p>;

  return (
    <div className="flex flex-col p-4 sm:p-6 bg-bg-light dark:bg-bg-dark min-h-screen">
      <div className="w-full max-w-6xl mx-auto bg-primary dark:bg-accent rounded-lg shadow-md p-4 sm:p-6">
        <h1 className="text-xl font-bold text-bg-dark dark:text-bg-light mb-6">
          {t("orders_management")}
        </h1>

        {/* Mobile Cards */}
        <div className="flex flex-col gap-4 lg:hidden">
          {orders.length > 0 ? (
            orders.map((order) => (
              <div
                key={order.id}
                className="bg-primary dark:bg-accent rounded-lg p-4 shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
              >
                <div>
                  <h3 className="font-semibold">
                    {order.first_name} {order.last_name}
                  </h3>
                  <div className="text-sm text-text-secondary dark:text-text-secondary">
                    {order.email}
                  </div>
                  <div className="text-sm text-text-secondary dark:text-text-secondary">
                    {order.phone}
                  </div>
                  <div className="text-sm text-text-secondary dark:text-text-secondary">
                    {order.address}
                  </div>
                  <div className="text-sm font-medium mt-1">
                    {t("total")}: ${order.total.toFixed(2)}
                  </div>
                  <div className="text-sm font-medium mt-1 capitalize">
                    {order.status}
                  </div>
                  <div className="text-sm text-text-secondary mt-1">
                    {new Date(order.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2 sm:mt-0 flex-wrap">
                  <button
                    onClick={() => {
                      setSelectedOrder(order);
                      setNewStatus(order.status);
                      setStatusModalOpen(true);
                    }}
                    className="px-3 py-1 rounded bg-highlight text-bg-light hover:bg-bg-dark dark:hover:bg-bg-light transition"
                  >
                    <Edit size={16} /> {t("update_status")}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedOrder(order);
                      setDeleteModalOpen(true);
                    }}
                    className="px-3 py-1 rounded bg-accent text-bg-light hover:bg-bg-dark dark:hover:bg-bg-light transition"
                  >
                    <Trash2 size={16} /> {t("delete")}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-4 text-text-secondary dark:text-text-secondary">
              {t("no_orders")}
            </div>
          )}
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full table-auto border-collapse rounded-lg">
            <thead className="bg-secondary dark:bg-secondary-dark">
              <tr>
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">{t("customer")}</th>
                <th className="p-3 text-left">{t("email")}</th>
                <th className="p-3 text-left">{t("phone")}</th>
                <th className="p-3 text-left">{t("address")}</th>
                <th className="p-3 text-left">{t("total")}</th>
                <th className="p-3 text-left">{t("status")}</th>
                <th className="p-3 text-left">{t("date")}</th>
                <th className="p-3 text-right">{t("actions")}</th>
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
                      {order.first_name} {order.last_name}
                    </td>
                    <td className="p-3">{order.email}</td>
                    <td className="p-3">{order.phone}</td>
                    <td className="p-3">{order.address}</td>
                    <td className="p-3 font-medium">${order.total.toFixed(2)}</td>
                    <td className="p-3 capitalize">{order.status}</td>
                    <td className="p-3">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-right flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setNewStatus(order.status);
                          setStatusModalOpen(true);
                        }}
                        className="px-3 py-1 rounded bg-highlight text-bg-light hover:bg-bg-dark dark:hover:bg-bg-light transition"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setDeleteModalOpen(true);
                        }}
                        className="px-3 py-1 rounded bg-accent text-bg-light hover:bg-bg-dark dark:hover:bg-bg-light transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={9}
                    className="text-center p-6 text-text-secondary dark:text-text-secondary"
                  >
                    {t("no_orders")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status Modal */}
      {statusModalOpen && selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="bg-primary dark:bg-accent p-6 rounded-lg shadow-lg w-96 relative z-10">
            <h2 className="text-lg font-semibold mb-4">{t("change_status")}</h2>
            <select
              className="w-full border p-2 rounded mb-4"
              value={newStatus}
              onChange={(e) =>
                setNewStatus(e.target.value as Order["status"])
              }
            >
              <option value="pending">{t("pending")}</option>
              <option value="confirmed">{t("confirmed")}</option>
              <option value="shipped">{t("shipped")}</option>
              <option value="delivered">{t("delivered")}</option>
            </select>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setStatusModalOpen(false)}
                className="px-4 py-2 border rounded"
              >
                {t("cancel")}
              </button>
              <button
                onClick={handleStatusChange}
                className="px-4 py-2 bg-highlight text-bg-light rounded"
              >
                {t("update")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModalOpen && selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="bg-primary dark:bg-accent p-6 rounded-lg shadow-lg w-96 relative z-10">
            <h2 className="text-lg font-semibold mb-4">{t("delete_order")}</h2>
            <p>
              {t("delete_order_confirm", { id: selectedOrder.id })}
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 border rounded"
              >
                {t("cancel")}
              </button>
              <button
                onClick={handleDeleteOrder}
                className="px-4 py-2 bg-accent text-bg-light rounded"
              >
                {t("delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersAdmin;
