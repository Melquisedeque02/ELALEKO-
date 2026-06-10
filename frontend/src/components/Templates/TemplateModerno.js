import React from 'react';
import { Calendar, Clock, MapPin, Users, Heart, Phone, CheckCircle, XCircle } from 'lucide-react';
import './Templates.css';

const TemplateModerno = ({ convite, qrCodeUrl, manualData, declaracaoData }) => {
  const criancasPermitidas = manualData?.criancas === 'sim';
  
  return (
    <div className="template-moderno-v2">
      <div className="moderno-header-badge">
        <span>CONVITE</span>
      </div>
      
      <h1 className="moderno-title">{convite.nome_evento || 'Evento Especial'}</h1>
      
      <p className="moderno-guest">
        {convite.nome_convidado1}
        {convite.nome_convidado2 && ` & ${convite.nome_convidado2}`}
      </p>
      
      <div className="moderno-info-grid">
        <div className="moderno-info-card">
          <Calendar size={18} />
          <span>{convite.data_evento ? new Date(convite.data_evento).toLocaleDateString('pt-BR') : 'Data'}</span>
        </div>
        <div className="moderno-info-card">
          <Clock size={18} />
          <span>{convite.hora_evento || 'Hora'}</span>
        </div>
        <div className="moderno-info-card full-width">
          <MapPin size={18} />
          <span>{convite.endereco || 'Local'}</span>
        </div>
      </div>
      
      <div className="moderno-children">
        {criancasPermitidas ? (
          <><CheckCircle size={16} /> Crianças são bem-vindas</>
        ) : (
          <><XCircle size={16} /> Por gentileza, não levar crianças</>
        )}
      </div>
      
      {declaracaoData?.mensagem && (
        <div className="moderno-message">
          <Heart size={16} />
          <p>{declaracaoData.mensagem}</p>
        </div>
      )}
      
      {manualData?.whatsapp && (
        <div className="moderno-contact">
          <Phone size={14} />
          <span>Confirme sua presença: {manualData.whatsapp}</span>
        </div>
      )}
      
      <div className="moderno-qr">
        <img src={qrCodeUrl} alt="QR Code" />
        <p>Escaneie o QR Code</p>
      </div>
    </div>
  );
};

export default TemplateModerno;