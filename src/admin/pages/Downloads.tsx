import { useEffect, useState } from 'react';
import { Download, TrendingUp } from 'lucide-react';
import { AdminProduct } from '../types';
import { getProducts } from '../dataService';

export default function Downloads() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts().then(p => {
      setProducts([...p].sort((a, b) => (b.downloads_count || 0) - (a.downloads_count || 0)));
      setLoading(false);
    });
  }, []);

  const total = products.reduce((s, p) => s + (p.downloads_count || 0), 0);
  const maxDownloads = products[0]?.downloads_count || 1;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>Downloads</h1>
          <p>{total.toLocaleString()} downloads no total</p>
        </div>
      </div>

      <div className="admin-stats-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ color: '#6366f1' }}><Download size={22} /></div>
          <div className="admin-stat-info">
            <p className="admin-stat-label">Total Downloads</p>
            <p className="admin-stat-value">{total.toLocaleString()}</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ color: '#10b981' }}><TrendingUp size={22} /></div>
          <div className="admin-stat-info">
            <p className="admin-stat-label">Produto Mais Baixado</p>
            <p className="admin-stat-value" style={{ fontSize: '0.9rem' }}>{products[0]?.title || '—'}</p>
          </div>
        </div>
      </div>

      {loading ? <div className="admin-loading">A carregar...</div> : (
        <div className="admin-panel-card">
          <div className="admin-panel-card-header">
            <TrendingUp size={16} />
            <h2>Downloads por Produto</h2>
          </div>
          <div className="admin-downloads-list">
            {products.map((p, i) => (
              <div key={p.id} className="admin-download-row">
                <span className="admin-top-rank">#{i + 1}</span>
                <img src={p.image} alt={p.title} className="admin-product-thumb" />
                <div className="admin-download-info">
                  <p className="admin-recent-title">{p.title}</p>
                  <div className="admin-top-bar-bg">
                    <div
                      className="admin-top-bar-fill"
                      style={{ width: `${((p.downloads_count || 0) / maxDownloads) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="admin-top-count">{p.downloads_count || 0}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
