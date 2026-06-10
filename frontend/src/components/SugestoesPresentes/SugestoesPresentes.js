import React, { useState, useEffect } from 'react';
import './SugestoesPresentes.css';

const SugestoesPresentes = ({ presentes, onPresentesChange, isViewMode = false }) => {
  const [presentesList, setPresentesList] = useState([]);
  const [novoPresente, setNovoPresente] = useState({ nome: '', link: '', imagem: '', comprado: false });

  // Sincronizar com a prop 'presentes' quando ela mudar
  useEffect(() => {
    if (presentes && presentes.length > 0) {
      setPresentesList(presentes);
    } else if (!isViewMode) {
      setPresentesList([]);
    }
  }, [presentes, isViewMode]);

  const adicionarPresente = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (novoPresente.nome.trim()) {
      const novoId = Date.now();
      const novosPresentes = [...presentesList, { ...novoPresente, id: novoId, comprado: false }];
      setPresentesList(novosPresentes);
      if (onPresentesChange) onPresentesChange(novosPresentes);
      setNovoPresente({ nome: '', link: '', imagem: '', comprado: false });
    }
  };

  const removerPresente = (id) => {
    const novosPresentes = presentesList.filter(p => p.id !== id);
    setPresentesList(novosPresentes);
    if (onPresentesChange) onPresentesChange(novosPresentes);
  };

  const marcarComprado = (id) => {
    const novosPresentes = presentesList.map(p =>
      p.id === id ? { ...p, comprado: !p.comprado } : p
    );
    setPresentesList(novosPresentes);
    if (onPresentesChange) onPresentesChange(novosPresentes);
  };

  const editarPresente = (id, campo, valor) => {
    const novosPresentes = presentesList.map(p =>
      p.id === id ? { ...p, [campo]: valor } : p
    );
    setPresentesList(novosPresentes);
    if (onPresentesChange) onPresentesChange(novosPresentes);
  };

  const handleInputChange = (e) => {
    setNovoPresente({ ...novoPresente, [e.target.name]: e.target.value });
  };

  // Modo de visualização - USAR A PROP 'presentes' DIRETAMENTE
  if (isViewMode && presentes && presentes.length > 0) {
    return (
      <div className="presentes-view">
        <h3>Sugestões de Presentes</h3>
        <div className="presentes-grid">
          {presentes.map(presente => (
            <div key={presente.id} className={`presente-card ${presente.comprado ? 'comprado' : ''}`}>
              <div className="presente-imagem">
                {presente.imagem ? (
                  <img src={presente.imagem} alt={presente.nome} />
                ) : (
                  <div className="imagem-placeholder">🎁</div>
                )}
              </div>
              <div className="presente-info">
                <h4>{presente.nome}</h4>
                {presente.link && (
                  <a href={presente.link} target="_blank" rel="noopener noreferrer" className="presente-link">
                    Ver presente
                  </a>
                )}
                {presente.comprado && (
                  <span className="comprado-badge">Já comprado</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Modo de edição
  return (
    <div className="presentes-editor">
      <div className="presentes-header">
        <h3>Sugestões de Presentes</h3>
        <p>Adicione uma lista de presentes sugeridos para os convidados</p>
      </div>

      <div className="presentes-list">
        {presentesList.length === 0 ? (
          <p className="empty-list">Nenhum presente adicionado. Clique em "Adicionar" para começar.</p>
        ) : (
          presentesList.map(presente => (
            <div key={presente.id} className="presente-item">
              <div className="presente-inputs">
                <input
                  type="text"
                  value={presente.nome}
                  onChange={(e) => editarPresente(presente.id, 'nome', e.target.value)}
                  placeholder="Nome do presente"
                  className="presente-nome-input"
                />
                <input
                  type="text"
                  value={presente.link || ''}
                  onChange={(e) => editarPresente(presente.id, 'link', e.target.value)}
                  placeholder="Link da loja (opcional)"
                  className="presente-link-input"
                />
                <input
                  type="text"
                  value={presente.imagem || ''}
                  onChange={(e) => editarPresente(presente.id, 'imagem', e.target.value)}
                  placeholder="URL da imagem (opcional)"
                  className="presente-imagem-input"
                />
              </div>
              <div className="presente-acoes">
                <button
                  onClick={() => marcarComprado(presente.id)}
                  className={`btn-comprado ${presente.comprado ? 'ativo' : ''}`}
                  type="button"
                >
                  {presente.comprado ? '✓ Comprado' : 'Marcar comprado'}
                </button>
                <button
                  onClick={() => removerPresente(presente.id)}
                  className="btn-remove-presente"
                  type="button"
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="add-presente">
        <h4>Adicionar novo presente</h4>
        <div className="add-presente-inputs">
          <input
            type="text"
            name="nome"
            value={novoPresente.nome}
            onChange={handleInputChange}
            placeholder="Nome do presente"
            className="add-nome"
          />
          <input
            type="text"
            name="link"
            value={novoPresente.link}
            onChange={handleInputChange}
            placeholder="Link da loja (opcional)"
            className="add-link"
          />
          <input
            type="text"
            name="imagem"
            value={novoPresente.imagem}
            onChange={handleInputChange}
            placeholder="URL da imagem (opcional)"
            className="add-imagem"
          />
          <button onClick={adicionarPresente} className="btn-add-presente" type="button">
            + Adicionar
          </button>
        </div>
      </div>

      <div className="presentes-tip">
        <span className="tip-icon">💡</span>
        <span>Adicione sugestões de presentes com links para lojas online</span>
      </div>
    </div>
  );
};

export default SugestoesPresentes;