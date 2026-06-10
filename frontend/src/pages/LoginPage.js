import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ApiService from '../services/api';
import { isAdmin, isSeguranca } from '../utils/authUtils';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (ApiService.isAutenticado()) {
      const usuario = ApiService.getUsuario();
      if (usuario?.role === 'admin') {
        navigate('/gerenciar');
      } else if (usuario?.role === 'seguranca') {
        navigate('/validar-seguranca');
      } else if (usuario?.role === 'organizador') {
        navigate('/organizador/dashboard');
      } else {
        navigate('/');
      }
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro('');

    try {
      const data = await ApiService.login(email, senha);
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      
      if (data.usuario.role === 'admin') {
        navigate('/gerenciar');
      } else if (data.usuario.role === 'seguranca') {
        navigate('/validar-seguranca');
      } else if (data.usuario.role === 'organizador') {
        navigate('/organizador/dashboard');
      } else {
        navigate('/');
      }
      
    } catch (error) {
      setErro(error.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <img 
              src="/images/logo-elaleko2.png" 
              alt="Elaleko" 
              className="login-logo"
            />
            <h1>Login</h1>
          </div>

          {erro && <div className="alert alert-error">{erro}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
              />
            </div>

            <div className="form-group">
              <label>Senha</label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>


          <div className="forgot-password-link">
            <Link to="/forgot-password">Esqueceu a senha?</Link>
          </div>

          
        </div>
      </div>
    </div>
  );
};

export default LoginPage;