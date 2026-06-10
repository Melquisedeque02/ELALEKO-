import React, { useState } from 'react';
import './DeclaracaoNoivos.css';

const DeclaracaoNoivos = ({ declaracao, onDeclaracaoChange, isViewMode = false }) => {
  const [declaracaoData, setDeclaracaoData] = useState(declaracao || {
    titulo: 'Nossa História',
    mensagem: '',
    frase: '',
    citacao: ''
  });

  const handleChange = (campo, valor) => {
    const novoDeclaracao = { ...declaracaoData, [campo]: valor };
    setDeclaracaoData(novoDeclaracao);
    if (onDeclaracaoChange) onDeclaracaoChange(novoDeclaracao);
  };

  // Modo de visualização
  if (isViewMode && declaracaoData.mensagem) {
    return (
      <div className="declaracao-view">
        <div className="declaracao-divider">
          <span className="divider-icon">✧</span>
        </div>
        <div className="declaracao-content">
          {declaracaoData.titulo && (
            <h3 className="declaracao-titulo">{declaracaoData.titulo}</h3>
          )}
          {declaracaoData.mensagem && (
            <p className="declaracao-mensagem">{declaracaoData.mensagem}</p>
          )}
          {declaracaoData.frase && (
            <p className="declaracao-frase">"{declaracaoData.frase}"</p>
          )}
          {declaracaoData.citacao && (
            <p className="declaracao-citacao">— {declaracaoData.citacao}</p>
          )}
        </div>
      </div>
    );
  }

  // Modo de edição
  return (
    <div className="declaracao-editor">
      <div className="declaracao-header">
        <h3>Declaração dos Noivos</h3>
        <p>Compartilhe uma mensagem especial com seus convidados</p>
      </div>

      <div className="declaracao-form">
        <div className="form-group">
          <label>Título</label>
          <input
            type="text"
            value={declaracaoData.titulo}
            onChange={(e) => handleChange('titulo', e.target.value)}
            placeholder="Ex: Nossa História, Como Tudo Começou"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>Mensagem Personalizada</label>
          <textarea
            value={declaracaoData.mensagem}
            onChange={(e) => handleChange('mensagem', e.target.value)}
            placeholder="Escreva uma mensagem especial para seus convidados..."
            rows="5"
            className="form-textarea"
          />
        </div>

        <div className="form-group">
          <label>Frase Inspiradora (opcional)</label>
          <input
            type="text"
            value={declaracaoData.frase}
            onChange={(e) => handleChange('frase', e.target.value)}
            placeholder="Ex: O amor não sofre, tudo crê, tudo espera..."
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>Citação / Autoria (opcional)</label>
          <input
            type="text"
            value={declaracaoData.citacao}
            onChange={(e) => handleChange('citacao', e.target.value)}
            placeholder="Ex: 1 Coríntios 13:7"
            className="form-input"
          />
        </div>
      </div>
    </div>
  );
};

export default DeclaracaoNoivos;