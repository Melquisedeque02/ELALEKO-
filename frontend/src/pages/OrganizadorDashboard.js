import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../services/api';
import { Calendar, MapPin, Edit2, Trash2, Plus, Users, Clock, AlertCircle, CalendarDays } from 'lucide-react';
import ManualConvidado from '../components/ManualConvidado/ManualConvidado';
import DeclaracaoNoivos from '../components/DeclaracaoNoivos/DeclaracaoNoivos';
import './OrganizadorDashboard.css';

const OrganizadorDashboard = () => {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showTipoModal, setShowTipoModal] = useState(false);
  const [novoTipoNome, setNovoTipoNome] = useState('');
  const [editando, setEditando] = useState(null);
  
  // ========== CRÉDITOS (COMENTADO - REATIVAR NO FUTURO) ==========
  // const [creditos, setCreditos] = useState(0);
  // ================================================================
  
  const [limites, setLimites] = useState({ eventos: 0, eventosUsados: 0, convidadosPorEvento: 0 });
  const [tipos, setTipos] = useState([]);
  const [tipoEvento, setTipoEvento] = useState('casamento');
  const [templatePadrao, setTemplatePadrao] = useState('classico');
  const [manualData, setManualData] = useState({
    dressCode: '',
    whatsapp: '',
    criancas: 'sim',
    estacionamento: '',
    alergias: '',
    observacoes: ''
  });
  const [declaracaoData, setDeclaracaoData] = useState({
    titulo: '',
    mensagem: '',
    frase: '',
    citacao: ''
  });
  const [paisData, setPaisData] = useState({
    pai_noivo: '',
    mae_noivo: '',
    pai_noiva: '',
    mae_noiva: ''
  });
  const [formData, setFormData] = useState({
    nome_evento: '',
    data_evento: '',
    hora_evento: '',
    endereco: ''
  });
  const [erroLimite, setErroLimite] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    carregarEventos();
    // carregarCreditos(); // COMENTADO - REATIVAR NO FUTURO
    carregarLimites();
    carregarTipos();
  }, []);

  const carregarEventos = async () => {
    try {
      const data = await ApiService.listarEventos();
      setEventos(data);
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
    } finally {
      setLoading(false);
    }
  };

  // ========== CRÉDITOS (COMENTADO - REATIVAR NO FUTURO) ==========
  // const carregarCreditos = async () => {
  //   try {
  //     const data = await ApiService.getSaldoCreditos();
  //     setCreditos(data.creditos);
  //   } catch (error) {
  //     console.error('Erro ao carregar saldo:', error);
  //   }
  // };
  // ================================================================

  const carregarLimites = async () => {
    try {
      const data = await ApiService.getLimitesOrganizador();
      setLimites(data);
    } catch (error) {
      console.error('Erro ao carregar limites:', error);
    }
  };

  const carregarTipos = async () => {
    try {
      const data = await ApiService.listarTiposEvento();
      setTipos(data);
    } catch (error) {
      console.error('Erro ao carregar tipos:', error);
    }
  };

  const resetForm = () => {
    setTipoEvento('casamento');
    setTemplatePadrao('classico');
    setManualData({
      dressCode: '', whatsapp: '', criancas: 'sim', estacionamento: '', alergias: '', observacoes: ''
    });
    setDeclaracaoData({
      titulo: '', mensagem: '', frase: '', citacao: ''
    });
    setPaisData({
      pai_noivo: '', mae_noivo: '', pai_noiva: '', mae_noiva: ''
    });
    setFormData({
      nome_evento: '', data_evento: '', hora_evento: '', endereco: ''
    });
    setErroLimite('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErroLimite('');
    try {
      const eventoData = {
        ...formData,
        tipo_evento: tipoEvento,
        template_padrao: templatePadrao,
        manual: manualData,
        declaracao: declaracaoData,
        ...paisData
      };
      
      if (editando) {
        await ApiService.atualizarEvento(editando.id, eventoData);
      } else {
        await ApiService.criarEvento(eventoData);
      }
      setShowModal(false);
      setEditando(null);
      resetForm();
      carregarEventos();
      carregarLimites();
    } catch (error) {
      if (error.message?.includes('Limite de eventos')) {
        setErroLimite(error.message);
      } else {
        console.error('Erro ao salvar evento:', error);
      }
    }
  };

  const handleEditar = async (evento) => {
    setEditando(evento);
    setFormData({
      nome_evento: evento.nome_evento || '',
      data_evento: evento.data_evento || '',
      hora_evento: evento.hora_evento || '',
      endereco: evento.endereco || ''
    });
    setTipoEvento(evento.tipo_evento || 'casamento');
    setTemplatePadrao(evento.template_padrao || 'classico');
    
    if (evento.manual) {
      setManualData(evento.manual);
    }
    if (evento.declaracao) {
      setDeclaracaoData(evento.declaracao);
    }
    setPaisData({
      pai_noivo: evento.pai_noivo || '',
      mae_noivo: evento.mae_noivo || '',
      pai_noiva: evento.pai_noiva || '',
      mae_noiva: evento.mae_noiva || ''
    });
    setShowModal(true);
  };

  const handleDeletar = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar este evento?')) {
      try {
        await ApiService.deletarEvento(id);
        carregarEventos();
        carregarLimites();
      } catch (error) {
        console.error('Erro ao deletar evento:', error);
      }
    }
  };

  const handleVerConvites = (eventoId, eventoNome) => {
    navigate(`/organizador/evento/${eventoId}/convites`, { state: { eventoNome } });
  };

  const handleCriarTipo = async () => {
    if (!novoTipoNome.trim()) return;
    try {
      await ApiService.criarTipoEvento(novoTipoNome);
      await carregarTipos();
      setShowTipoModal(false);
      setNovoTipoNome('');
    } catch (error) {
      alert('Erro ao criar tipo de evento');
    }
  };

  if (loading) return <div className="loading-container"><div className="loading-spinner"></div></div>;

  return (
    <div className="dashboard-organizador">
      <div className="dashboard-header">
        <h1>Meus Eventos</h1>
        <button className="btn-criar" onClick={() => { setEditando(null); resetForm(); setShowModal(true); }}>
          <Plus size={18} /> Criar Evento
        </button>
      </div>

      <div className="limites-info">
        <div className="limite-card">
          <span className="limite-icon"><CalendarDays size={32} /></span>
          <div>
            <span className="limite-label">Eventos</span>
            <span className="limite-valor">{limites.eventosUsados} / {limites.eventos}</span>
          </div>
        </div>
        <div className="limite-card">
          <span className="limite-icon"><Users size={32} /></span>
          <div>
            <span className="limite-label">Convidados por evento</span>
            <span className="limite-valor">até {limites.convidadosPorEvento}</span>
          </div>
        </div>
      </div>

      {/* ========== SEÇÃO DE CRÉDITOS E IA (COMENTADA - REATIVAR NO FUTURO) ========== */}
      {/*
      <div className="saldo-section">
        <div className="saldo-card">
          <span className="saldo-icon">💰</span>
          <div>
            <span className="saldo-label">Créditos disponíveis</span>
            <span className="saldo-valor">{creditos}</span>
          </div>
          <button onClick={() => navigate('/comprar-creditos')} className="btn-comprar-creditos">
            + Comprar créditos
          </button>
        </div>
        <button onClick={() => navigate('/criar-template-ia')} className="btn-ia">
          ✨ Criar template com IA
        </button>
      </div>
      */}
      {/* ======================================================================= */}

      {eventos.length === 0 ? (
        <div className="empty-state">
          <p>Nenhum evento criado ainda.</p>
          <button className="btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>Criar seu primeiro evento</button>
        </div>
      ) : (
        <div className="eventos-grid">
          {eventos.map(evento => (
            <div key={evento.id} className="evento-card">
              <div className="evento-card-header">
                <h3>{evento.nome_evento}</h3>
                <div className="evento-actions">
                  <button onClick={() => handleEditar(evento)}><Edit2 size={16} /></button>
                  <button onClick={() => handleDeletar(evento.id)}><Trash2 size={16} /></button>
                </div>
              </div>
              <div className="evento-card-body">
                {evento.data_evento && <p><Calendar size={14} /> {new Date(evento.data_evento).toLocaleDateString('pt-BR')}</p>}
                {evento.hora_evento && <p><Clock size={14} /> {evento.hora_evento}</p>}
                {evento.endereco && <p><MapPin size={14} /> {evento.endereco}</p>}
              </div>
              <div className="evento-card-footer">
                <button className="btn-convites" onClick={() => handleVerConvites(evento.id, evento.nome_evento)}>
                  <Users size={16} /> Ver Convites
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal principal de criar/editar evento */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>{editando ? 'Editar Evento' : 'Novo Evento'}</h2>
            {erroLimite && (
              <div className="error-limite">
                <AlertCircle size={18} />
                <span>{erroLimite}</span>
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nome do Evento</label>
                <input type="text" value={formData.nome_evento} onChange={e => setFormData({...formData, nome_evento: e.target.value})} required />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Data</label>
                  <input type="date" value={formData.data_evento} onChange={e => setFormData({...formData, data_evento: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Hora</label>
                  <input type="time" value={formData.hora_evento} onChange={e => setFormData({...formData, hora_evento: e.target.value})} />
                </div>
              </div>

              <div className="form-group">
                <label>Endereço</label>
                <input type="text" value={formData.endereco} onChange={e => setFormData({...formData, endereco: e.target.value})} placeholder="Ex: Salão de Festas, Rua X, nº 123" />
              </div>

              {/* Tipo de Evento com botão + */}
              <div className="form-row">
                <div className="form-group">
                  <label>Tipo de Evento</label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <select
                      value={tipoEvento}
                      onChange={e => setTipoEvento(e.target.value)}
                      style={{ flex: 1 }}
                    >
                      <option value="casamento">Casamento</option>
                      {tipos.map(tipo => (
                        <option key={tipo.id} value={tipo.nome}>{tipo.nome}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setShowTipoModal(true)}
                      className="btn-icon"
                      title="Novo tipo de evento"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label>Template Padrão</label>
                  <select value={templatePadrao} onChange={e => setTemplatePadrao(e.target.value)}>
                    <option value="classico">Clássico</option>
                    <option value="moderno">Moderno</option>
                    <option value="romantico">Romântico</option>
                    <option value="natureza">Natureza</option>
                    <option value="religioso">Religioso</option>
                  </select>
                </div>
              </div>

              {/* Campos específicos de Casamento (APENAS pais + declaração) */}
              {tipoEvento === 'casamento' && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Pai do Noivo</label>
                      <input type="text" value={paisData.pai_noivo} onChange={e => setPaisData({...paisData, pai_noivo: e.target.value})} placeholder="Ex: João Silva" />
                    </div>
                    <div className="form-group">
                      <label>Mãe do Noivo</label>
                      <input type="text" value={paisData.mae_noivo} onChange={e => setPaisData({...paisData, mae_noivo: e.target.value})} placeholder="Ex: Maria Silva" />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Pai da Noiva</label>
                      <input type="text" value={paisData.pai_noiva} onChange={e => setPaisData({...paisData, pai_noiva: e.target.value})} placeholder="Ex: José Santos" />
                    </div>
                    <div className="form-group">
                      <label>Mãe da Noiva</label>
                      <input type="text" value={paisData.mae_noiva} onChange={e => setPaisData({...paisData, mae_noiva: e.target.value})} placeholder="Ex: Ana Santos" />
                    </div>
                  </div>
                  <DeclaracaoNoivos declaracao={declaracaoData} onDeclaracaoChange={setDeclaracaoData} />
                </>
              )}

              {/* Manual do Bom Convidado – aparece para TODOS os tipos de evento */}
              <ManualConvidado manual={manualData} onManualChange={setManualData} />

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn-save">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para criar novo tipo de evento */}
      {showTipoModal && (
        <div className="modal-overlay" onClick={() => setShowTipoModal(false)}>
          <div className="modal-content small" onClick={e => e.stopPropagation()}>
            <h3>Novo Tipo de Evento</h3>
            <input
              type="text"
              value={novoTipoNome}
              onChange={e => setNovoTipoNome(e.target.value)}
              placeholder="Ex: Aniversário, Batizado, Corporativo..."
              autoFocus
            />
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowTipoModal(false)}>Cancelar</button>
              <button className="btn-save" onClick={handleCriarTipo}>Criar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizadorDashboard;