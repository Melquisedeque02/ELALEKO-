import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../services/api';
import { UserPlus, Shield, UserCog, Users } from 'lucide-react';
import './AdminNovoUsuarioPage.css';

const AdminNovoUsuarioPage = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [role, setRole] = useState('organizador'); // padrão alterado para organizador
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem');
      return;
    }
    if (senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);
    setErro('');

    try {
      await ApiService.criarUsuarioAdmin({
        nome, email, senha, role
      });
      setSucesso(true);
      setTimeout(() => navigate('/admin/usuarios'), 2000);
    } catch (error) {
      setErro(error.message || 'Erro ao criar utilizador');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-novo-usuario">
      <div className="form-container">
        <div className="form-header">
          <UserPlus size={32} />
          <h1>Criar Novo Utilizador</h1>
          <p>Adicione um novo administrador, organizador ou segurança ao sistema</p>
        </div>

        {sucesso && <div className="alert-success">Utilizador criado com sucesso! Redirecionando...</div>}
        {erro && <div className="alert-error">{erro}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome Completo</label>
            <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Senha</label>
            <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Confirmar Senha</label>
            <input type="password" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Função</label>
            <div className="role-options">
              <label className={`role-option ${role === 'admin' ? 'selected' : ''}`}>
                <input type="radio" name="role" value="admin" checked={role === 'admin'} onChange={() => setRole('admin')} />
                <UserCog size={20} />
                <span>Administrador</span>
                <small>Acesso total ao sistema</small>
              </label>
              <label className={`role-option ${role === 'organizador' ? 'selected' : ''}`}>
                <input type="radio" name="role" value="organizador" checked={role === 'organizador'} onChange={() => setRole('organizador')} />
                <Users size={20} />
                <span>Organizador</span>
                <small>Cria eventos e convites</small>
              </label>
              <label className={`role-option ${role === 'seguranca' ? 'selected' : ''}`}>
                <input type="radio" name="role" value="seguranca" checked={role === 'seguranca'} onChange={() => setRole('seguranca')} />
                <Shield size={20} />
                <span>Segurança</span>
                <small>Apenas validação de convites</small>
              </label>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => navigate('/admin/usuarios')}>Cancelar</button>
            <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Criando...' : 'Criar Utilizador'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminNovoUsuarioPage;