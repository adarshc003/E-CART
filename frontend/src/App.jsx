import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import ScrollToTop from "./components/ScrollToTop";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AddProduct from "./pages/AddProduct";
import MyProducts from "./pages/MyProducts";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import AddAddress from "./pages/AddAddress";
import SelectAddress from "./pages/SelectAddress";
import Payment from "./pages/Payment";
import Orders from "./pages/Orders";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/admin/AdminDashboard";
import EditProduct from "./pages/EditProduct";
import SellerOrders from "./pages/SellerOrders";
import SellerDashboard from "./pages/SellerDashboard";
import OrderSuccess from "./pages/OrderSuccess";

function AppWrapper() {
  const location = useLocation();

  // Hide footer on auth pages
  const hideFooter =
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/register");

  return (
    <>
      <Navbar />
      <ScrollToTop />

      <div
        style={{
          minHeight: "100vh",
        }}
      >
        <div className="container">
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/add-address" element={<AddAddress />} />
            <Route path="/checkout" element={<SelectAddress />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/profile" element={<Profile />} />

            <Route path="/login" element={<Navigate to="/login/user" />} />
            <Route path="/login/:role" element={<Login />} />
            <Route path="/register/:role" element={<Register />} />

            <Route path="/seller" element={<SellerDashboard />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/my-products" element={<MyProducts />} />
            <Route path="/seller-orders" element={<SellerOrders />} />

            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/edit/:id" element={<EditProduct />} />
          </Routes>
        </div>
      </div>

      {!hideFooter && <Footer />}

      <Toaster position="top-right" richColors closeButton theme="light" />
    </>
  );
}

export default AppWrapper;
