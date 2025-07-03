import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import Layout from './components/layout/Layout';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import WatchPage from './pages/WatchPage';
import CategoryPage from './pages/CategoryPage';
import CreatorPage from './pages/CreatorPage';
import ProfilePage from './pages/ProfilePage';
import MyLibraryPage from './pages/MyLibraryPage';
import PaymentPage from './pages/PaymentPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useAuthStore } from './store/authStore';

// ✅ Load your Stripe publishable key
const stripePromise = loadStripe(
  'pk_live_51RfKf3AGJ9VOvdss54yJ571gHjYqx6PD2E7TyQCfwsBWcY7JFaRlif9cddDMFg6kubKygzWkWxFKPUwCqHWYEieB00TfkqnrUX',
  { advancedFraudSignals: false }
);


function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Elements stripe={stripePromise}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="categories/:category" element={<CategoryPage />} />
          <Route path="movie/:id" element={<MovieDetailsPage />} />
          <Route path="creator/:id" element={<CreatorPage />} />

          {/* Protected routes */}
          <Route path="watch/:id" element={
            <ProtectedRoute>
              <WatchPage />
            </ProtectedRoute>
          } />
          <Route path="payment/:id" element={
            <ProtectedRoute>
              <PaymentPage />
            </ProtectedRoute>
          } />
          <Route path="profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="my-library" element={
            <ProtectedRoute>
              <MyLibraryPage />
            </ProtectedRoute>
          } />
        </Route>

        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard/*" element={<AdminDashboard />} />
      </Routes>
    </Elements>
  );
}

export default App;
