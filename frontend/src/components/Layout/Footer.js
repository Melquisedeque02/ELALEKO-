import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Coluna 1: Logótipo e descrição */}
          <div className="footer-brand">
            <img
              src="/images/logo-elaleko3.png"
              alt="Elaleko"
              className="footer-logo"
            />
            <p>Convites digitais com validação por QR Code</p>
          </div>

          {/* Coluna 2: Links rápidos */}
          <div className="footer-links">
            <h4>Navegação</h4>
            <ul>
              <li><Link to="/">Início</Link></li>
              <li><Link to="/sobre">Sobre</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/login">Login</Link></li>
            </ul>
          </div>

          {/* Coluna 3: Redes sociais */}
          <div className="footer-social">
            <h4>Nossas Redes</h4>
            <div className="social-icons">
              <a
                href="https://wa.me/244922965959"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon whatsapp"
                aria-label="WhatsApp"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.032 2.012c-5.524 0-10 4.476-10 10 0 1.728.44 3.356 1.212 4.772L2.012 22.5l5.884-1.432c1.356.68 2.872 1.048 4.456 1.048 5.524 0 10-4.476 10-10s-4.476-10-10-10zm0 18.2c-1.448 0-2.872-.36-4.148-1.044l-3.572.872.944-3.48c-.76-1.28-1.18-2.748-1.18-4.276 0-4.6 3.744-8.34 8.34-8.34s8.34 3.744 8.34 8.34-3.744 8.34-8.34 8.34z"/>
                  <path d="M16.968 14.18c-.204-.104-1.216-.6-1.404-.668-.188-.068-.324-.104-.464.104-.14.208-.54.668-.664.804-.124.14-.248.156-.452.052-.204-.104-.86-.316-1.636-1.008-.608-.54-1.016-1.208-1.136-1.408-.12-.204-.012-.312.092-.416.096-.096.208-.244.312-.368.104-.124.14-.208.208-.348.068-.14.036-.26-.016-.364-.052-.104-.464-1.12-.632-1.536-.172-.408-.344-.352-.468-.352-.12 0-.256-.012-.392-.012-.14 0-.368.052-.56.26-.192.208-.732.716-.732 1.748s.752 2.028.856 2.168c.104.14 1.48 2.26 3.576 3.16.496.212.888.336 1.192.432.5.16.956.136 1.32.08.404-.06 1.216-.496 1.388-.976.172-.48.172-.892.12-.976-.052-.084-.192-.136-.396-.24z"/>
                </svg>
              </a>
              <a
                href="https://www.instagram.com/milvendasconsultoria?igsh=MTh1MnN4Zjdsa2hnbA=="
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon instagram"
                aria-label="Instagram"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM12 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-bottom">
          <p>
            <strong>Copyright</strong> &copy; {currentYear} Elaleko - Todos os direitos reservados
          </p>
          <p className="credits">
            <strong>Mil Vendas Consultoria</strong>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;