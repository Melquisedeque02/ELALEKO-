import React from 'react';
import { Flower2, Heart, Church, Phone, Calendar, Clock, MapPin } from 'lucide-react';
import './Templates.css';

const TemplateReligioso = ({ convite, qrCodeUrl, manualData, declaracaoData }) => {
  const criancasPermitidas = manualData?.criancas === 'sim';
  
  const formatarData = (dataString) => {
    if (!dataString) return 'Data a definir';
    const data = new Date(dataString);
    const dia = data.getDate().toString().padStart(2, '0');
    const mes = data.toLocaleString('pt-BR', { month: 'long' });
    const ano = data.getFullYear();
    return `${dia} | ${mes.toUpperCase()} | ${ano}`;
  };

  // Construir os textos dos pais
  const textoPaisNoivo = convite.pai_noivo && convite.mae_noivo 
    ? `Filho de ${convite.pai_noivo} & ${convite.mae_noivo}`
    : convite.pai_noivo || convite.mae_noivo || '';
    
  const textoPaisNoiva = convite.pai_noiva && convite.mae_noiva 
    ? `Filha de ${convite.pai_noiva} & ${convite.mae_noiva}`
    : convite.pai_noiva || convite.mae_noiva || '';

  return (
    <div className="template-religioso">
      <div className="floral-top">
        <Flower2 size={22} />
        <Flower2 size={16} />
        <Flower2 size={22} />
      </div>

      {declaracaoData?.frase && (
        <div className="versiculo">
          <p>"{declaracaoData.frase}"</p>
          {declaracaoData.citacao && <span className="citacao">— {declaracaoData.citacao}</span>}
        </div>
      )}

      <div className="familia-titulo">
        <span>COM A BENÇÃO DE DEUS</span>
        <span>E DE SEUS FILHOS</span>
      </div>

      <div className="familia-nomes">
        {textoPaisNoivo && <p className="nomes-pais">{textoPaisNoivo}</p>}
        {textoPaisNoiva && <p className="nomes-pais-secundarios">{textoPaisNoiva}</p>}
      </div>

      <div className="convite-texto">
        <p>Convidam para o seu</p>
        <h1>{convite.nome_evento?.toUpperCase() || 'ENLACE MATRIMONIAL'}</h1>
      </div>

      <p className="convidado-nomes">
        {convite.nome_convidado1}
        {convite.nome_convidado2 && ` & ${convite.nome_convidado2}`}
      </p>

      <div className="data-destaque">
        <Calendar size={16} />
        <span>{formatarData(convite.data_evento)}</span>
      </div>

      <div className="evento-detalhe">
        <div className="evento-icon">
          <Church size={18} />
          <h3>CERIMÓNIA RELIGIOSA</h3>
        </div>
        <p className="evento-local">{convite.endereco || 'Local a definir'}</p>
        <p className="evento-hora">
          <Clock size={12} /> {convite.hora_evento || 'Horário a definir'}
        </p>
      </div>

      <div className="evento-detalhe">
        <div className="evento-icon">
          <Heart size={18} />
          <h3>COPO D'ÁGUA</h3>
        </div>
        <p className="evento-local">{convite.endereco || 'Local a definir'}</p>
        <p className="evento-hora">
          <Clock size={12} /> {convite.hora_evento ? `Após a cerimónia` : 'Horário a definir'}
        </p>
      </div>

      <div className="aviso-criancas">
        <Heart size={12} />
        <span>
          {criancasPermitidas ? 'Crianças são bem-vindas' : 'Por gentileza, não levar crianças'}
        </span>
      </div>

      {manualData?.whatsapp && (
        <div className="contacto">
          <Phone size={14} />
          <span>Confirmar presença: {manualData.whatsapp}</span>
        </div>
      )}

      <div className="qr-code">
        <img src={qrCodeUrl} alt="QR Code" />
        <p>Escaneie o QR Code para confirmar presença</p>
      </div>

      {declaracaoData?.mensagem && (
        <div className="declaracao-mensagem">
          <Heart size={12} />
          <span>{declaracaoData.mensagem}</span>
        </div>
      )}

      <div className="floral-bottom">
        <Flower2 size={16} />
        <Heart size={14} />
        <Flower2 size={16} />
      </div>
    </div>
  );
};

export default TemplateReligioso;