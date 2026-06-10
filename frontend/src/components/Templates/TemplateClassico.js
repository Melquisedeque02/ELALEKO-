import React from 'react';
import { Calendar, Clock, MapPin, Users, Heart, Phone, MessageCircle } from 'lucide-react';
import './Templates.css';

const TemplateClassico = ({ convite, qrCodeUrl, manualData, declaracaoData }) => {
  // Verificar se crianças são permitidas
  const criancasPermitidas = manualData?.criancas === 'sim';
  
  return (
    <div className="template-classico-v2">
      <div className="classico-border">
        {/* Versículo / Frase */}
        {declaracaoData?.frase && (
          <div className="classico-verse">
            <span className="quote-icon">❝</span>
            <p>{declaracaoData.frase}</p>
            {declaracaoData.citacao && <span className="verse-author">— {declaracaoData.citacao}</span>}
          </div>
        )}

        {/* Título / Nome do Evento */}
        <div className="classico-title">
          <h1>{convite.nome_evento || 'CONVITE ESPECIAL'}</h1>
        </div>

        {/* Convidados */}
        <div className="classico-guests">
          <p className="guest-name">
            {convite.nome_convidado1}
            {convite.nome_convidado2 && ` & ${convite.nome_convidado2}`}
          </p>
        </div>

        {/* Informações do Evento */}
        <div className="classico-info">
          <div className="info-line">
            <Calendar size={16} />
            <span>{convite.data_evento ? new Date(convite.data_evento).toLocaleDateString('pt-BR') : 'Data a definir'}</span>
          </div>
          <div className="info-line">
            <Clock size={16} />
            <span>{convite.hora_evento || 'Hora a definir'}</span>
          </div>
          <div className="info-line">
            <MapPin size={16} />
            <span>{convite.endereco || 'Local a definir'}</span>
          </div>
        </div>

        {/* Crianças */}
        <div className="classico-children">
          <Users size={16} />
          <span>
            {criancasPermitidas 
              ? 'Crianças são bem-vindas' 
              : 'Por gentileza, não levar crianças'}
          </span>
        </div>

        {/* Contato / WhatsApp */}
        {manualData?.whatsapp && (
          <div className="classico-contact">
            <Phone size={16} />
            <span>Confirmar presença: {manualData.whatsapp}</span>
          </div>
        )}

        {/* QR Code */}
        <div className="classico-qr">
          <img src={qrCodeUrl} alt="QR Code" />
          <p>Confirme sua presença escaneando o QR Code</p>
        </div>

        {/* Declaração dos Noivos */}
        {declaracaoData?.mensagem && (
          <div className="classico-message">
            <Heart size={14} />
            <p>{declaracaoData.mensagem}</p>
          </div>
        )}

        {/* Footer */}
        <div className="classico-footer">
          <p>Digital Invites — Convite Digital</p>
        </div>
      </div>
    </div>
  );
};

export default TemplateClassico;