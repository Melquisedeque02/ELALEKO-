import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../services/api';
import './RegistroPage.css';

const RegistroPage = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
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
    try {
      await ApiService.registrarOrganizador(nome, email, senha);
      setSucesso(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      setErro(error.message || 'Erro ao registar');
    }
  };

  return (
    <div className="registro-page">
      <div className="registro-card">
        <h1>Criar Conta (Organizador)</h1>
        {sucesso && <div className="alert-success">Conta criada! Redirecionando para login...</div>}
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
          <button type="submit" className="btn btn-primary">Registar</button>
        </form>
        <p>Já tem conta? <a href="/login">Faça login</a></p>
      </div>
    </div>
  );
};

export default RegistroPage;