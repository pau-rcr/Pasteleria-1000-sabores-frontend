import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/organisms/ProtectedRoute";

// Pages
import HomePage from "@/pages/HomePage";
import ProductsPage from "@/pages/ProductsPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import CartPage from "@/pages/CartPage";
import RegisterPage from "@/pages/RegisterPage";
import LoginPage from "@/pages/LoginPage";
import ProfilePage from "@/pages/ProfilePage";
import BlogListPage from "@/pages/BlogListPage";
import BlogDetailPage from "@/pages/BlogDetailPage";
import AboutUsPage from "@/pages/AboutUsPage";
import ContactPage from "@/pages/ContactPage";
import OrdersPage from "@/pages/OrdersPage";
import AdminOrdersPage from "@/pages/AdminOrdersPage";
import AdminUsersPage from "@/pages/AdminUsersPage";
import AdminProductsPage from "@/pages/AdminProductsPage";
import SellerOrdersPage from "@/pages/SellerOrdersPage";
import SellerProductsPage from "@/pages/SellerProductsPage";
import NotFound from "@/pages/NotFound";

export function AppRoutes() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/productos" element={<ProductsPage />} />
            <Route path="/productos/:id" element={<ProductDetailPage />} />
            <Route path="/blog" element={<BlogListPage />} />
            <Route path="/blog/:id" element={<BlogDetailPage />} />
            <Route path="/nosotros" element={<AboutUsPage />} />
            <Route path="/contacto" element={<ContactPage />} />
            <Route path="/carrito" element={<CartPage />} />
            <Route path="/registro" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Protected Client Routes */}
            <Route
                path="/perfil"
                element={
                    <ProtectedRoute allowedRoles={["CLIENT"]}>
                        <ProfilePage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/mis-pedidos"
                element={
                    <ProtectedRoute allowedRoles={["CLIENT"]}>
                        <OrdersPage />
                    </ProtectedRoute>
                }
            />

            {/* Protected Admin Routes */}
            <Route
                path="/admin/usuarios"
                element={
                    <ProtectedRoute allowedRoles={["ADMIN"]}>
                        <AdminUsersPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/productos"
                element={
                    <ProtectedRoute allowedRoles={["ADMIN"]}>
                        <AdminProductsPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/pedidos"
                element={
                    <ProtectedRoute allowedRoles={["ADMIN"]}>
                        <AdminOrdersPage />
                    </ProtectedRoute>
                }
            />

            {/* Protected Seller Routes */}
            <Route
                path="/vendedor/productos"
                element={
                    <ProtectedRoute allowedRoles={["SELLER"]}>
                        <SellerProductsPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/vendedor/pedidos"
                element={
                    <ProtectedRoute allowedRoles={["SELLER"]}>
                        <SellerOrdersPage />
                    </ProtectedRoute>
                }
            />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
