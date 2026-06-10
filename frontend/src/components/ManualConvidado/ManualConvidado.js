import React, { useState } from 'react';
import './ManualConvidado.css';

const ManualConvidado = ({ manual, onManualChange, isViewMode = false }) => {
  const [manualData, setManualData] = useState(manual || {
    dressCode: '',
    whatsapp: '',
    criancas: 'sim',
    estacionamento: '',
    alergias: '',
    observacoes: ''
  });

  const handleChange = (campo, valor) => {
    const novoManual = { ...manualData, [campo]: valor };
    setManualData(novoManual);
    if (onManualChange) onManualChange(novoManual);
  };

  // Modo de visualização (para convidados)
  if (isViewMode && manualData) {
    return (
      <div className="manual-convidado-view">
        <h3> Manual do Bom Convidado</h3>
        
        <div className="manual-sections">
          {manualData.dressCode && (
            <div className="manual-section">
              <div className="section-icon"></div>
              <div className="section-content">
                <h4>Código de Vestimenta</h4>
                <p>{manualData.dressCode}</p>
              </div>
            </div>
          )}

          {manualData.whatsapp && (
            <div className="manual-section">
              <div className="section-icon"></div>
              <div className="section-content">
                <h4>Contato para Dúvidas</h4>
                <p>WhatsApp: <a href={`https://wa.me/${manualData.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">{manualData.whatsapp}</a></p>
              </div>
            </div>
          )}

          <div className="manual-section">
            <div className="section-icon"></div>
            <div className="section-content">
              <h4>Crianças</h4>
              <p>{manualData.criancas === 'sim' ? 'Crianças são bem-vindas! ' : 'Agradecemos que não tragam crianças ao evento. '}</p>
            </div>
          </div>

          {manualData.estacionamento && (
            <div className="manual-section">
              <div className="section-icon"></div>
              <div className="section-content">
                <h4>Estacionamento</h4>
                <p>{manualData.estacionamento}</p>
              </div>
            </div>
          )}

          {manualData.alergias && (
            <div className="manual-section">
              <div className="section-icon"></div>
              <div className="section-content">
                <h4>Restrições Alimentares</h4>
                <p>{manualData.alergias}</p>
              </div>
            </div>
          )}

          {manualData.observacoes && (
            <div className="manual-section">
              <div className="section-icon"></div>
              <div className="section-content">
                <h4>Observações Importantes</h4>
                <p>{manualData.observacoes}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Modo de edição (para criar/editar convite)
  return (
    <div className="manual-convidado-editor">
      <div className="manual-header">
        <h3> Manual do Bom Convidado</h3>
        <p>Informações importantes para os convidados</p>
      </div>

      <div className="manual-form">
        <div className="form-group">
          <label> Código de Vestimenta</label>
          <input
            type="text"
            value={manualData.dressCode}
            onChange={(e) => handleChange('dressCode', e.target.value)}
            placeholder="Ex: Formal, Traje a rigor, Esporte fino, Casual"
            className="form-input"
          />
          <small>Ex: Traje formal (terno e vestido longo) ou Esporte fino</small>
        </div>

        <div className="form-group">
          <label> WhatsApp para Dúvidas</label>
          <input
            type="tel"
            value={manualData.whatsapp}
            onChange={(e) => handleChange('whatsapp', e.target.value)}
            placeholder="(11) 99999-9999"
            className="form-input"
          />
          <small>Número para contato em caso de dúvidas</small>
        </div>

        <div className="form-group">
          <label> Crianças</label>
          <select
            value={manualData.criancas}
            onChange={(e) => handleChange('criancas', e.target.value)}
            className="form-select"
          >
            <option value="sim">Sim, crianças são bem-vindas</option>
            <option value="nao">Não, apenas adultos</option>
          </select>
        </div>

        <div className="form-group">
          <label> Estacionamento</label>
          <input
            type="text"
            value={manualData.estacionamento}
            onChange={(e) => handleChange('estacionamento', e.target.value)}
            placeholder="Ex: Estacionamento gratuito no local, com manobrista"
            className="form-input"
          />
          <small>Informações sobre estacionamento</small>
        </div>

        <div className="form-group">
          <label> Restrições Alimentares</label>
          <textarea
            value={manualData.alergias}
            onChange={(e) => handleChange('alergias', e.target.value)}
            placeholder="Ex: Opções vegetarianas, veganas, sem glúten, etc."
            rows="2"
            className="form-textarea"
          />
          <small>Informe sobre opções alimentares disponíveis</small>
        </div>

        <div className="form-group">
          <label> Observações Importantes</label>
          <textarea
            value={manualData.observacoes}
            onChange={(e) => handleChange('observacoes', e.target.value)}
            placeholder="Ex: Não é permitido fumar, presente em dinheiro, etc."
            rows="3"
            className="form-textarea"
          />
          <small>Informações adicionais relevantes</small>
        </div>
      </div>
    </div>
  );
};

export default ManualConvidado;