import React from 'react';
import { Calendar, Clock, MapPin, Users, Heart, Phone, Flower2 } from 'lucide-react';
import './Templates.css';

const TemplateRomantico = ({ convite, qrCodeUrl, manualData, declaracaoData }) => {
  const criancasPermitidas = manualData?.criancas === 'sim';
  
  return (
    <div className="template-romantico-v2">
      <div className="romantico-floral">
        <Flower2 size={24} />
        <Flower2 size={20} />
        <Flower2 size={16} />
      </div>
      
      {declaracaoData?.frase && (
        <div className="romantico-verse">
          <p>"{declaracaoData.frase}"</p>
          {declaracaoData.citacao && <small>— {declaracaoData.citacao}</small>}
        </div>
      )}
      
      <h1 className="romantico-title">{convite.nome_evento || 'Amor & União'}</h1>
      
      <p className="romantico-guest">
        {convite.nome_convidado1}
        {convite.nome_convidado2 && ` & ${convite.nome_convidado2}`}
      </p>
      
      <div className="romantico-details">
        <div className="romantico-detail"><Calendar size={14} /> {convite.data_evento ? new Date(convite.data_evento).toLocaleDateString('pt-BR') : 'Data'}</div>
        <div className="romantico-detail"><Clock size={14} /> {convite.hora_evento || 'Hora'}</div>
        <div className="romantico-detail"><MapPin size={14} /> {convite.endereco || 'Local'}</div>
      </div>
      
      <div className="romantico-children">
        <Users size={14} />
        <span>{criancasPermitidas ? 'Crianças são bem-vindas' : 'Não levar crianças'}</span>
      </div>
      
      {manualData?.whatsapp && (
        <div className="romantico-contact">
          <Phone size={14} />
          <span>Confirmar: {manualData.whatsapp}</span>
        </div>
      )}
      
      <div className="romantico-qr">
        <img src={qrCodeUrl} alt="QR Code" />
      </div>
      
      {declaracaoData?.mensagem && (
        <div className="romantico-footer-message">
          <Heart size={12} />
          <span>{declaracaoData.mensagem}</span>
        </div>
      )}
    </div>
  );
};

export default TemplateRomantico;