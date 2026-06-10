import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ApiService from '../services/api';
import './ResetPasswordPage.css';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Token inválido ou ausente.');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (novaSenha !== confirmarSenha) {
      setError('As senhas não coincidem');
      return;
    }
    if (novaSenha.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    setLoading(true);
    setMessage('');
    setError('');
    try {
      await ApiService.resetPassword(token, novaSenha);
      setMessage('Senha alterada com sucesso! Redirecionando...');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.message || 'Erro ao redefinir senha');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="reset-password-page">
        <div className="container">
          <h1>Link inválido</h1>
          <p>O token de recuperação está ausente ou é inválido.</p>
          <a href="/forgot-password">Solicitar novo link</a>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-password-page">
      <div className="container">
        <h1>Definir nova senha</h1>
        {message && <div className="alert-success">{message}</div>}
        {error && <div className="alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nova senha</label>
            <input
              type="password"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Confirmar nova senha</label>
            <input
              type="password"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Alterando...' : 'Alterar senha'}
          </button>
        </form>
        <p className="back-link">
          <a href="/login">Voltar para o login</a>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;