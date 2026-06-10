import React, { useState } from 'react';
import './Cronograma.css';

const Cronograma = ({ eventos, onEventosChange, isViewMode = false }) => {
  const [eventosList, setEventosList] = useState(eventos || []);
  const [novoEvento, setNovoEvento] = useState({ hora: '', titulo: '', descricao: '' });

  const adicionarEvento = (e) => {
    e.preventDefault(); // ← IMPEDE O ENVIO DO FORMULÁRIO
    e.stopPropagation(); // ← IMPEDE PROPAGAÇÃO
    
    if (novoEvento.hora && novoEvento.titulo) {
      const novoId = Date.now();
      const novosEventos = [...eventosList, { ...novoEvento, id: novoId }];
      setEventosList(novosEventos);
      if (onEventosChange) onEventosChange(novosEventos);
      setNovoEvento({ hora: '', titulo: '', descricao: '' });
    }
  };

  const removerEvento = (id) => {
    const novosEventos = eventosList.filter(evento => evento.id !== id);
    setEventosList(novosEventos);
    if (onEventosChange) onEventosChange(novosEventos);
  };

  const editarEvento = (id, campo, valor) => {
    const novosEventos = eventosList.map(evento =>
      evento.id === id ? { ...evento, [campo]: valor } : evento
    );
    setEventosList(novosEventos);
    if (onEventosChange) onEventosChange(novosEventos);
  };

  const handleInputChange = (e) => {
    setNovoEvento({ ...novoEvento, [e.target.name]: e.target.value });
  };

  // Modo de visualização
  if (isViewMode) {
    return (
      <div className="cronograma-view">
        <h3> Cronograma do Dia</h3>
        <div className="timeline">
          {eventosList.length === 0 ? (
            <p className="empty-cronograma">Nenhum horário definido</p>
          ) : (
            eventosList.map((evento, index) => (
              <div key={evento.id || index} className="timeline-item">
                <div className="timeline-time">
                  <span className="time-badge">{evento.hora}</span>
                </div>
                <div className="timeline-content">
                  <div className="timeline-dot"></div>
                  <h4 className="timeline-title">{evento.titulo}</h4>
                  {evento.descricao && <p className="timeline-desc">{evento.descricao}</p>}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // Modo de edição
  return (
    <div className="cronograma-editor">
      <div className="cronograma-header">
        <h3> Cronograma do Dia</h3>
        <p>Organize a sequência de eventos do seu grande dia</p>
      </div>

      <div className="eventos-list">
        {eventosList.length === 0 ? (
          <p className="empty-list">Nenhum horário adicionado. Clique em "Adicionar" para começar.</p>
        ) : (
          eventosList.map(evento => (
            <div key={evento.id} className="evento-item">
              <div className="evento-inputs">
                <input
                  type="time"
                  value={evento.hora}
                  onChange={(e) => editarEvento(evento.id, 'hora', e.target.value)}
                  className="evento-hora-input"
                />
                <input
                  type="text"
                  value={evento.titulo}
                  onChange={(e) => editarEvento(evento.id, 'titulo', e.target.value)}
                  placeholder="Título do evento"
                  className="evento-titulo-input"
                />
                <input
                  type="text"
                  value={evento.descricao || ''}
                  onChange={(e) => editarEvento(evento.id, 'descricao', e.target.value)}
                  placeholder="Descrição (opcional)"
                  className="evento-desc-input"
                />
              </div>
              <button
                onClick={() => removerEvento(evento.id)}
                className="btn-remove-evento"
                type="button"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>

      <div className="add-evento">
        <h4>Adicionar novo horário</h4>
        <div className="add-evento-inputs">
          <input
            type="time"
            name="hora"
            value={novoEvento.hora}
            onChange={handleInputChange}
            placeholder="Hora"
            className="add-hora"
          />
          <input
            type="text"
            name="titulo"
            value={novoEvento.titulo}
            onChange={handleInputChange}
            placeholder="Título do evento"
            className="add-titulo"
          />
          <input
            type="text"
            name="descricao"
            value={novoEvento.descricao}
            onChange={handleInputChange}
            placeholder="Descrição (opcional)"
            className="add-desc"
          />
          <button onClick={adicionarEvento} className="btn-add-evento" type="button">
            + Adicionar
          </button>
        </div>
      </div>

      <div className="cronograma-tip">
        <span className="tip-icon"></span>
        <span>Adicione os horários principais: cerimônia, coquetel, jantar, festa, etc.</span>
      </div>
    </div>
  );
};

export default Cronograma;