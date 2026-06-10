import React, { useState } from 'react';
import ApiService from '../services/api';
import './ForgotPasswordPage.css';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const data = await ApiService.forgotPassword(email);
      setMessage(data.message || 'Verifique o seu email para as instruções.');
    } catch (err) {
      setError(err.message || 'Erro ao solicitar recuperação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="container">
        <h1>Recuperar Senha</h1>
        <p>Digite o seu email e enviaremos um link para redefinir a senha.</p>
        {message && <div className="alert-success">{message}</div>}
        {error && <div className="alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar link'}
          </button>
        </form>
        <p className="back-link">
          <a href="/login">Voltar para o login</a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;