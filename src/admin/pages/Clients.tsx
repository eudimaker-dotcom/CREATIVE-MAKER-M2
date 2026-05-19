import { useEffect, useState } from 'react';
import { Users, Download } from 'lucide-react';
import { AdminClient } from '../types';
import { getClients } from '../dataService';

export default function Clients() {
  const [clients, setClients] = useState<AdminClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getClients().then(c => { setClients(c); setLoading(false); });
  }, []);

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>Clientes</h1>
          <p>{clients.length} clientes registados</p>
        </div>
      </div>

      <div className="admin-stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ color: '#10b981' }}><Users size={22} /></div>
          <div className="admin-stat-info">
            <p className="admin-stat-label">Total Clientes</p>
            <p className="admin-stat-value">{clients.length}</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ color: '#6366f1' }}><Download size={22} /></div>
          <div className="admin-stat-info">
            <p className="admin-stat-label">Total Downloads</p>
            <p className="admin-stat-value">{clients.reduce((s, c) => s + c.downloads_count, 0)}</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ color: '#f59e0b' }}><Download size={22} /></div>
          <div className="admin-stat-info">
            <p className="admin-stat-label">Média por Cliente</p>
            <p className="admin-stat-value">
              {clients.length ? (clients.reduce((s, c) => s + c.downloads_count, 0) / clients.length).toFixed(1) : 0}
            </p>
          </div>
        </div>
      </div>

      <div className="admin-search-bar">
        <Users size={16} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Pesquisar por nome ou email..." />
      </div>

      {loading ? <div className="admin-loading">A carregar...</div> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Email</th>
                <th>Downloads</th>
                <th>Data de Registo</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id}>
                  <td>
                    <div className="admin-client-cell">
                      <div className="admin-client-avatar">
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                      {c.name}
                    </div>
                  </td>
                  <td className="admin-muted">{c.email}</td>
                  <td>
                    <span className="admin-download-count">
                      <Download size={12} /> {c.downloads_count}
                    </span>
                  </td>
                  <td className="admin-date">{new Date(c.created_at).toLocaleDateString('pt-PT')}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="admin-empty">Nenhum cliente encontrado.</div>}
        </div>
      )}
    </div>
  );
}
