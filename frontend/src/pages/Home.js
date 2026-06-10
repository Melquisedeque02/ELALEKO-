import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Shield, Users, ArrowRight } from 'lucide-react';
import './HomePage.css';

// Importar do MElqui
const qrPhoneImage = '/images/qr-phone.jpeg';

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Convites digitais com QR Code
            </h1>
            <p className="hero-description">
              Crie, personalize e valide convites de forma simples e segura.
              Ideal para casamentos, aniversários, formaturas e qualquer evento
              que exija controle de entrada.
            </p>
            <div className="hero-buttons">
              <Link to="/registro" className="btn btn-primary">
                Criar conta <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="btn btn-outlinee">
                Já tenho conta
              </Link>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">500+</span>
                <span className="stat-label">eventos gerados</span>
              </div>
              <div className="stat">
                <span className="stat-number">10k+</span>
                <span className="stat-label">convites validados</span>
              </div>
              <div className="stat">
                <span className="stat-number">99%</span>
                <span className="stat-label">satisfação</span>
              </div>
            </div>
          </div>
          <div className="hero-image">
            <div className="qr-graphic">
              <img 
                src={qrPhoneImage} 
                alt="Telemóvel a escanear QR Code" 
                className="qr-phone-image"
              />
              <div className="qr-pulse"></div>
            </div>
          </div>
        </div>
      </section>


      {/* Benefícios / Features */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Tudo o que precisa num só lugar</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon"><Sparkles size={32} /></div>
              <h3>QR Code único</h3>
              <p>Cada convite gera um código exclusivo, impossível de duplicar.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><Shield size={32} /></div>
              <h3>Validação segura</h3>
              <p>Na entrada, o segurança escaneia o QR Code e confirma em tempo real.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><Users size={32} /></div>
              <h3>Gestão completa</h3>
              <p>Organize eventos, acompanhe confirmados e tenha total controle.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action final */}
      <section className="cta">
        <div className="container">
          <h2>Pronto para modernizar os seus convites?</h2>
          <p>Junte‑se a centenas de organizadores que já usam o Elaleko.</p>
          <Link to="/registro" className="btn btn-primary btn-large">
            Começar agora
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;