import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BookRide from "./pages/BookRide";
import UserDashboard from "./pages/UserDashboard";
import DriverDashboard from "./pages/DriverDashboard";
import RideDetails from "./pages/RideDetails";
import NotFound from "./pages/NotFound";

// Components
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Role-based Protected Route Component
const RoleProtectedRoute = ({ 
  children, 
  allowedRoles 
}: { 
  children: React.ReactNode;
  allowedRoles: string[];
}) => {
  const { isAuthenticated, userRole } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Layout Component
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/login" element={<Layout><Login /></Layout>} />
            <Route path="/register" element={<Layout><Register /></Layout>} />
            
            {/* Protected Routes */}
            <Route path="/book" element={
              <ProtectedRoute>
                <Layout><BookRide /></Layout>
              </ProtectedRoute>
            } />
            
            {/* User Routes */}
            <Route path="/user/dashboard" element={
              <RoleProtectedRoute allowedRoles={['user']}>
                <Layout><UserDashboard /></Layout>
              </RoleProtectedRoute>
            } />
            <Route path="/rides/:id" element={
              <RoleProtectedRoute allowedRoles={['user']}>
                <Layout><RideDetails /></Layout>
              </RoleProtectedRoute>
            } />
            
            {/* Driver Routes */}
            <Route path="/driver/dashboard" element={
              <RoleProtectedRoute allowedRoles={['driver']}>
                <Layout><DriverDashboard /></Layout>
              </RoleProtectedRoute>
            } />
            
            {/* 404 Route */}
            <Route path="*" element={<Layout><NotFound /></Layout>} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
