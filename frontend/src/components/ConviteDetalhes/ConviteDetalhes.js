import React from 'react';
import { X, User, Calendar, MapPin, Clock, QrCode, Info, CheckCircle, XCircle } from 'lucide-react';
import QRCodeGenerator from '../QRcode/QRCodeGenerator';
import GoogleMap from '../GoogleMap/GoogleMap';
import Cronograma from '../Cronograma/Cronograma';
import ManualConvidado from '../ManualConvidado/ManualConvidado';
import DeclaracaoNoivos from '../DeclaracaoNoivos/DeclaracaoNoivos';
import SugestoesPresentes from '../SugestoesPresentes/SugestoesPresentes';
import './ConviteDetalhes.css';

const ConviteDetalhes = ({ convite, onClose, onDownload }) => {
  if (!convite) return null;

  let cronogramaData = null;
  if (convite.cronograma) {
    try { cronogramaData = JSON.parse(convite.cronograma); } catch (e) { console.error(e); }
  }

  let manualData = null;
  if (convite.manual) {
    try { manualData = JSON.parse(convite.manual); } catch (e) { console.error(e); }
  }

  let declaracaoData = null;
  if (convite.declaracao) {
    try { declaracaoData = JSON.parse(convite.declaracao); } catch (e) { console.error(e); }
  }

  let presentesData = null;
  if (convite.presentes) {
    try { presentesData = JSON.parse(convite.presentes); } catch (e) { console.error(e); }
  }

  const handleDownload = () => { if (onDownload) onDownload(convite); };

  const hasEndereco = convite.endereco && convite.endereco.trim() !== '';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>
        
        <div className="modal-header">
          <h2>Detalhes do Convite</h2>
          <div className={`status-badge ${convite.utilizado === 1 ? 'status-used' : 'status-valid'}`}>
            {convite.utilizado === 1 ? (
              <><XCircle size={14} /> Utilizado</>
            ) : (
              <><CheckCircle size={14} /> Válido</>
            )}
          </div>
        </div>

        <div className="modal-body">
          {/* Convidados */}
          <div className="detalhes-section">
            <h3><User size={18} /> Convidados</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Principal</span>
                <span className="info-value">{convite.nome_convidado1}</span>
              </div>
              {convite.nome_convidado2 && (
                <div className="info-item">
                  <span className="info-label">Acompanhante</span>
                  <span className="info-value">{convite.nome_convidado2}</span>
                </div>
              )}
            </div>
          </div>

          {/* Evento */}
          {convite.nome_evento && (
            <div className="detalhes-section">
              <h3><Calendar size={18} /> Evento</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Nome</span>
                  <span className="info-value">{convite.nome_evento}</span>
                </div>
                {convite.data_evento && (
                  <div className="info-item">
                    <span className="info-label">Data</span>
                    <span className="info-value">{new Date(convite.data_evento).toLocaleDateString('pt-BR')}</span>
                  </div>
                )}
                {convite.hora_evento && (
                  <div className="info-item">
                    <span className="info-label">Hora</span>
                    <span className="info-value">{convite.hora_evento}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Local do Evento */}
          {hasEndereco && (
            <div className="detalhes-section">
              <h3><MapPin size={18} /> Local do Evento</h3>
              <GoogleMap 
                address={convite.endereco} 
                locationName={convite.nome_evento} 
              />
            </div>
          )}

          {/* Cronograma */}
          {cronogramaData && cronogramaData.length > 0 && (
            <div className="detalhes-section">
              <h3><Clock size={18} /> Cronograma</h3>
              <Cronograma eventos={cronogramaData} isViewMode={true} />
            </div>
          )}

          {/* Manual do Convidado */}
          {manualData && (
            <div className="detalhes-section">
              <ManualConvidado manual={manualData} isViewMode={true} />
            </div>
          )}

          {/* Declaração dos Noivos */}
          {declaracaoData && declaracaoData.mensagem && declaracaoData.mensagem.trim() !== '' && (
            <div className="detalhes-section">
              <DeclaracaoNoivos declaracao={declaracaoData} isViewMode={true} />
            </div>
          )}

          {/* Sugestões de Presentes */}
          {presentesData && presentesData.length > 0 && (
            <div className="detalhes-section">
              <SugestoesPresentes presentes={presentesData} isViewMode={true} />
            </div>
          )}

          {/* QR Code */}
          <div className="detalhes-section qr-section-modal">
            <h3><QrCode size={18} /> QR Code de Validação</h3>
            <div className="qr-container">
              <QRCodeGenerator data={convite.qr_code} size={120} />
              <p className="qr-code-text">{convite.qr_code}</p>
              <p className="qr-info-text">Apresente este código na entrada do evento</p>
            </div>
          </div>

          {/* Informações Adicionais */}
          <div className="detalhes-section">
            <h3><Info size={18} /> Informações</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">ID do Convite</span>
                <span className="info-value">#{convite.id}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Criado em</span>
                <span className="info-value">{new Date(convite.data_criacao).toLocaleDateString('pt-BR')}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Horário</span>
                <span className="info-value">{new Date(convite.data_criacao).toLocaleTimeString('pt-BR')}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={handleDownload} className="btn btn-primary">
            Baixar Convite (PDF)
          </button>
          <button onClick={onClose} className="btn btn-secondary">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConviteDetalhes;