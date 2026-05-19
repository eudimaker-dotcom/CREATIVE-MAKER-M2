import React, { useEffect, useState } from 'react';
import {
  Package, Download, Eye, Users, Heart, TrendingUp, Clock,
} from 'lucide-react';
import { getDashboardStats } from '../dataService';
import { DashboardStats } from '../types';

function StatCard({ icon, label, value, accent }: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  accent?: string;
}) {
  return (
    <div className="admin-stat-card">
      <div className="admin-stat-icon" style={{ color: accent || '#6366f1' }}>{icon}</div>
      <div className="admin-stat-info">
        <p className="admin-stat-label">{label}</p>
        <p className="admin-stat-value">{value.toLocaleString()}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats().then(s => {
      setStats(s);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="admin-loading">A carregar...</div>;
  if (!stats) return null;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Dashboard</h1>
        <p>Bem-vindo ao painel de controlo</p>
      </div>

      {/* Stats Grid */}
      <div className="admin-stats-grid">
        <StatCard icon={<Package size={22} />} label="Produtos Publicados" value={stats.total_products} accent="#6366f1" />
        <StatCard icon={<Download size={22} />} label="Total Downloads" value={stats.total_downloads} accent="#8b5cf6" />
        <StatCard icon={<Eye size={22} />} label="Visitas ao Site" value={stats.total_visits} accent="#06b6d4" />
        <StatCard icon={<Users size={22} />} label="Clientes" value={stats.total_clients} accent="#10b981" />
        <StatCard icon={<Heart size={22} />} label="Reações / Likes" value={stats.total_likes} accent="#ec4899" />
      </div>

      <div className="admin-dashboard-cols">
        {/* Top Products */}
        <div className="admin-panel-card">
          <div className="admin-panel-card-header">
            <TrendingUp size={16} />
            <h2>Produtos Mais Baixados</h2>
          </div>
          <div className="admin-top-products">
            {stats.top_products.map((p, i) => (
              <div key={i} className="admin-top-product-row">
                <span className="admin-top-rank">#{i + 1}</span>
                <div className="admin-top-bar-wrap">
                  <span className="admin-top-name">{p.title}</span>
                  <div className="admin-top-bar-bg">
                    <div
                      className="admin-top-bar-fill"
                      style={{ width: `${(p.downloads / stats.top_products[0].downloads) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="admin-top-count">{p.downloads}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Products */}
        <div className="admin-panel-card">
          <div className="admin-panel-card-header">
            <Clock size={16} />
            <h2>Últimos Produtos Publicados</h2>
          </div>
          <div className="admin-recent-list">
            {stats.recent_products.map(p => (
              <div key={p.id} className="admin-recent-item">
                <img src={p.image} alt={p.title} className="admin-recent-thumb" />
                <div className="admin-recent-info">
                  <p className="admin-recent-title">{p.title}</p>
                  <p className="admin-recent-meta">{p.category} · {new Date(p.created_at!).toLocaleDateString('pt-PT')}</p>
                </div>
                <span className="admin-recent-badge">{p.published ? 'Publicado' : 'Rascunho'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
