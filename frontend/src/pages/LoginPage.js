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

    // Validação básica no frontend
    if (!email.trim()) {
      setErro('Por favor, insira seu email');
      setLoading(false);
      return;
    }

    if (!senha.trim()) {
      setErro('Por favor, insira sua senha');
      setLoading(false);
      return;
    }

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
      // Tratamento suave de erros - mensagens amigáveis
      let mensagemAmigavel = '';
      
      switch (error.message) {
        case 'Failed to fetch':
          mensagemAmigavel = 'Não foi possível conectar ao servidor. Verifique sua conexão com a internet e tente novamente.';
          break;
        case 'Email ou senha inválidos':
          mensagemAmigavel = 'Email ou senha incorretos. Por favor, verifique seus dados e tente novamente.';
          break;
        case 'Conta desativada. Contacte o administrador.':
          mensagemAmigavel = 'Sua conta está desativada. Entre em contato com o administrador do sistema.';
          break;
        case 'Network Error':
          mensagemAmigavel = 'Erro de rede. Verifique sua conexão com a internet.';
          break;
        default:
          mensagemAmigavel = 'Ocorreu um erro ao tentar fazer login. Tente novamente em alguns instantes.';
      }
      
      setErro(mensagemAmigavel);
      console.error('Erro de login:', error); // Log apenas para desenvolvimento
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
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/images/logo-default.png';
              }}
            />
            <h1>Login</h1>
          </div>

          {erro && (
            <div className="alert alert-error">
              <span className="alert-icon">⚠️</span>
              {erro}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                disabled={loading}
                autoComplete="email"
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
                disabled={loading}
                autoComplete="current-password"
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading}
            >
              {loading ? 'A entrar...' : 'Entrar'}
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