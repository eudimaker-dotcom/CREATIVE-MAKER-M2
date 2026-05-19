import React, { useState } from 'react';
import { LayoutDashboard, Package, Users, Download, LogOut, Menu, X, ExternalLink, ChevronRight } from 'lucide-react';
import { useAuth } from './AuthContext';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Clients from './pages/Clients';
import DownloadsPage from './pages/Downloads';

type AdminPage = 'dashboard' | 'products' | 'clients' | 'downloads';

const NAV_ITEMS: { id: AdminPage; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { id: 'products', label: 'Produtos', icon: <Package size={18} /> },
  { id: 'clients', label: 'Clientes', icon: <Users size={18} /> },
  { id: 'downloads', label: 'Downloads', icon: <Download size={18} /> },
];

export default function AdminLayout() {
  const { logout } = useAuth();
  const [page, setPage] = useState<AdminPage>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderPage = () => {
    switch (page) {
      case 'dashboard': return <Dashboard />;
      case 'products': return <Products />;
      case 'clients': return <Clients />;
      case 'downloads': return <DownloadsPage />;
    }
  };

  const navigate = (id: AdminPage) => {
    setPage(id);
    setSidebarOpen(false);
  };

  return (
    <div className="admin-root">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-logo">
          <div className="admin-logo-dot" />
          <span>Premium Hub</span>
          <button className="admin-sidebar-close" onClick={() => setSidebarOpen(false)}><X size={18} /></button>
        </div>

        <nav className="admin-nav">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              className={`admin-nav-item ${page === item.id ? 'active' : ''}`}
              onClick={() => navigate(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
              {page === item.id && <ChevronRight size={14} className="admin-nav-chevron" />}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="admin-nav-item"
          >
            <ExternalLink size={18} />
            <span>Ver Site</span>
          </a>
          <button className="admin-nav-item logout" onClick={logout}>
            <LogOut size={18} />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="admin-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="admin-main">
        {/* Top bar */}
        <header className="admin-topbar">
          <button className="admin-hamburger" onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>
          <div className="admin-topbar-title">
            {NAV_ITEMS.find(n => n.id === page)?.label}
          </div>
          <div className="admin-topbar-user">
            <div className="admin-user-avatar">A</div>
            <span>Admin</span>
          </div>
        </header>

        {/* Page content */}
        <main className="admin-content">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
