import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, Plus, ClipboardList, Info, HelpCircle, LogOut, Shield, Menu, User, Settings
} from 'lucide-react';
import { isAutenticado, isAdmin, getUsuario } from '../../utils/authUtils';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setLoggedIn(isAutenticado());
    setAdmin(isAdmin());
    setUsuario(getUsuario());
  }, [location]);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setLoggedIn(false);
    setAdmin(false);
    setUsuario(null);
    navigate('/');
    closeMenu();
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <img src="/images/logo-elaleko4.jpeg" alt="Elaleko" className="logo-image" />
        </Link>

        <button className={`hamburger ${isOpen ? 'active' : ''}`} onClick={toggleMenu}>
          <Menu size={24} />
        </button>

        <ul className={`navbar-menu ${isOpen ? 'active' : ''}`}>
          {/* Links visíveis apenas para NÃO LOGADOS */}
          {!loggedIn && (
            <>
              <li><Link to="/" className={`navbar-link ${isActive('/') ? 'active' : ''}`} onClick={closeMenu}><Home size={18} /><span>Início</span></Link></li>
              <li><Link to="/sobre" className={`navbar-link ${isActive('/sobre') ? 'active' : ''}`} onClick={closeMenu}><Info size={18} /><span>Sobre</span></Link></li>
              <li><Link to="/faq" className={`navbar-link ${isActive('/faq') ? 'active' : ''}`} onClick={closeMenu}><HelpCircle size={18} /><span>FAQ</span></Link></li>
            </>
          )}

          {/* Links para ADMIN logado */}
          {admin && (
            <>
              <li><Link to="/criar" className={`navbar-link ${isActive('/criar') ? 'active' : ''}`} onClick={closeMenu}><Plus size={18} /><span>Criar Convite</span></Link></li>
              <li><Link to="/gerenciar" className={`navbar-link ${isActive('/gerenciar') ? 'active' : ''}`} onClick={closeMenu}><ClipboardList size={18} /><span>Gerenciar</span></Link></li>
              <li>
                <Link to="/admin" className="navbar-link">
                  <Settings size={18} />
                  <span>Painel Admin</span>
                </Link>
              </li>
            </>
          )}

          {/* Links para ORGANIZADOR logado */}
          {loggedIn && usuario?.role === 'organizador' && (
            <li><Link to="/organizador/dashboard" className={`navbar-link ${isActive('/organizador/dashboard') ? 'active' : ''}`} onClick={closeMenu}><ClipboardList size={18} /><span>Meus Eventos</span></Link></li>
          )}

          {/* Links para usuários logados (admin, organizador, segurança) */}
          {loggedIn && (
            <>
              <li><Link to="/validar-seguranca" className={`navbar-link ${isActive('/validar-seguranca') ? 'active' : ''}`} onClick={closeMenu}><Shield size={18} /><span>Validar</span></Link></li>
              <li><button onClick={handleLogout} className="btn-logout-custom"><LogOut size={18} /><span>Sair ({usuario?.nome?.split(' ')[0] || usuario?.email?.split('@')[0]})</span></button></li>
            </>
          )}

          {!loggedIn && (
            <li><Link to="/login" className="navbar-link btn-security" onClick={closeMenu}><User size={18} /><span>Login</span></Link></li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;