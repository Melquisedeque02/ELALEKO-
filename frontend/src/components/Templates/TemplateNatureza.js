import React from 'react';
import { Calendar, Clock, MapPin, Users, Heart, Phone, Leaf } from 'lucide-react';
import './Templates.css';

const TemplateNatureza = ({ convite, qrCodeUrl, manualData, declaracaoData }) => {
  const criancasPermitidas = manualData?.criancas === 'sim';
  
  return (
    <div className="template-natureza-v2">
      <div className="natureza-header">
        <Leaf size={28} />
        <span>CELEBRAÇÃO NA NATUREZA</span>
      </div>
      
      <h1>{convite.nome_evento || 'Evento Especial'}</h1>
      
      <p className="natureza-guest">
        {convite.nome_convidado1}
        {convite.nome_convidado2 && ` & ${convite.nome_convidado2}`}
      </p>
      
      <div className="natureza-info">
        <div><Calendar size={14} /> {convite.data_evento ? new Date(convite.data_evento).toLocaleDateString('pt-BR') : 'Data'}</div>
        <div><Clock size={14} /> {convite.hora_evento || 'Hora'}</div>
        <div><MapPin size={14} /> {convite.endereco || 'Local'}</div>
      </div>
      
      <div className="natureza-children">
        <Users size={14} />
        <span>{criancasPermitidas ? 'Crianças são bem-vindas' : 'Não levar crianças'}</span>
      </div>
      
      {declaracaoData?.mensagem && (
        <div className="natureza-message">
          <Heart size={14} />
          <p>{declaracaoData.mensagem}</p>
        </div>
      )}
      
      {manualData?.whatsapp && (
        <div className="natureza-contact">
          <Phone size={14} />
          <span>Confirmar presença: {manualData.whatsapp}</span>
        </div>
      )}
      
      <div className="natureza-qr">
        <img src={qrCodeUrl} alt="QR Code" />
        <p>Escaneie o QR Code</p>
      </div>
    </div>
  );
};

export default TemplateNatureza;