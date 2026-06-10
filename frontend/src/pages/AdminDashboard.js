import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Plus, ClipboardList, Shield, Settings, UserPlus, UserCog, DollarSign } from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Painel do Administrador</h1>
        <p>Gerir sistema, utilizadores e funcionalidades</p>
      </div>

      <div className="dashboard-cards">
        <Link to="/admin/usuarios" className="dashboard-card">
          <div className="card-icon"><Users size={32} /></div>
          <div>
            <h3>Gestão de Utilizadores</h3>
            <p>Ver, ativar/desativar e criar utilizadores (admin/segurança/organizador)</p>
          </div>
        </Link>

        <Link to="/criar" className="dashboard-card">
          <div className="card-icon"><Plus size={32} /></div>
          <div>
            <h3>Criar Convite</h3>
            <p>Criar novos convites (administrativo)</p>
          </div>
        </Link>

        <Link to="/gerenciar" className="dashboard-card">
          <div className="card-icon"><ClipboardList size={32} /></div>
          <div>
            <h3>Gerenciar Convites</h3>
            <p>Ver todos os convites do sistema</p>
          </div>
        </Link>

        <Link to="/validar-seguranca" className="dashboard-card">
          <div className="card-icon"><Shield size={32} /></div>
          <div>
            <h3>Validar Convites</h3>
            <p>Área de validação (segurança)</p>
          </div>
        </Link>

        <Link to="/admin/configuracoes" className="dashboard-card">
          <div className="card-icon"><Settings size={32} /></div>
          <div>
            <h3>Configurações</h3>
            <p>Definições do sistema (futuro)</p>
          </div>
        </Link>

        {/* ========== CARD DE CRÉDITOS E IA (COMENTADO - REATIVAR NO FUTURO) ========== */}
        {/* <Link to="/admin/creditos" className="dashboard-card">
          <div className="card-icon"><DollarSign size={32} /></div>
          <div>
            <h3>Gestão de Créditos e IA</h3>
            <p>Gerir saldos, transações, templates IA e configurações</p>
          </div>
        </Link> */}
        {/* =========================================================================== */}
      </div>

      <div className="admin-actions">
        <h3>Ações rápidas</h3>
        <div className="action-buttons">
          <Link to="/admin/usuarios/novo" className="btn-action">
            <UserPlus size={18} /> Criar novo utilizador
          </Link>
          <Link to="/admin/backup" className="btn-action">
            <UserCog size={18} /> Backup (futuro)
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;