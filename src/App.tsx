import { Routes, Route } from "react-router-dom";

// Importing components
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Importing pages
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import DishDetailsPage from "./pages/DishDetailsPage"; 
import CheckoutPage from "./pages/CheckoutPage"; 

// Importing admin pages
import AdminDashboard from "./pages/AdminDashboard";
import DishManagement from "./pages/DishManagement";
import ReviewTable from "./pages/ReviewTable";
import UserTable from "./pages/UserTable";
import OrdersAdmin from "./pages/OrdersAdmin";

// Importing user dashboard pages
import UserDashboard from "./pages/Dashboard";
import AccountDetails from "./pages/AccountDetails";
import OrderHistory from "./pages/OrderHistory";

// Import AdminRoute and PrivateRoute
import { AdminRoute } from "./context/AdminContext";
import  PrivateRoute  from "./context/PrivateRoute"; 

export default function App() {
  return (
    <div className="bg-bglight dark:bg-bg-dark">
      <Header />
      <Navbar />

      <Routes>
        {/* Public routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/dish/:id" element={<DishDetailsPage />} /> 
        <Route path="/about" element={<AboutPage />} /> 
        <Route path="/contact" element={<ContactPage />} />

        {/* Protected routes */}
        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <Cart />
            </PrivateRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <PrivateRoute>
              <CheckoutPage />
            </PrivateRoute>
          }
        />

        {/* Admin dashboard routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        >
          <Route path="dishes" element={<DishManagement />} />
          <Route path="reviews" element={<ReviewTable />} />
          <Route path="users" element={<UserTable />} />
          <Route path="orders" element={<OrdersAdmin />} />
        </Route>

        {/* User dashboard routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <UserDashboard />
            </PrivateRoute>
          }
        >
          <Route path="account" element={<AccountDetails />} />
          <Route path="orders" element={<OrderHistory />} />
        </Route>
      </Routes>

      <Footer />
    </div>
  );
}
