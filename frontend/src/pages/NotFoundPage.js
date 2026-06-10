// src/pages/NotFoundPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NotFoundPage.css';

function NotFoundPage() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="notfound-page">
      <div className="notfound-container">
        {/* Animation Container */}
        <div className="animation-container">
          <div className="error-code">404</div>
          <div className="error-animation">
            <div className="floating-icon">🎉</div>
            <div className="floating-icon delayed-1">📋</div>
            <div className="floating-icon delayed-2">✨</div>
          </div>
        </div>

        {/* Content */}
        <div className="notfound-content">
          <h1 className="notfound-title">Página Não Encontrada</h1>
          
          <p className="notfound-subtitle">
            Oops! Parece que você se perdeu no caminho para criar convites incríveis.
          </p>

          <div className="error-details">
            <div className="detail-item">
              <span className="detail-icon">🔍</span>
              <span>A página que você procura não existe</span>
            </div>
            <div className="detail-item">
              <span className="detail-icon">🗺️</span>
              <span>Verifique a URL e tente novamente</span>
            </div>
            <div className="detail-item">
              <span className="detail-icon">🏠</span>
              <span>Volte para a página inicial</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="action-buttons">
            <button 
              onClick={handleGoHome}
              className="btn btn-primary"
            >
              🏠 Voltar ao Início
            </button>
            <button 
              onClick={handleGoBack}
              className="btn btn-secondary"
            >
              ← Voltar
            </button>
          </div>

          {/* Quick Links */}
          <div className="quick-links">
            <h3>Links Rápidos</h3>
            <nav className="links-grid">
              <a href="/" className="quick-link">
                <span className="link-icon">🎉</span>
                <span>Meus Convites</span>
              </a>
              <a href="/criar" className="quick-link">
                <span className="link-icon">➕</span>
                <span>Criar Convite</span>
              </a>
              <a href="/gerenciar" className="quick-link">
                <span className="link-icon">📋</span>
                <span>Gerenciar</span>
              </a>
            </nav>
          </div>
        </div>
      </div>

      {/* Background Decoration */}
      <div className="background-decoration">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
    </div>
  );
}

export default NotFoundPage;