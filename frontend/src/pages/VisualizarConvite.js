import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ApiService from '../services/api';
import QRCodeGenerator from '../components/QRcode/QRCodeGenerator';
import GoogleMap from '../components/GoogleMap/GoogleMap';
import Cronograma from '../components/Cronograma/Cronograma';
import DeclaracaoNoivos from '../components/DeclaracaoNoivos/DeclaracaoNoivos';
import SugestoesPresentes from '../components/SugestoesPresentes/SugestoesPresentes';
import './VisualizarConvite.css';

const VisualizarConvite = () => {
  const { qrCode } = useParams();
  const [convite, setConvite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    carregarConvite();
  }, [qrCode]);

  const carregarConvite = async () => {
    try {
      const data = await ApiService.validarConvite(qrCode);
      if (data.valido) {
        setConvite(data.convite);
      } else {
        setErro(data.mensagem);
      }
    } catch (error) {
      setErro('Erro ao carregar convite');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="visualizar-page">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="visualizar-page">
        <div className="error-container">
          <div className="error-icon"></div>
          <h2>Convite Inválido</h2>
          <p>{erro}</p>
        </div>
      </div>
    );
  }

  // Parser do cronograma
  let cronogramaData = null;
  if (convite?.cronograma) {
    try { cronogramaData = JSON.parse(convite.cronograma); } catch (e) { console.error(e); }
  }

  // Parser da declaração
  let declaracaoData = null;
  if (convite?.declaracao) {
    try { declaracaoData = JSON.parse(convite.declaracao); } catch (e) { console.error(e); }
  }

  // Parser dos presentes
  let presentesData = null;
  if (convite?.presentes) {
    try { presentesData = JSON.parse(convite.presentes); } catch (e) { console.error(e); }
  }

  return (
    <div className="visualizar-page">
      <div className="visualizar-container">
        <div className="invite-header">
          <h1>Convite Digital</h1>
          <div className="invite-badge">Válido</div>
        </div>

        <div className="invite-content">
          {/* Convidados */}
          <div className="convidados-section">
            <h2>Convidados</h2>
            <p className="convidado-nome">{convite?.nome_convidado1}</p>
            {convite?.nome_convidado2 && (
              <p className="convidado-nome">{convite?.nome_convidado2}</p>
            )}
          </div>

          {/* Evento */}
          {convite?.nome_evento && (
            <div className="evento-section">
              <h2>Evento</h2>
              <p className="evento-nome">{convite?.nome_evento}</p>
              {convite?.data_evento && (
                <p className="evento-data">📅 {new Date(convite.data_evento).toLocaleDateString('pt-BR')}</p>
              )}
              {convite?.hora_evento && (
                <p className="evento-hora">⏰ {convite.hora_evento}</p>
              )}
            </div>
          )}

          {/* Local do Evento com Mapa */}
          {convite?.endereco && (
            <div className="local-section">
              <h2>Local do Evento</h2>
              <GoogleMap 
                address={convite.endereco}
                locationName={convite.nome_evento}
              />
            </div>
          )}

          {/* Cronograma */}
          {cronogramaData && cronogramaData.length > 0 && (
            <div className="cronograma-section">
              <Cronograma 
                eventos={cronogramaData} 
                isViewMode={true}
              />
            </div>
          )}

          {/* Declaração dos Noivos */}
          {declaracaoData && declaracaoData.mensagem && declaracaoData.mensagem.trim() !== '' && (
            <div className="declaracao-section">
              <DeclaracaoNoivos declaracao={declaracaoData} isViewMode={true} />
            </div>
          )}

          {/* Sugestões de Presentes */}
          {presentesData && presentesData.length > 0 && (
            <div className="presentes-section">
              <SugestoesPresentes presentes={presentesData} isViewMode={true} />
            </div>
          )}

          {/* QR Code de Validação */}
          <div className="qr-section">
            <h2>QR Code de Validação</h2>
            <QRCodeGenerator data={qrCode} size={150} />
            <p className="qr-code-text">{qrCode}</p>
            <p className="qr-info-text">
              Este QR Code será validado na entrada do evento
            </p>
          </div>
        </div>

        <div className="invite-footer">
          <p>Sistema de Convites Digitais</p>
          <p className="footer-small">Digital Invites - Convite digital com tecnologia de validação</p>
        </div>
      </div>
    </div>
  );
};

export default VisualizarConvite;