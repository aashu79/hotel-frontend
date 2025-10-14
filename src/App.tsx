import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { ConfigProvider, theme } from "antd";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import MobileOrderButton from "./components/MobileOrderButton/MobileOrderButton";
import { Menu } from "@/pages/Menu";
import { Cart } from "@/pages/Cart";
import NotFound from "./pages/NotFound";
import { Home } from "./pages/Home";
import { useState } from "react";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import ProtectedRouteStaff from "./components/ProtectedRouteStaff";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/Signup";
import StaffLogin from "./pages/StaffLogin";
import Dashboard from "./pages/Dashboard";
import OrdersPage from "./pages/OrdersPage";
import MenuManagementPage from "./pages/MenuManagementPage";
import AdminDashboard from "./pages/AdminDashboard";
import StaffManagement from "./pages/StaffManagement";
import CustomerManagement from "./pages/CustomerManagement";
import MenuCategoryManagement from "./pages/MenuCategoryManagement";
import MenuItemManagement from "./pages/MenuItemManagement";
import RestaurantSettings from "./pages/RestaurantSettings";
import Unauthorized from "./pages/Unauthorized";

// Create a QueryClient instance
const queryClient = new QueryClient();

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
          token: {
            colorPrimary: "#fb923c",
            colorBgContainer: "#0f172a",
            colorBgElevated: "#1e293b",
            borderRadius: 8,
          },
        }}
      >
        <TooltipProvider>
          <CartProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Staff Dashboard Route (STAFF role only) */}
                <Route
                  element={<ProtectedRouteStaff allowedRoles={["STAFF"]} />}
                >
                  <Route path="/dashboard" element={<Dashboard />} />
                </Route>

                {/* Admin & Staff Shared Routes */}
                <Route
                  element={
                    <ProtectedRouteStaff allowedRoles={["ADMIN", "STAFF"]} />
                  }
                >
                  <Route
                    path="/dashboard/menu-categories"
                    element={<MenuCategoryManagement />}
                  />
                  <Route
                    path="/dashboard/menu-items"
                    element={<MenuItemManagement />}
                  />
                  <Route path="/dashboard/orders" element={<OrdersPage />} />
                </Route>

                {/* Admin Only Routes */}
                <Route
                  element={<ProtectedRouteStaff allowedRoles={["ADMIN"]} />}
                >
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/staff" element={<StaffManagement />} />
                  <Route
                    path="/admin/customers"
                    element={<CustomerManagement />}
                  />
                  <Route
                    path="/admin/settings"
                    element={<RestaurantSettings />}
                  />
                </Route>

                {/* Staff Login */}
                <Route path="/staff-login" element={<StaffLogin />} />
                <Route path="/unauthorized" element={<Unauthorized />} />

                {/* Customer Routes with Shared Layout */}
                <Route
                  path="*"
                  element={
                    <div className="flex flex-col min-h-screen bg-deep-black">
                      <Navbar onMenuToggle={setIsSidebarOpen} />
                      <main className="flex-1">
                        <Routes>
                          {/* Public Routes */}
                          <Route path="/" element={<Home />} />
                          <Route path="/menu" element={<Menu />} />
                          <Route path="/signin" element={<SignIn />} />
                          <Route path="/signup" element={<SignUp />} />

                          {/* Customer Protected Routes */}
                          <Route element={<ProtectedRoute />}>
                            <Route path="/cart" element={<Cart />} />
                            <Route path="/profile" element={<Profile />} />
                          </Route>

                          {/* Catch-all Route */}
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </main>
                      <Footer />
                      <MobileOrderButton isSidebarOpen={isSidebarOpen} />
                    </div>
                  }
                />
              </Routes>
            </BrowserRouter>
          </CartProvider>
        </TooltipProvider>
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default App;
