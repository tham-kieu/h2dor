// src/App.tsx
import { Layout } from "antd";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { OrderProvider } from "./context/OrderContext";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Products from "./pages/Products";
import Auth from "./pages/Auth";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import Settings from "./pages/Settings";
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

const { Content } = Layout;

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <OrderProvider>
          <Layout className="app-layout">
            <Header />

            <Content style={{ marginTop: 64, minHeight: "calc(100vh - 64px - 200px)" }}>
              <Routes>
                {/* Public Routes - Không cần đăng nhập */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/products" element={<Products />} />
                <Route path="/auth" element={<Auth />} />
                
                {/* Protected Routes - Cần đăng nhập */}
                <Route path="/checkout" element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/orders" element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } />
                
                {/* 404 Not Found */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Content>

            <Footer />
          </Layout>
        </OrderProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;