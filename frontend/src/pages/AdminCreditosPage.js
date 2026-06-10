import React, { useState, useEffect } from 'react';
import ApiService from '../services/api';
import { Edit2, Save, X, RefreshCw, Eye, Filter, Settings, Plus, Minus } from 'lucide-react';
import './AdminCreditosPage.css';

const AdminCreditosPage = () => {
  const [organizadores, setOrganizadores] = useState([]);
  const [transacoes, setTransacoes] = useState([]);
  const [templatesIA, setTemplatesIA] = useState([]);
  const [configuracoes, setConfiguracoes] = useState({ ia_ativa: true, precos_pacotes: [] });
  const [logsIA, setLogsIA] = useState([]);
  const [tabAtiva, setTabAtiva] = useState('organizadores');
  const [editandoCredito, setEditandoCredito] = useState(null);
  const [novoCredito, setNovoCredito] = useState('');
  const [editandoLimites, setEditandoLimites] = useState(null);
  const [limitesForm, setLimitesForm] = useState({ limite_eventos: '', limite_convidados_por_evento: '' });
  const [editandoPrecos, setEditandoPrecos] = useState(false);
  const [precosPacotes, setPrecosPacotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroUserId, setFiltroUserId] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setLoading(true);
    try {
      const [orgs, trans, temps, configs, logs] = await Promise.all([
        ApiService.listarOrganizadoresCreditos(),
        ApiService.listarTransacoesAdmin(),
        ApiService.listarTemplatesIAAdmin(),
        ApiService.getConfiguracoes(),
        ApiService.listarLogsIA()
      ]);
      setOrganizadores(orgs);
      setTransacoes(trans);
      setTemplatesIA(temps);
      setConfiguracoes({ ...configs, precos_pacotes: JSON.parse(configs.precos_pacotes || '[]') });
      setPrecosPacotes(JSON.parse(configs.precos_pacotes || '[]'));
      setLogsIA(logs);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditarCreditos = async (userId, creditos) => {
    try {
      await ApiService.editarCreditosAdmin(userId, creditos);
      carregarDados();
      setEditandoCredito(null);
    } catch (error) {
      alert('Erro ao editar créditos');
    }
  };

  const handleEditarLimites = (org) => {
    setEditandoLimites(org.id);
    setLimitesForm({
      limite_eventos: org.limite_eventos || 5,
      limite_convidados_por_evento: org.limite_convidados_por_evento || 200
    });
  };

  const handleSalvarLimites = async () => {
    try {
      await ApiService.atualizarLimitesAdmin(editandoLimites, limitesForm);
      setEditandoLimites(null);
      carregarDados();
    } catch (error) {
      alert('Erro ao atualizar limites');
    }
  };

  const handleAtivarIA = async (ativa) => {
    try {
      await ApiService.atualizarConfiguracoes({ ia_ativa: ativa, precos_pacotes: configuracoes.precos_pacotes });
      setConfiguracoes({ ...configuracoes, ia_ativa: ativa });
    } catch (error) {
      alert('Erro ao atualizar configuração');
    }
  };

  const handleSalvarPrecos = async () => {
    try {
      await ApiService.atualizarConfiguracoes({ ia_ativa: configuracoes.ia_ativa, precos_pacotes: precosPacotes });
      setConfiguracoes({ ...configuracoes, precos_pacotes: precosPacotes });
      setEditandoPrecos(false);
      carregarDados();
    } catch (error) {
      alert('Erro ao salvar preços');
    }
  };

  const handleAdicionarPacote = () => {
    setPrecosPacotes([...precosPacotes, { creditos: 1, preco: 1.99 }]);
  };

  const handleRemoverPacote = (index) => {
    const novos = [...precosPacotes];
    novos.splice(index, 1);
    setPrecosPacotes(novos);
  };

  const handleAtualizarPacote = (index, campo, valor) => {
    const novos = [...precosPacotes];
    novos[index][campo] = parseFloat(valor);
    setPrecosPacotes(novos);
  };

  const filtrarTransacoes = () => {
    let filtradas = [...transacoes];
    if (filtroUserId) filtradas = filtradas.filter(t => t.user_id == filtroUserId);
    if (filtroTipo) filtradas = filtradas.filter(t => t.tipo === filtroTipo);
    return filtradas;
  };

  if (loading) return <div className="loading-spinner"></div>;

  return (
    <div className="admin-creditos-page">
      <div className="admin-header">
        <h1>💰 Gestão de Créditos e IA</h1>
        <button onClick={carregarDados} className="btn-refresh"><RefreshCw size={16} /> Actualizar</button>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button className={tabAtiva === 'organizadores' ? 'active' : ''} onClick={() => setTabAtiva('organizadores')}>Organizadores</button>
        <button className={tabAtiva === 'transacoes' ? 'active' : ''} onClick={() => setTabAtiva('transacoes')}>Transacções</button>
        <button className={tabAtiva === 'templates' ? 'active' : ''} onClick={() => setTabAtiva('templates')}>Templates IA</button>
        <button className={tabAtiva === 'configuracoes' ? 'active' : ''} onClick={() => setTabAtiva('configuracoes')}>Configurações</button>
        <button className={tabAtiva === 'logs' ? 'active' : ''} onClick={() => setTabAtiva('logs')}>Logs de Erro</button>
      </div>

      {/* TAB 1: Organizadores */}
      {tabAtiva === 'organizadores' && (
        <div className="organizadores-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Créditos</th>
                <th>Limite Eventos</th>
                <th>Limite Convidados/Evento</th>
                <th>Criado em</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {organizadores.map(org => (
                <tr key={org.id}>
                  <td>{org.id}</td>
                  <td>{org.nome}</td>
                  <td>{org.email}</td>
                  <td>
                    {editandoCredito === org.id ? (
                      <input type="number" value={novoCredito} onChange={e => setNovoCredito(e.target.value)} className="edit-input" />
                    ) : (
                      <span className="credito-valor">{org.creditos}</span>
                    )}
                  </td>
                  <td>{org.limite_eventos || 5}</td>
                  <td>{org.limite_convidados_por_evento || 100}</td>
                  <td>{new Date(org.created_at).toLocaleDateString('pt-BR')}</td>
                  <td className="actions">
                    {editandoCredito === org.id ? (
                      <>
                        <button onClick={() => handleEditarCreditos(org.id, novoCredito)} className="btn-save"><Save size={16} /></button>
                        <button onClick={() => setEditandoCredito(null)} className="btn-cancel"><X size={16} /></button>
                      </>
                    ) : (
                      <button onClick={() => { setEditandoCredito(org.id); setNovoCredito(org.creditos); }} className="btn-edit"><Edit2 size={16} /> Editar</button>
                    )}
                    <button onClick={() => handleEditarLimites(org)} className="btn-limites"><Settings size={16} /> Limites</button>
                  </td>
                </tr>
              ))}
            </tbody>
           </table>
        </div>
      )}

      {/* TAB 2: Transações */}
      {tabAtiva === 'transacoes' && (
        <div>
          <div className="filtros">
            <select value={filtroUserId} onChange={e => setFiltroUserId(e.target.value)}>
              <option value="">Todos os utilizadores</option>
              {organizadores.map(org => <option key={org.id} value={org.id}>{org.nome}</option>)}
            </select>
            <select value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)}>
              <option value="">Todos os tipos</option>
              <option value="simulacao_compra">Compra de créditos</option>
              <option value="uso_ia">Uso de IA</option>
              <option value="ajuste_manual">Ajuste manual</option>
            </select>
          </div>
          <table className="transacoes-table">
            <thead>
              <tr><th>Utilizador</th><th>Tipo</th><th>Quantidade</th><th>Valor</th><th>Descrição</th><th>Data</th></tr>
            </thead>
            <tbody>
              {filtrarTransacoes().map(trans => (
                <tr key={trans.id}>
                  <td>{trans.usuario_nome}</td>
                  <td><span className={`tipo-badge tipo-${trans.tipo}`}>{trans.tipo === 'simulacao_compra' ? 'Compra' : trans.tipo === 'uso_ia' ? 'IA' : 'Ajuste'}</span></td>
                  <td>{trans.quantidade}</td>
                  <td>{trans.valor ? `$${trans.valor}` : '-'}</td>
                  <td>{trans.descricao}</td>
                  <td>{new Date(trans.created_at).toLocaleString('pt-BR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: Templates IA */}
      {tabAtiva === 'templates' && (
        <div className="templates-grid">
          {templatesIA.map(template => (
            <div key={template.id} className="template-card">
              <div className="template-header">
                <span className="template-user">{template.usuario_nome}</span>
                <span className="template-date">{new Date(template.created_at).toLocaleDateString('pt-BR')}</span>
              </div>
              <div className="template-preview" dangerouslySetInnerHTML={{ __html: template.html_css }} />
              <div className="template-footer">
                <p><strong>Descrição:</strong> {template.descricao}</p>
                <p><strong>Créditos:</strong> {template.creditos_gastos}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: Configurações (COM EDIÇÃO DE PREÇOS) */}
      {tabAtiva === 'configuracoes' && (
        <div className="configuracoes-panel">
          <div className="config-item">
            <label>IA Ativa</label>
            <div className="toggle-switch">
              <button className={configuracoes.ia_ativa ? 'active' : ''} onClick={() => handleAtivarIA(true)}>Sim</button>
              <button className={!configuracoes.ia_ativa ? 'active' : ''} onClick={() => handleAtivarIA(false)}>Não</button>
            </div>
            <small className="config-hint">Se desativada, os organizadores não poderão gerar novos templates com IA.</small>
          </div>
          
          <div className="config-item">
            <label>Preços dos Pacotes (USD)</label>
            {!editandoPrecos ? (
              <div>
                <div className="pacotes-list">
                  {configuracoes.precos_pacotes.map((pacote, idx) => (
                    <div key={idx} className="pacote-item">
                      {pacote.creditos} crédito(s) = ${pacote.preco} (${(pacote.preco / pacote.creditos).toFixed(2)}/crédito)
                    </div>
                  ))}
                </div>
                <button onClick={() => setEditandoPrecos(true)} className="btn-edit-precos">
                  <Edit2 size={16} /> Editar Preços
                </button>
              </div>
            ) : (
              <div>
                {precosPacotes.map((pacote, idx) => (
                  <div key={idx} className="pacote-edit-item">
                    <input 
                      type="number" 
                      value={pacote.creditos} 
                      onChange={e => handleAtualizarPacote(idx, 'creditos', e.target.value)}
                      min="1"
                      className="pacote-input-creditos"
                    />
                    <span> crédito(s) = $</span>
                    <input 
                      type="number" 
                      value={pacote.preco} 
                      onChange={e => handleAtualizarPacote(idx, 'preco', e.target.value)}
                      step="0.01"
                      min="0.01"
                      className="pacote-input-preco"
                    />
                    <button onClick={() => handleRemoverPacote(idx)} className="btn-remove-pacote"><Minus size={14} /></button>
                  </div>
                ))}
                <button onClick={handleAdicionarPacote} className="btn-add-pacote">
                  <Plus size={14} /> Adicionar Pacote
                </button>
                <div className="edit-actions">
                  <button onClick={handleSalvarPrecos} className="btn-save">Salvar</button>
                  <button onClick={() => setEditandoPrecos(false)} className="btn-cancel">Cancelar</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: Logs de Erro IA */}
      {tabAtiva === 'logs' && (
        <div className="logs-table">
          <table>
            <thead>
              <tr><th>Utilizador</th><th>Descrição</th><th>Erro</th><th>Data</th></tr>
            </thead>
            <tbody>
              {logsIA.map(log => (
                <tr key={log.id}>
                  <td>{log.usuario_nome || 'N/A'}</td>
                  <td>{log.descricao}</td>
                  <td className="error-cell">{log.erro}</td>
                  <td>{new Date(log.created_at).toLocaleString('pt-BR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de Edição de Limites */}
      {editandoLimites && (
        <div className="modal-overlay" onClick={() => setEditandoLimites(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Editar Limites do Organizador</h2>
            <div className="form-group">
              <label>Limite de Eventos</label>
              <input 
                type="number" 
                value={limitesForm.limite_eventos} 
                onChange={e => setLimitesForm({...limitesForm, limite_eventos: parseInt(e.target.value) || 0})}
                min="1"
              />
            </div>
            <div className="form-group">
              <label>Limite de Convidados por Evento</label>
              <input 
                type="number" 
                value={limitesForm.limite_convidados_por_evento} 
                onChange={e => setLimitesForm({...limitesForm, limite_convidados_por_evento: parseInt(e.target.value) || 0})}
                min="1"
              />
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setEditandoLimites(null)}>Cancelar</button>
              <button className="btn-save" onClick={handleSalvarLimites}>Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCreditosPage;