import { useEffect, useState } from "react";
import api from "../api/api";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  role: "admin" | "user";
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(users.filter(user => user.id !== id));
      alert("User deleted");
    } catch (err) {
      console.error(err);
      alert("Failed to delete user");
    }
  };

  const handleChangeRole = async (id: number, currentRole: "admin" | "user") => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    try {
      await api.put(`/admin/users/${id}/role`, { role: newRole });
      setUsers(users.map(user => user.id === id ? { ...user, role: newRole } : user));
      alert(`Role changed to ${newRole}`);
    } catch (err) {
      console.error(err);
      alert("Failed to change role");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="flex flex-col p-4 sm:p-6 bg-bg-light dark:bg-bg-dark min-h-screen">
      <div className="w-full max-w-6xl mx-auto bg-primary dark:bg-accent rounded-lg shadow-md p-4 sm:p-6">
        <h1 className="text-xl font-bold text-bg-dark dark:text-bg-light mb-6">User Management</h1>

        {/* Mobile Cards */}
        <div className="flex flex-col gap-4 lg:hidden">
          {users.length > 0 ? users.map(user => (
            <div key={user.id} className="bg-primary dark:bg-accent rounded-lg p-4 shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <h3 className="font-semibold">{user.first_name} {user.last_name}</h3>
                <div className="text-sm text-text-secondary dark:text-text-secondary">{user.email}</div>
                <div className="text-sm text-text-secondary dark:text-text-secondary">{user.phone}</div>
                <div className="text-sm text-text-secondary dark:text-text-secondary">{user.address}</div>
                <div className="text-sm font-medium mt-1">{user.role}</div>
              </div>
              <div className="flex items-center gap-2 mt-2 sm:mt-0 flex-wrap">
                <button
                  onClick={() => handleDelete(user.id)}
                  className="px-3 py-1 rounded bg-accent text-bg-light hover:bg-bg-dark dark:hover:bg-bg-light transition"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleChangeRole(user.id, user.role)}
                  className="px-3 py-1 rounded bg-highlight text-bg-light hover:bg-bg-dark dark:hover:bg-bg-light transition"
                >
                  {user.role === "admin" ? "Set User" : "Set Admin"}
                </button>
              </div>
            </div>
          )) : (
            <div className="text-center p-4 text-text-secondary dark:text-text-secondary">No users found</div>
          )}
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full table-auto border-collapse rounded-lg">
            <thead className="bg-secondary dark:bg-secondary-dark">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Address</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? users.map(user => (
                <tr key={user.id} className="border-t border-gray-200 dark:border-gray-700 hover:bg-bg-dark dark:hover:bg-bg-light transition cursor-pointer">
                  <td className="p-3">{user.first_name} {user.last_name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.phone}</td>
                  <td className="p-3">{user.address}</td>
                  <td className="p-3">{user.role}</td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="px-3 py-1 rounded bg-accent text-bg-light hover:bg-bg-dark dark:hover:bg-bg-light transition"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleChangeRole(user.id, user.role)}
                      className="px-3 py-1 rounded bg-highlight text-bg-light hover:bg-bg-dark dark:hover:bg-bg-light transition"
                    >
                      {user.role === "admin" ? "Set User" : "Set Admin"}
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="text-center p-6 text-text-secondary dark:text-text-secondary">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
