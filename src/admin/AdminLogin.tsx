import React, { useState } from 'react';
import { useAuth } from './AuthContext';

export default function AdminLogin() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await login(email, password);
    if (result.error) setError(result.error);
    setLoading(false);
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-logo">
          <div className="admin-logo-dot" />
          <span>Premium Hub</span>
        </div>
        <h1 className="admin-login-title">Painel Admin</h1>
        <p className="admin-login-subtitle">Acesso restrito ao administrador</p>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@premiumhub.ao"
              required
              autoComplete="email"
            />
          </div>
          <div className="admin-form-group">
            <label>Senha</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>
          {error && <div className="admin-login-error">{error}</div>}
          <button type="submit" className="admin-login-btn" disabled={loading}>
            {loading ? 'A entrar...' : 'Entrar'}
          </button>
        </form>

        <p className="admin-login-hint">
          Demo: <strong>admin@premiumhub.ao</strong> / <strong>admin123</strong>
        </p>
      </div>
    </div>
  );
}
