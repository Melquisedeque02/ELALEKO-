import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ApiService from '../services/api';
import QRCodeGenerator from '../components/QRcode/QRCodeGenerator';
import { Plus, Download, Eye, Edit2, Trash2, CheckCircle, XCircle, ArrowLeft, Search, Upload, FileSpreadsheet, X } from 'lucide-react';
import './EventoConvitesPage.css';
import TemplateClassico from '../components/Templates/TemplateClassico';
import TemplateModerno from '../components/Templates/TemplateModerno';
import TemplateRomantico from '../components/Templates/TemplateRomantico';
import TemplateNatureza from '../components/Templates/TemplateNatureza';
import TemplateReligioso from '../components/Templates/TemplateReligioso';


const EventoConvitesPage = () => {
  const { eventoId } = useParams();
  const navigate = useNavigate();
  const [convites, setConvites] = useState([]);
  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [conviteSelecionado, setConviteSelecionado] = useState(null);
  const [showDetalhesModal, setShowDetalhesModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [baixandoTodos, setBaixandoTodos] = useState(false);
  const [importando, setImportando] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    carregarDados();
  }, [eventoId]);

  const carregarDados = async () => {
    try {
      setLoading(true);
      setErro('');
      
      const eventos = await ApiService.listarEventos();
      const eventoEncontrado = eventos.find(e => e.id == eventoId);
      if (eventoEncontrado) {
        setEvento(eventoEncontrado);
      } else {
        setErro('Evento não encontrado');
      }
      
      const convitesData = await ApiService.listarConvitesPorEvento(eventoId);
      setConvites(convitesData);
      
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setErro('Erro ao carregar convites. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  };

  // Filtrar convites por nome
  const convitesFiltrados = convites.filter(convite =>
    convite.nome_convidado1.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (convite.nome_convidado2 && convite.nome_convidado2.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Download de todos os convites em ZIP
  const handleDownloadAll = async () => {
    setBaixandoTodos(true);
    try {
      await ApiService.downloadAllConvites(eventoId);
    } catch (error) {
      alert(error.message || 'Erro ao baixar convites');
    } finally {
      setBaixandoTodos(false);
    }
  };

  // Importar convites via Excel/CSV
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);
    
    setImportando(true);
    setImportResult(null);
    
    try {
      const result = await ApiService.importarConvites(eventoId, formData);
      setImportResult(result);
      carregarDados();
    } catch (error) {
      alert(error.message || 'Erro ao importar convites');
    } finally {
      setImportando(false);
      setShowImportModal(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleVerDetalhes = (convite) => {
    setConviteSelecionado(convite);
    setShowDetalhesModal(true);
  };

  const handleEditar = (convite) => {
    setEditando(convite.id);
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
      mae_noiva: convite.mae_noiva || ''
    });
    setShowDetalhesModal(false);
  };

  const handleSalvarEdicao = async () => {
  try {
    await ApiService.atualizarConvite(editando, editForm);
    setEditando(null);
    carregarDados();
    alert('Convite atualizado com sucesso!');
  } catch (error) {
    console.error('Erro ao salvar edição:', error);
    alert(error.message || 'Erro ao salvar alterações');
  }
};

  const handleUtilizar = async (convite) => {
  if (window.confirm(`Marcar ${convite.nome_convidado1} como utilizado?`)) {
    try {
      await ApiService.utilizarConvite(convite.qr_code);
      carregarDados();
      setShowDetalhesModal(false);
      alert('Convite marcado como utilizado!');
    } catch (error) {
      console.error('Erro ao marcar como utilizado:', error);
      alert(error.message || 'Erro ao marcar convite');
    }
  }
};

const handleDelete = async (id) => {
  if (window.confirm('Tem certeza que deseja deletar este convite?')) {
    try {
      await ApiService.deletarConvite(id);
      await carregarDados(); // Recarregar lista
      setShowDetalhesModal(false);
      alert('Convite deletado com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar:', error);
      alert(error.message || 'Erro ao deletar convite');
    }
  }
};

  const downloadPDF = async (convite) => {
  try {
    const { default: jsPDF } = await import('jspdf');
    const html2canvas = await import('html2canvas');
    
    // Criar elemento temporário
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '-9999px';
    tempDiv.style.width = '500px';
    tempDiv.style.background = '#ffffff';
    document.body.appendChild(tempDiv);
    
    // Dados do convite
    const dadosConvite = {
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
    
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${convite.qr_code}&format=png`;
    
    // Escolher o template correto
    let TemplateComponent;
    const template = convite.template || 'classico';
    switch(template) {
      case 'moderno': TemplateComponent = TemplateModerno; break;
      case 'romantico': TemplateComponent = TemplateRomantico; break;
      case 'natureza': TemplateComponent = TemplateNatureza; break;
      case 'religioso': TemplateComponent = TemplateReligioso; break;
      default: TemplateComponent = TemplateClassico;
    }
    
    // Renderizar
    const { createRoot } = await import('react-dom/client');
    const root = createRoot(tempDiv);
    root.render(<TemplateComponent convite={dadosConvite} qrCodeUrl={qrCodeUrl} />);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Capturar
    const canvas = await html2canvas.default(tempDiv, {
      scale: 2,
      backgroundColor: '#ffffff',
      useCORS: true,
      windowHeight: tempDiv.scrollHeight,
      height: tempDiv.scrollHeight
    });
    
    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 190;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [210, imgHeight + 20]
    });
    pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
    pdf.save(`convite_${convite.nome_convidado1.replace(/\s+/g, '_')}.pdf`);
    
    root.unmount();
    document.body.removeChild(tempDiv);
    
  } catch (error) {
    console.error('Erro ao baixar PDF:', error);
    alert('Erro ao gerar PDF. Tente novamente.');
  }
};

  const downloadModeloExcel = () => {
    // Criar conteúdo do modelo CSV
    const headers = 'Convidado,Acompanhante\n';
    const exemplo = 'João Silva,Maria Silva\nPedro Santos,\nAna Costa,Paulo Costa';
    const conteudo = headers + exemplo;
    
    const blob = new Blob([conteudo], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', 'modelo_convites.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="evento-convites-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Carregando convites...</p>
        </div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="evento-convites-page">
        <div className="error-container">
          <p className="error-message">{erro}</p>
          <button onClick={() => navigate('/organizador/dashboard')} className="btn-back">
            Voltar para Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="evento-convites-page">
      <div className="page-container">
        {/* Cabeçalho */}
        <div className="page-header">
          <button onClick={() => navigate('/organizador/dashboard')} className="btn-back">
            <ArrowLeft size={18} /> Voltar
          </button>
          <h1>{evento?.nome_evento || 'Evento'}</h1>
          <div className="header-buttons">
            <button onClick={() => setShowImportModal(true)} className="btn-importar">
              <FileSpreadsheet size={18} /> Importar Excel
            </button>
            <Link to={`/criar?eventoId=${eventoId}`} className="btn-primary">
              <Plus size={18} /> Novo Convite
            </Link>
          </div>
        </div>

        {/* Barra de Pesquisa e Download em Massa */}
        <div className="search-bulk-bar">
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Pesquisar por nome do convidado..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={handleDownloadAll} 
            disabled={baixandoTodos || convites.length === 0}
            className="btn-download-all"
          >
            <Download size={18} /> 
            {baixandoTodos ? 'A preparar...' : `Baixar todos (${convites.length})`}
          </button>
        </div>

        {/* Lista de Convites Simplificada */}
        {convitesFiltrados.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>Nenhum convite encontrado</h3>
            <p>{searchTerm ? 'Nenhum convite corresponde à sua pesquisa' : 'Comece criando seu primeiro convite para este evento.'}</p>
            {!searchTerm && (
              <div className="empty-actions">
                <Link to={`/criar?eventoId=${eventoId}`} className="btn-outline">
                  <Plus size={16} /> Criar primeiro convite
                </Link>
                <button onClick={() => setShowImportModal(true)} className="btn-outline">
                  <Upload size={16} /> Importar lista
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="convites-list">
            {convitesFiltrados.map(convite => (
              <div key={convite.id} className="convite-item">
                <div className="convite-info">
                  <div className="convite-nome">
                    <strong>{convite.nome_convidado1}</strong>
                    {convite.nome_convidado2 && <span> & {convite.nome_convidado2}</span>}
                  </div>
                  <span className={`status-badge ${convite.utilizado ? 'used' : 'valid'}`}>
                    {convite.utilizado ? 'Utilizado' : 'Válido'}
                  </span>
                </div>
                <button onClick={() => handleVerDetalhes(convite)} className="btn-ver-detalhes">
                  <Eye size={18} /> Ver detalhes
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Importação */}
      {showImportModal && (
        <div className="modal-overlay" onClick={() => setShowImportModal(false)}>
          <div className="modal-content import-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Importar Convidados</h2>
              <button className="modal-close" onClick={() => setShowImportModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <p>Faça upload de um ficheiro Excel (.xlsx, .xls) ou CSV com a lista de convidados.</p>
              <p className="import-note">O ficheiro deve ter as colunas: <strong>Convidado</strong> e <strong>Acompanhante</strong> (opcional).</p>
              
              <button onClick={downloadModeloExcel} className="btn-modelo">
                <Download size={16} /> Baixar modelo de exemplo
              </button>
              
              <div className="upload-area" onClick={triggerFileInput}>
                <Upload size={32} />
                <p>Clique para selecionar o ficheiro</p>
                <small>Formatos: .xlsx, .xls, .csv</small>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              
              {importando && (
                <div className="importing-status">
                  <div className="loading-spinner-small"></div>
                  <p>A processar ficheiro...</p>
                </div>
              )}
              
              {importResult && (
                <div className={`import-result ${importResult.erros?.length > 0 ? 'partial' : 'success'}`}>
                  <p>✅ {importResult.criados} convites criados</p>
                  {importResult.erros?.length > 0 && (
                    <>
                      <p>⚠️ {importResult.erros.length} erros</p>
                      <details>
                        <summary>Ver detalhes dos erros</summary>
                        <ul>
                          {importResult.erros.slice(0, 5).map((err, idx) => (
                            <li key={idx}>Linha: {JSON.stringify(err.linha)} - {err.motivo}</li>
                          ))}
                          {importResult.erros.length > 5 && <li>... e mais {importResult.erros.length - 5} erros</li>}
                        </ul>
                      </details>
                    </>
                  )}
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowImportModal(false)}>Fechar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalhes (mantém igual) */}
      {showDetalhesModal && conviteSelecionado && (
        <div className="modal-overlay" onClick={() => setShowDetalhesModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Detalhes do Convite</h2>
              <button className="modal-close" onClick={() => setShowDetalhesModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="detail-row"><strong>Convidado:</strong> {conviteSelecionado.nome_convidado1}</div>
              {conviteSelecionado.nome_convidado2 && <div className="detail-row"><strong>Acompanhante:</strong> {conviteSelecionado.nome_convidado2}</div>}
              <div className="detail-row"><strong>Evento:</strong> {conviteSelecionado.nome_evento || 'Não informado'}</div>
              <div className="detail-row"><strong>Data:</strong> {conviteSelecionado.data_evento ? new Date(conviteSelecionado.data_evento).toLocaleDateString('pt-BR') : 'Não informada'}</div>
              <div className="detail-row"><strong>Hora:</strong> {conviteSelecionado.hora_evento || 'Não informada'}</div>
              <div className="detail-row"><strong>Local:</strong> {conviteSelecionado.endereco || 'Não informado'}</div>
              <div className="detail-row"><strong>QR Code:</strong> {conviteSelecionado.qr_code}</div>
              <div className="detail-row"><strong>Criado em:</strong> {new Date(conviteSelecionado.data_criacao).toLocaleDateString('pt-BR')}</div>
            </div>
            <div className="modal-actions-buttons">
              <button onClick={() => handleEditar(conviteSelecionado)} className="btn-editar"><Edit2 size={16} /> Editar</button>
              {!conviteSelecionado.utilizado && (
                <button onClick={() => handleUtilizar(conviteSelecionado)} className="btn-utilizar"><CheckCircle size={16} /> Validar</button>
              )}
              <button onClick={() => downloadPDF(conviteSelecionado)} className="btn-pdf"><Download size={16} /> PDF</button>
              <button onClick={() => handleDelete(conviteSelecionado.id)} className="btn-deletar"><Trash2 size={16} /> Deletar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edição */}
      {editando && (
        <div className="modal-overlay" onClick={() => setEditando(null)}>
          <div className="modal-content edit-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Editar Convite</h2>
              <button className="modal-close" onClick={() => setEditando(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group"><label>Convidado</label><input type="text" value={editForm.nome_convidado1} onChange={e => setEditForm({...editForm, nome_convidado1: e.target.value})} /></div>
              <div className="form-group"><label>Acompanhante</label><input type="text" value={editForm.nome_convidado2} onChange={e => setEditForm({...editForm, nome_convidado2: e.target.value})} /></div>
              <div className="form-group"><label>Evento</label><input type="text" value={editForm.nome_evento} onChange={e => setEditForm({...editForm, nome_evento: e.target.value})} /></div>
              <div className="form-row"><div className="form-group"><label>Data</label><input type="date" value={editForm.data_evento} onChange={e => setEditForm({...editForm, data_evento: e.target.value})} /></div>
              <div className="form-group"><label>Hora</label><input type="time" value={editForm.hora_evento} onChange={e => setEditForm({...editForm, hora_evento: e.target.value})} /></div></div>
              <div className="form-group"><label>Endereço</label><input type="text" value={editForm.endereco} onChange={e => setEditForm({...editForm, endereco: e.target.value})} /></div>
            </div>
            <div className="modal-actions-buttons">
              <button className="btn-cancel" onClick={() => setEditando(null)}>Cancelar</button>
              <button className="btn-save" onClick={handleSalvarEdicao}>Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventoConvitesPage;