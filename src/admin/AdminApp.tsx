import './admin.css';
import { AuthProvider, useAuth } from './AuthContext';
import AdminLogin from './AdminLogin';
import AdminLayout from './AdminLayout';

function AdminGuard() {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="admin-fullscreen-loading">A verificar sessão...</div>;
  return isAuthenticated ? <AdminLayout /> : <AdminLogin />;
}

export default function AdminApp() {
  return (
    <AuthProvider>
      <AdminGuard />
    </AuthProvider>
  );
}
