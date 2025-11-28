import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { MenuProvider } from './contexts/MenuContext';
import { OrderProvider } from './contexts/OrderContext';
import { PromoProvider } from './contexts/PromoContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AdminRoute } from './components/auth/AdminRoute';
import Header from './components/common/Header';
import Footer from './components/common/Footer';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import NotFoundPage from './pages/NotFoundPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ProfilePage from './pages/ProfilePage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMenuItems from './pages/admin/AdminMenuItems';
import AdminOrders from './pages/admin/AdminOrders';
import AdminPromos from './pages/admin/AdminPromos';

function App() {
  return (
    <Router>
      <AuthProvider>
        <MenuProvider>
          <CartProvider>
            <OrderProvider>
              <PromoProvider>
                <div className="flex flex-col min-h-screen">
                  <Header />
                  <main className="flex-grow">
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/" element={<HomePage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/register" element={<RegisterPage />} />
                      <Route path="/menu" element={<MenuPage />} />
                      <Route path="/about" element={<AboutPage />} />
                      <Route path="/contact" element={<ContactPage />} />

                      {/* Protected Routes */}
                      <Route
                        path="/profile"
                        element={
                          <ProtectedRoute>
                            <ProfilePage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/cart"
                        element={
                          <ProtectedRoute>
                            <CartPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/orders"
                        element={
                          <ProtectedRoute>
                            <OrderHistoryPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/orders/:id"
                        element={
                          <ProtectedRoute>
                            <OrderTrackingPage />
                          </ProtectedRoute>
                        }
                      />

                      {/* Admin Routes */}
                      <Route
                        path="/admin"
                        element={
                          <AdminRoute>
                            <AdminDashboard />
                          </AdminRoute>
                        }
                      />
                      <Route
                        path="/admin/menu"
                        element={
                          <AdminRoute>
                            <AdminMenuItems />
                          </AdminRoute>
                        }
                      />
                      <Route
                        path="/admin/orders"
                        element={
                          <AdminRoute>
                            <AdminOrders />
                          </AdminRoute>
                        }
                      />
                      <Route
                        path="/admin/promos"
                        element={
                          <AdminRoute>
                            <AdminPromos />
                          </AdminRoute>
                        }
                      />

                      {/* 404 Route */}
                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              </PromoProvider>
            </OrderProvider>
          </CartProvider>
        </MenuProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;