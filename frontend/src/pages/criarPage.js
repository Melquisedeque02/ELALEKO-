import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import QRCodeGenerator from '../components/QRcode/QRCodeGenerator';
import GoogleMap from '../components/GoogleMap/GoogleMap';
import ManualConvidado from '../components/ManualConvidado/ManualConvidado';
import DeclaracaoNoivos from '../components/DeclaracaoNoivos/DeclaracaoNoivos';
import TemplateSelector from '../components/Templates/TemplateSelector';
import TemplateClassico from '../components/Templates/TemplateClassico';
import TemplateModerno from '../components/Templates/TemplateModerno';
import TemplateRomantico from '../components/Templates/TemplateRomantico';
import TemplateNatureza from '../components/Templates/TemplateNatureza';
import TemplateReligioso from '../components/Templates/TemplateReligioso';
import { Heart, PartyPopper } from 'lucide-react';
import ApiService from '../services/api';
import './criarPage.css';

const CriarPage = () => {
  const [searchParams] = useSearchParams();
  const eventoId = searchParams.get('eventoId');
  
  const [tipoEvento, setTipoEvento] = useState(null);
  const [loadingEvento, setLoadingEvento] = useState(!!eventoId);
  const [formData, setFormData] = useState({
    guestName1: '',
    guestName2: '',
    eventName: '',
    eventDate: '',
    eventTime: '',
    eventLocation: '',
    eventAddress: '',
    paiNoivo: '',
    maeNoivo: '',
    paiNoiva: '',
    maeNoiva: ''
  });
  
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
  const [loading, setLoading] = useState(false);
  const [conviteCriado, setConviteCriado] = useState(null);
  const [erro, setErro] = useState('');
  const [templateSelecionado, setTemplateSelecionado] = useState('classico');
  
  const templateRef = useRef(null);

  // Carregar dados do evento se eventoId existir
  useEffect(() => {
    if (eventoId) {
      carregarDadosEvento();
    }
  }, [eventoId]);

  const carregarDadosEvento = async () => {
    try {
      setLoadingEvento(true);
      const evento = await ApiService.buscarEventoPorId(eventoId);
      if (evento) {
        setFormData(prev => ({
          ...prev,
          eventName: evento.nome_evento || '',
          eventDate: evento.data_evento || '',
          eventTime: evento.hora_evento || '',
          eventAddress: evento.endereco || ''
        }));
        // Se o evento tiver tipo, podemos definir automaticamente
        if (evento.tipo) setTipoEvento(evento.tipo);
      }
    } catch (error) {
      console.error('Erro ao carregar evento:', error);
    } finally {
      setLoadingEvento(false);
    }
  };

  const getConviteUrl = (qrCode) => {
    const origin = window.location.origin;
    return `${origin}/convite/${qrCode}`;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLocationChange = (address) => {
    setFormData(prev => ({ ...prev, eventAddress: address }));
  };

  const handleManualChange = (manual) => {
    setManualData(manual);
  };

  const handleDeclaracaoChange = (declaracao) => {
    setDeclaracaoData(declaracao);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.guestName1.trim()) {
      setErro('Nome do primeiro convidado é obrigatório');
      return;
    }

    setLoading(true);
    setErro('');

    try {
      const conviteData = {
        guestName1: formData.guestName1,
        guestName2: formData.guestName2,
        endereco: formData.eventAddress,
        nome_evento: formData.eventName,
        data_evento: formData.eventDate,
        hora_evento: formData.eventTime,
        manual: JSON.stringify(manualData),
        declaracao: JSON.stringify(declaracaoData),
        template: templateSelecionado,
        pai_noivo: formData.paiNoivo,
        mae_noivo: formData.maeNoivo,
        pai_noiva: formData.paiNoiva,
        mae_noiva: formData.maeNoiva
      };
      
      // Se houver eventoId, associar o convite ao evento
      if (eventoId) {
        conviteData.evento_id = eventoId;
      }
      
      const response = await ApiService.criarConvite(conviteData);
      
      setConviteCriado(response.convite);
      
      // Limpar formulário (manter apenas dados do evento)
      setFormData({
        guestName1: '',
        guestName2: '',
        eventName: formData.eventName,
        eventDate: formData.eventDate,
        eventTime: formData.eventTime,
        eventLocation: formData.eventLocation,
        eventAddress: formData.eventAddress,
        paiNoivo: '',
        maeNoivo: '',
        paiNoiva: '',
        maeNoiva: ''
      });
      setManualData({
        dressCode: '',
        whatsapp: '',
        criancas: 'sim',
        estacionamento: '',
        alergias: '',
        observacoes: ''
      });
      setDeclaracaoData({
        titulo: '',
        mensagem: '',
        frase: '',
        citacao: ''
      });
      
    } catch (error) {
      setErro('Erro ao criar convite. Verifique se o backend está rodando.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const downloadQRCode = async () => {
    if (!conviteCriado) return;
    try {
      const urlCompleta = getConviteUrl(conviteCriado.qrCode);
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(urlCompleta)}&format=png&margin=15`;
      const link = document.createElement('a');
      link.href = qrUrl;
      link.download = `qr_code_${conviteCriado.nome_convidado1.replace(/\s+/g, '_')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Erro ao baixar QR Code:', error);
      alert('Erro ao baixar QR Code');
    }
  };

  const downloadPDF = async () => {
    if (!conviteCriado) return;
    try {
      const { default: jsPDF } = await import('jspdf');
      const html2canvas = await import('html2canvas');
      
      let manualDataSalvo = manualData;
      let declaracaoDataSalva = declaracaoData;
      if (conviteCriado.manual) { try { manualDataSalvo = JSON.parse(conviteCriado.manual); } catch(e) {} }
      if (conviteCriado.declaracao) { try { declaracaoDataSalva = JSON.parse(conviteCriado.declaracao); } catch(e) {} }
      
      const templateData = {
        nome_convidado1: conviteCriado.nome_convidado1,
        nome_convidado2: conviteCriado.nome_convidado2,
        nome_evento: conviteCriado.nome_evento || formData.eventName,
        data_evento: conviteCriado.data_evento || formData.eventDate,
        hora_evento: conviteCriado.hora_evento || formData.eventTime,
        endereco: conviteCriado.endereco || formData.eventAddress || formData.eventLocation,
        pai_noivo: conviteCriado.pai_noivo || formData.paiNoivo,
        mae_noivo: conviteCriado.mae_noivo || formData.maeNoivo,
        pai_noiva: conviteCriado.pai_noiva || formData.paiNoiva,
        mae_noiva: conviteCriado.mae_noiva || formData.maeNoiva
      };
      
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(getConviteUrl(conviteCriado.qrCode))}&format=png`;
      
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '-9999px';
      tempDiv.style.width = '500px';
      tempDiv.style.height = 'auto';
      tempDiv.style.background = '#ffffff';
      document.body.appendChild(tempDiv);
      
      let TemplateComponent;
      switch(templateSelecionado) {
        case 'moderno': TemplateComponent = TemplateModerno; break;
        case 'romantico': TemplateComponent = TemplateRomantico; break;
        case 'natureza': TemplateComponent = TemplateNatureza; break;
        case 'religioso': TemplateComponent = TemplateReligioso; break;
        default: TemplateComponent = TemplateClassico;
      }
      
      const { createRoot } = await import('react-dom/client');
      const root = createRoot(tempDiv);
      root.render(<TemplateComponent convite={templateData} qrCodeUrl={qrCodeUrl} manualData={manualDataSalvo} declaracaoData={declaracaoDataSalva} />);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const canvas = await html2canvas.default(tempDiv, { scale: 2, backgroundColor: '#ffffff', useCORS: true, windowHeight: tempDiv.scrollHeight, height: tempDiv.scrollHeight });
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [210, imgHeight + 20] });
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save(`convite_${conviteCriado.nome_convidado1.replace(/\s+/g, '_')}.pdf`);
      
      root.unmount();
      document.body.removeChild(tempDiv);
    } catch (error) {
      console.error('Erro ao baixar PDF:', error);
      alert('Erro ao gerar PDF');
    }
  };

  const qrCodeData = conviteCriado ? getConviteUrl(conviteCriado.qrCode) : '';

  const renderTemplatePreview = () => {
    const dadosConvite = {
      nome_convidado1: formData.guestName1 || 'Nome do Convidado',
      nome_convidado2: formData.guestName2,
      nome_evento: formData.eventName || 'Evento Especial',
      data_evento: formData.eventDate,
      hora_evento: formData.eventTime,
      endereco: formData.eventAddress || formData.eventLocation,
      pai_noivo: formData.paiNoivo,
      mae_noivo: formData.maeNoivo,
      pai_noiva: formData.paiNoiva,
      mae_noiva: formData.maeNoiva
    };
    
    const qrCodeTemp = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent('https://elaleko.com/convite/temp')}&format=png`;
    
    switch(templateSelecionado) {
      case 'moderno': return <TemplateModerno convite={dadosConvite} qrCodeUrl={qrCodeTemp} manualData={manualData} declaracaoData={declaracaoData} />;
      case 'romantico': return <TemplateRomantico convite={dadosConvite} qrCodeUrl={qrCodeTemp} manualData={manualData} declaracaoData={declaracaoData} />;
      case 'natureza': return <TemplateNatureza convite={dadosConvite} qrCodeUrl={qrCodeTemp} manualData={manualData} declaracaoData={declaracaoData} />;
      case 'religioso': return <TemplateReligioso convite={dadosConvite} qrCodeUrl={qrCodeTemp} manualData={manualData} declaracaoData={declaracaoData} />;
      default: return <TemplateClassico convite={dadosConvite} qrCodeUrl={qrCodeTemp} manualData={manualData} declaracaoData={declaracaoData} />;
    }
  };

  // Se está carregando dados do evento
  if (loadingEvento) {
    return <div className="loading-container"><div className="loading-spinner"></div><p>Carregando evento...</p></div>;
  }

  // Se não escolheu o tipo de evento ainda (apenas quando não vem de um evento existente)
  if (!tipoEvento && !eventoId) {
    return (
      <div className="criar-page">
        <div className="criar-container">
          <div className="tipo-selector">
            <h2>Escolha o tipo de evento</h2>
            <div className="tipo-opcoes">
              <button onClick={() => setTipoEvento('casamento')} className="btn-tipo">
                <Heart size={24} />
                <span>Casamento</span>
              </button>
              <button onClick={() => setTipoEvento('outro')} className="btn-tipo">
                <PartyPopper size={24} />
                <span>Outro Evento</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="criar-page">
      <div className="criar-container">
        <div className="page-header">
          <h1>Criar Convite</h1>
          <p>Crie convites digitais personalizados com QR Code único</p>
          {!eventoId && (
            <button onClick={() => setTipoEvento(null)} className="btn-voltar-tipo">← Voltar e escolher outro tipo</button>
          )}
        </div>

        <div className="form-card">
          <h2 className="form-title">Novo Convite</h2>
          <p className="form-subtitle">Preencha os dados do convidado e do evento</p>

          {erro && <div className="alert alert-error">{erro}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Convidado</label>
              <input type="text" name="guestName1" value={formData.guestName1} onChange={handleChange} placeholder="Ex: João Silva" required />
            </div>

            <div className="form-group">
              <label>Acompanhante (opcional)</label>
              <input type="text" name="guestName2" value={formData.guestName2} onChange={handleChange} placeholder="Ex: Maria Silva" />
            </div>

            <div className="form-group">
              <label>Nome do Evento</label>
              <input type="text" name="eventName" value={formData.eventName} onChange={handleChange} placeholder="Ex: Casamento João & Maria" />
            </div>

            <div className="form-row">
              <div className="form-group"><label>Data</label><input type="date" name="eventDate" value={formData.eventDate} onChange={handleChange} /></div>
              <div className="form-group"><label>Hora</label><input type="time" name="eventTime" value={formData.eventTime} onChange={handleChange} /></div>
            </div>

            <div className="form-group">
              <label>Local do Evento</label>
              <input type="text" name="eventLocation" value={formData.eventLocation} onChange={handleChange} placeholder="Ex: Salão de Festas" />
            </div>

            {tipoEvento === 'casamento' && (
              <>
                <div className="form-row">
                  <div className="form-group"><label>Pai do Noivo</label><input type="text" name="paiNoivo" value={formData.paiNoivo} onChange={handleChange} placeholder="Ex: João Silva" /></div>
                  <div className="form-group"><label>Mãe do Noivo</label><input type="text" name="maeNoivo" value={formData.maeNoivo} onChange={handleChange} placeholder="Ex: Maria Silva" /></div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label>Pai da Noiva</label><input type="text" name="paiNoiva" value={formData.paiNoiva} onChange={handleChange} placeholder="Ex: José Santos" /></div>
                  <div className="form-group"><label>Mãe da Noiva</label><input type="text" name="maeNoiva" value={formData.maeNoiva} onChange={handleChange} placeholder="Ex: Ana Santos" /></div>
                </div>
              </>
            )}

            <GoogleMap address={formData.eventAddress} locationName={formData.eventName} onLocationChange={handleLocationChange} />
            <TemplateSelector selected={templateSelecionado} onSelect={setTemplateSelecionado} />

            <div className="template-preview-section">
              <h3 className="preview-title">Pré-visualização do Convite</h3>
              <div className="template-preview-container" ref={templateRef}>{renderTemplatePreview()}</div>
              <p className="preview-note">O QR Code será gerado após a criação do convite</p>
            </div>

            <ManualConvidado manual={manualData} onManualChange={handleManualChange} />
            <DeclaracaoNoivos declaracao={declaracaoData} onDeclaracaoChange={handleDeclaracaoChange} />

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? "Criando..." : "Criar Convite"}</button>
              <button type="button" className="btn btn-secondary" onClick={() => {
                setFormData({
                  ...formData,
                  guestName1: '', guestName2: '', paiNoivo: '', maeNoivo: '', paiNoiva: '', maeNoiva: ''
                });
                setManualData({ dressCode: '', whatsapp: '', criancas: 'sim', estacionamento: '', alergias: '', observacoes: '' });
                setDeclaracaoData({ titulo: '', mensagem: '', frase: '', citacao: '' });
              }}>Limpar</button>
            </div>
          </form>
        </div>

        {conviteCriado && (
          <div className="qr-section">
            <div className="qr-card">
              <div className="qr-header"><h3 className="qr-title">Convite Criado com Sucesso!</h3><p className="qr-subtitle">Seu convite está pronto para ser compartilhado</p></div>
              <div className="qr-code-container"><QRCodeGenerator data={qrCodeData} size={180} /></div>
              <div className="qr-info">
                <div className="info-row"><span className="info-label">URL:</span><span className="info-value">{qrCodeData}</span></div>
                <div className="info-row"><span className="info-label">Código:</span><span className="info-value">{conviteCriado.qrCode}</span></div>
                <div className="info-row"><span className="info-label">Convidado:</span><span className="info-value">{conviteCriado.nome_convidado1}</span></div>
                {conviteCriado.nome_convidado2 && <div className="info-row"><span className="info-label">Acompanhante:</span><span className="info-value">{conviteCriado.nome_convidado2}</span></div>}
                <div className="info-row"><span className="info-label">ID:</span><span className="info-value">#{conviteCriado.id}</span></div>
              </div>
              <div className="qr-actions">
                <button onClick={downloadQRCode} className="btn btn-outline">Baixar QR Code</button>
                <button onClick={downloadPDF} className="btn btn-primary">Baixar Convite (PDF)</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CriarPage;