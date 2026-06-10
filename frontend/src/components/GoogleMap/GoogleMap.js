import React, { useState, useEffect } from 'react';
import './GoogleMap.css';

const GoogleMap = ({ address, locationName, onLocationChange }) => {
  const [searchAddress, setSearchAddress] = useState(address || '');
  const [sugestoes, setSugestoes] = useState([]);
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
  const [buscando, setBuscando] = useState(false);

  // Buscar localizações com suporte a nomes de estabelecimentos
  const buscarLocais = async (query) => {
    if (!query.trim() || query.length < 3) {
      setSugestoes([]);
      return;
    }

    setBuscando(true);
    
    try {
      // Usando Nominatim (OpenStreetMap) para busca de locais
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1`
      );
      const data = await response.json();
      
      const resultados = data.map(item => ({
        nome: item.display_name.split(',')[0],
        endereco_completo: item.display_name,
        lat: item.lat,
        lon: item.lon
      }));
      
      setSugestoes(resultados);
      setMostrarSugestoes(true);
    } catch (error) {
      console.error('Erro na busca:', error);
      setSugestoes([]);
    } finally {
      setBuscando(false);
    }
  };

  // Debounce para busca
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchAddress) {
        buscarLocais(searchAddress);
      }
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [searchAddress]);

  const selecionarLocal = (local) => {
    setSearchAddress(local.endereco_completo);
    setMostrarSugestoes(false);
    if (onLocationChange) onLocationChange(local.endereco_completo);
  };

  const handleSaveAddress = () => {
    if (onLocationChange && searchAddress) {
      onLocationChange(searchAddress);
      setMostrarSugestoes(false);
    }
  };

  const getNavigationUrl = (addr) => {
    if (!addr) return '#';
    const encodedAddress = encodeURIComponent(addr);
    return `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
  };

  return (
    <div className="google-map-component">
      <div className="map-address-input">
        <label className="map-label">
           Local do Evento
        </label>
        <div className="address-input-group">
          <div className="search-container">
            <input
              type="text"
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              onFocus={() => sugestoes.length > 0 && setMostrarSugestoes(true)}
              placeholder="Digite o endereço ou nome do salão (ex: Espaço Villa Lobos)"
              className="address-input"
            />
            {buscando && <span className="search-spinner"></span>}
            {mostrarSugestoes && sugestoes.length > 0 && (
              <div className="sugestoes-dropdown">
                {sugestoes.map((sug, index) => (
                  <div 
                    key={index} 
                    className="sugestao-item"
                    onClick={() => selecionarLocal(sug)}
                  >
                    <strong>{sug.nome}</strong>
                    <small>{sug.endereco_completo.substring(0, 80)}...</small>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={handleSaveAddress}
            className="btn-save-address"
          >
            Salvar
          </button>
        </div>
        <p className="map-hint">
          Ex: Espaço Monte Verde, Salão de Festas Villa Lobos, Rua das Flores, 123
        </p>
      </div>

      {address && (
        <div className="map-preview">
          <div className="map-header">
            <span className="map-title"> {locationName || 'Local do Evento'}</span>
          </div>
          <div className="map-link-container">
            <a
              href={getNavigationUrl(address)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-navigate"
            >
               Abrir no Google Maps
            </a>
            <p className="map-address-display">{address}</p>
          </div>
          <div className="map-actions">
            <button 
              onClick={() => {
                navigator.clipboard.writeText(address);
                alert('Endereço copiado!');
              }}
              className="btn-copy"
            >
               Copiar Endereço
            </button>
          </div>
        </div>
      )}

      {!address && (
        <div className="map-tip">
          <span className="tip-icon"></span>
          <span className="tip-text">
            Adicione o endereço do evento para que os convidados possam ver o local
          </span>
        </div>
      )}
    </div>
  );
};

export default GoogleMap;