import React, { useState, useEffect } from 'react';
import ApiService from '../services/api';
import { CheckCircle, XCircle, Trash2, RefreshCw, Link, UserPlus  } from 'lucide-react';
import './AdminUsersPage.css';

const AdminUsersPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    try {
      setLoading(true);
      const data = await ApiService.listarUsuariosAdmin();
      setUsuarios(data);
    } catch (error) {
      setErro('Erro ao carregar utilizadores');
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id, ativoAtual) => {
    try {
      await ApiService.alterarStatusUsuario(id, ativoAtual === 1 ? 0 : 1);
      carregarUsuarios();
    } catch (error) {
      alert('Erro ao alterar status');
    }
  };

  const deletarUsuario = async (id, email) => {
    if (window.confirm(`Tem certeza que deseja remover o utilizador ${email}?`)) {
      try {
        await ApiService.deletarUsuarioAdmin(id);
        carregarUsuarios();
      } catch (error) {
        alert('Erro ao remover utilizador');
      }
    }
  };

  if (loading) return <div className="loading-spinner"></div>;

  return (
    <div className="admin-users-page">
      <div className="admin-header">
        <h1>Gestão de Utilizadores</h1>
        <button onClick={carregarUsuarios} className="btn-refresh">
          <RefreshCw size={16} /> Actualizar
        </button>
        
      </div>

      {erro && <div className="alert-error">{erro}</div>}

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Função</th>
              <th>Estado</th>
              <th>Criado em</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.nome}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge role-${user.role}`}>
                    {user.role === 'admin' ? 'Administrador' : user.role === 'organizador' ? 'Organizador' : 'Segurança'}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${user.ativo === 1 ? 'status-active' : 'status-inactive'}`}>
                    {user.ativo === 1 ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td>{new Date(user.created_at).toLocaleDateString('pt-BR')}</td>
                <td className="actions">
                  <button onClick={() => toggleStatus(user.id, user.ativo)} className="btn-toggle">
                    {user.ativo === 1 ? <XCircle size={16} /> : <CheckCircle size={16} />}
                    {user.ativo === 1 ? 'Desativar' : 'Ativar'}
                  </button>
                  {user.role !== 'admin' && (
                    <button onClick={() => deletarUsuario(user.id, user.email)} className="btn-delete">
                      <Trash2 size={16} /> Remover
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsersPage;