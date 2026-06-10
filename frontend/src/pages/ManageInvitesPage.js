import React, { useState, useEffect } from 'react';
import { 
  Users, Calendar, Lock, Search, Eye, CheckCircle, Trash2, RefreshCw,
  BarChart3, Edit2, Save, X, Download, Filter
} from 'lucide-react';
import ApiService from '../services/api';
import QRCodeGenerator from '../components/QRcode/QRCodeGenerator';
import ConviteDetalhes from '../components/ConviteDetalhes/ConviteDetalhes';
import TemplateClassico from '../components/Templates/TemplateClassico';
import TemplateModerno from '../components/Templates/TemplateModerno';
import TemplateRomantico from '../components/Templates/TemplateRomantico';
import TemplateNatureza from '../components/Templates/TemplateNatureza';
import TemplateReligioso from '../components/Templates/TemplateReligioso';
import './ManageInvitesPage.css';

const ManageInvitesPage = () => {
  const [convites, setConvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [conviteSelecionado, setConviteSelecionado] = useState(null);
  const [showDetalhes, setShowDetalhes] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [eventoExpandido, setEventoExpandido] = useState({});
  const [editando, setEditando] = useState(null);        
  //const [editForm, setEditForm] = useState({});          


  useEffect(() => {
    carregarConvites();
  }, []);

  const carregarConvites = async () => {
    try {
      setLoading(true);
      const data = await ApiService.listarConvites();
      setConvites(data);
      setErro('');
    } catch (error) {
      setErro('Erro ao carregar convites');
    } finally {
      setLoading(false);
    }
  };

  // Agrupar convites por nome do evento
  const convitesPorEvento = convites.reduce((acc, convite) => {
    const evento = convite.nome_evento || 'Evento sem nome';
    if (!acc[evento]) acc[evento] = [];
    acc[evento].push(convite);
    return acc;
  }, {});

  const toggleEvento = (evento) => {
    setEventoExpandido(prev => ({ ...prev, [evento]: !prev[evento] }));
  };

  const handleVerDetalhes = async (id) => {
  try {
    console.log('🔍 Buscando detalhes do convite ID:', id);
    const convite = await ApiService.buscarConvitePorId(id);
    console.log('✅ Convite carregado:', convite);
    setConviteSelecionado(convite);
    setShowDetalhes(true);
  } catch (error) {
    console.error('❌ Erro ao buscar detalhes amigo:', error);
    alert(error.message || 'Erro ao carregar detalhes do convite');
  }
};

  const handleFecharDetalhes = () => {
    setShowDetalhes(false);
    setConviteSelecionado(null);
  };

  // Download PDF com o template correto
  const handleDownloadPDF = async (convite) => {
    try {
      const { default: jsPDF } = await import('jspdf');
      const html2canvas = await import('html2canvas');
      
      let manualData = null;
      let declaracaoData = null;
      try { if (convite.manual) manualData = JSON.parse(convite.manual); } catch(e) {}
      try { if (convite.declaracao) declaracaoData = JSON.parse(convite.declaracao); } catch(e) {}
      
      const templateData = {
        nome_convidado1: convite.nome_convidado1,
        nome_convidado2: convite.nome_convidado2,
        nome_evento: convite.nome_evento,
        data_evento: convite.data_evento,
        hora_evento: convite.hora_evento,
        endereco: convite.endereco,
        pai_noivo: convite.pai_noivo,
        mae_noivo: convite.mae_noivo,
        pai_noiva: convite.pai_noiva,
        mae_noiva: convite.mae_noiva
      };
      
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(`${window.location.origin}/convite/${convite.qr_code}`)}&format=png`;
      
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '-9999px';
      tempDiv.style.width = '500px';
      tempDiv.style.height = 'auto';
      tempDiv.style.background = '#ffffff';
      document.body.appendChild(tempDiv);
      
      let TemplateComponent;
      const templateSelecionado = convite.template || 'classico';
      switch(templateSelecionado) {
        case 'moderno': TemplateComponent = TemplateModerno; break;
        case 'romantico': TemplateComponent = TemplateRomantico; break;
        case 'natureza': TemplateComponent = TemplateNatureza; break;
        case 'religioso': TemplateComponent = TemplateReligioso; break;
        default: TemplateComponent = TemplateClassico;
      }
      
      const { createRoot } = await import('react-dom/client');
      const root = createRoot(tempDiv);
      root.render(<TemplateComponent convite={templateData} qrCodeUrl={qrCodeUrl} manualData={manualData} declaracaoData={declaracaoData} />);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const canvas = await html2canvas.default(tempDiv, { scale: 2, backgroundColor: '#ffffff', useCORS: true, windowHeight: tempDiv.scrollHeight, height: tempDiv.scrollHeight });
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [210, imgHeight + 20] });
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save(`convite_${convite.nome_convidado1.replace(/\s+/g, '_')}.pdf`);
      
      root.unmount();
      document.body.removeChild(tempDiv);
    } catch (error) {
      console.error('Erro ao baixar PDF:', error);
      alert('Erro ao gerar PDF');
    }
  };

  // Edição completa (inclui manual, declaracao, pais)
  const handleEditar = (convite) => {
    setEditandoId(convite.id);
    let manualData = {};
    let declaracaoData = {};
    try { if (convite.manual) manualData = JSON.parse(convite.manual); } catch(e) {}
    try { if (convite.declaracao) declaracaoData = JSON.parse(convite.declaracao); } catch(e) {}
    
    setEditForm({
      nome_convidado1: convite.nome_convidado1,
      nome_convidado2: convite.nome_convidado2 || '',
      nome_evento: convite.nome_evento || '',
      data_evento: convite.data_evento || '',
      hora_evento: convite.hora_evento || '',
      endereco: convite.endereco || '',
      pai_noivo: convite.pai_noivo || '',
      mae_noivo: convite.mae_noivo || '',
      pai_noiva: convite.pai_noiva || '',
      mae_noiva: convite.mae_noiva || '',
      manual: manualData,
      declaracao: declaracaoData,
      template: convite.template || 'classico'
    });
  };

  const handleSalvarEdicao = async () => {
    try {
      await ApiService.atualizarConvite(editandoId, {
        nome_convidado1: editForm.nome_convidado1,
        nome_convidado2: editForm.nome_convidado2,
        nome_evento: editForm.nome_evento,
        data_evento: editForm.data_evento,
        hora_evento: editForm.hora_evento,
        endereco: editForm.endereco,
        pai_noivo: editForm.pai_noivo,
        mae_noivo: editForm.mae_noivo,
        pai_noiva: editForm.pai_noiva,
        mae_noiva: editForm.mae_noiva,
        manual: JSON.stringify(editForm.manual),
        declaracao: JSON.stringify(editForm.declaracao),
        template: editForm.template
      });
      setEditandoId(null);
      carregarConvites();
      alert('Convite atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar edição:', error);
      alert('Erro ao salvar alterações');
    }
  };

  const handleCancelarEdicao = () => {
    setEditandoId(null);
    setEditForm({});
  };

  const handleUtilizar = async (qrCode, nome) => {
    if (window.confirm(`Marcar ${nome} como utilizado?`)) {
      try {
        await ApiService.utilizarConvite(qrCode);
        carregarConvites();
      } catch (error) {}
    }
  };

  const handleDeletar = async (id, nome) => {
    if (window.confirm(`Deletar convite de ${nome}?`)) {
      try {
        await ApiService.deletarConvite(id);
        carregarConvites();
      } catch (error) {}
    }
  };

  if (loading) {
    return <div className="loading-container"><div className="loading-spinner"></div><p>Carregando...</p></div>;
  }

  return (
    <div className="manage-page">
      <div className="manage-container">
        <div className="manage-header">
          <h1>Gerenciar Convites</h1>
          <p>Visualize por evento, edite e baixe convites</p>
        </div>

        <div className="search-filters">
          <div className="search-bar">
            <Search size={18} />
            <input type="text" placeholder="Buscar por nome ou código..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="filter-group">
            <select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)} className="filter-select">
              <option value="todos">Todos os status</option>
              <option value="validos">Válidos</option>
              <option value="utilizados">Utilizados</option>
            </select>
          </div>
        </div>

        {Object.keys(convitesPorEvento).map(evento => {
          const convitesFiltrados = convitesPorEvento[evento].filter(c => {
            const matchSearch = c.nome_convidado1.toLowerCase().includes(searchTerm.toLowerCase()) || c.qr_code.includes(searchTerm);
            const matchStatus = filtroStatus === 'todos' || (filtroStatus === 'validos' && c.utilizado === 0) || (filtroStatus === 'utilizados' && c.utilizado === 1);
            return matchSearch && matchStatus;
          });
          if (convitesFiltrados.length === 0) return null;
          
          return (
            <div key={evento} className="evento-group">
              <div className="evento-header" onClick={() => toggleEvento(evento)}>
                <Filter size={18} />
                <h2>{evento}</h2>
                <span className="evento-count">{convitesFiltrados.length} convite(s)</span>
                <button className="evento-toggle">{eventoExpandido[evento] ? '▼' : '▶'}</button>
              </div>
              {eventoExpandido[evento] && (
                <div className="convites-grid">
                  {convitesFiltrados.map(convite => (
                    <div key={convite.id} className="convite-card">
                      {editandoId === convite.id ? (
                        <div className="edit-mode">
                          <div className="edit-header"><h3>Editar Convite</h3><button onClick={handleCancelarEdicao}><X size={18} /></button></div>
                          <div className="edit-form">
                            <input type="text" value={editForm.nome_convidado1} onChange={e => setEditForm({...editForm, nome_convidado1: e.target.value})} placeholder="Convidado 1" />
                            <input type="text" value={editForm.nome_convidado2} onChange={e => setEditForm({...editForm, nome_convidado2: e.target.value})} placeholder="Convidado 2" />
                            <input type="text" value={editForm.nome_evento} onChange={e => setEditForm({...editForm, nome_evento: e.target.value})} placeholder="Evento" />
                            <input type="date" value={editForm.data_evento} onChange={e => setEditForm({...editForm, data_evento: e.target.value})} />
                            <input type="time" value={editForm.hora_evento} onChange={e => setEditForm({...editForm, hora_evento: e.target.value})} />
                            <input type="text" value={editForm.endereco} onChange={e => setEditForm({...editForm, endereco: e.target.value})} placeholder="Endereço" />
                            <button onClick={handleSalvarEdicao} className="btn-save"><Save size={16} /> Salvar</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="card-header">
                            <div><h3>{convite.nome_convidado1}</h3>{convite.nome_convidado2 && <p>{convite.nome_convidado2}</p>}</div>
                            <div className={`status-badge ${convite.utilizado === 1 ? 'status-used' : 'status-valid'}`}>{convite.utilizado === 1 ? 'Utilizado' : 'Válido'}</div>
                          </div>
                          <div className="card-qr"><QRCodeGenerator data={convite.qr_code} size={100} /></div>
                          <div className="card-info"><div><span>ID</span><span>#{convite.id}</span></div><div><span>Criado</span><span>{new Date(convite.data_criacao).toLocaleDateString()}</span></div></div>
                          <div className="card-actions">
                            <button onClick={() => handleVerDetalhes(convite.id)}><Eye size={14} /> Detalhes</button>
                            <button onClick={() => handleEditar(convite)}><Edit2 size={14} /> Editar</button>
                            {convite.utilizado === 0 && <button onClick={() => handleUtilizar(convite.qr_code, convite.nome_convidado1)}><CheckCircle size={14} /> Validar</button>}
                            <button onClick={() => handleDownloadPDF(convite)}><Download size={14} /> PDF</button>
                            <button onClick={() => handleDeletar(convite.id, convite.nome_convidado1)}><Trash2 size={14} /> Deletar</button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {showDetalhes && <ConviteDetalhes convite={conviteSelecionado} onClose={handleFecharDetalhes} onDownload={handleDownloadPDF} />}
    </div>
  );
};

export default ManageInvitesPage;