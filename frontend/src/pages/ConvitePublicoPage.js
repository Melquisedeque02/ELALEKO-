import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import GoogleMap from '../components/GoogleMap/GoogleMap';
import ManualConvidado from '../components/ManualConvidado/ManualConvidado';
import DeclaracaoNoivos from '../components/DeclaracaoNoivos/DeclaracaoNoivos';
import ApiService from '../services/api';
import './ConvitePublicoPage.css';

const ConvitePublicoPage = () => {
  const { qrCode } = useParams();
  const [localizacao, setLocalizacao] = useState(null);
  const [manualData, setManualData] = useState(null);
  const [declaracaoData, setDeclaracaoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    carregarLocalizacao();
  }, [qrCode]);

  const carregarLocalizacao = async () => {
    try {
      const data = await ApiService.buscarLocalizacaoPublica(qrCode);
      if (data.localizacao) {
        setLocalizacao(data.localizacao);
        
        // Carregar manual e declaração se existirem
        if (data.localizacao.manual) {
          try {
            setManualData(JSON.parse(data.localizacao.manual));
          } catch(e) { console.error(e); }
        }
        if (data.localizacao.declaracao) {
          try {
            setDeclaracaoData(JSON.parse(data.localizacao.declaracao));
          } catch(e) { console.error(e); }
        }
      } else {
        setErro('Convite não encontrado');
      }
    } catch (error) {
      setErro('Erro ao carregar informações');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="publico-page">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="publico-page">
        <div className="error-container">
          <h2>Convite Inválido</h2>
          <p>{erro}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="publico-page">
      <div className="publico-container">
        <div className="publico-header">
          <h1>Localização do Evento</h1>
          <p>Escaneie este QR Code na entrada do evento</p>
        </div>

        <div className="publico-card">
          <div className="evento-info">
            <h2>{localizacao?.nome_evento || 'Evento'}</h2>
            <p className="evento-data">
              {localizacao?.data_evento && (
                <>📅 {new Date(localizacao.data_evento).toLocaleDateString('pt-BR')}</>
              )}
              {localizacao?.hora_evento && (
                <> ⏰ {localizacao.hora_evento}</>
              )}
            </p>
          </div>

          {localizacao?.endereco && (
            <div className="map-container">
              <GoogleMap 
                address={localizacao.endereco}
                locationName={localizacao.nome_evento}
              />
            </div>
          )}

          {/* Manual do Convidado */}
          {manualData && (
            <div className="manual-container">
              <ManualConvidado manual={manualData} isViewMode={true} />
            </div>
          )}

          {/* Declaração dos Noivos */}
          {declaracaoData && declaracaoData.mensagem && (
            <div className="declaracao-container">
              <DeclaracaoNoivos declaracao={declaracaoData} isViewMode={true} />
            </div>
          )}

          <div className="publico-footer">
            <p>Apresente este QR Code ao segurança na entrada</p>
            <p className="footer-small">Elaleko - Convite Digital</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConvitePublicoPage;