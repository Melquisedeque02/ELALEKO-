import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../services/api';
import './ComprarCreditosPage.css';

const ComprarCreditosPage = () => {
  const [quantidade, setQuantidade] = useState(5);
  const [pacotes, setPacotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comprando, setComprando] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    carregarPrecos();
  }, []);

  const carregarPrecos = async () => {
    try {
      setLoading(true);
      const configs = await ApiService.getConfiguracoes();
      console.log('Configurações carregadas:', configs);
      
      let precosPacotes = [];
      if (configs && configs.precos_pacotes) {
        if (typeof configs.precos_pacotes === 'string') {
          precosPacotes = JSON.parse(configs.precos_pacotes);
        } else {
          precosPacotes = configs.precos_pacotes;
        }
      }
      
      if (precosPacotes.length === 0) {
        // Preços padrão
        precosPacotes = [
          { creditos: 1, preco: 1.99 },
          { creditos: 5, preco: 9.00 },
          { creditos: 10, preco: 15.00 },
          { creditos: 20, preco: 25.00 }
        ];
      }
      
      setPacotes(precosPacotes);
      if (precosPacotes.length > 0) {
        setQuantidade(precosPacotes[0].creditos);
      }
    } catch (error) {
      console.error('Erro ao carregar preços:', error);
      // Preços padrão em caso de erro
      setPacotes([
        { creditos: 1, preco: 1.99 },
        { creditos: 5, preco: 9.00 },
        { creditos: 10, preco: 15.00 },
        { creditos: 20, preco: 25.00 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCompra = async () => {
    setComprando(true);
    setMensagem('');
    try {
      await ApiService.comprarCreditos(quantidade);
      setMensagem(`✅ ${quantidade} crédito(s) adicionado(s) com sucesso!`);
      setTimeout(() => navigate('/organizador/dashboard'), 1500);
    } catch (error) {
      setMensagem(`❌ ${error.message || 'Erro ao comprar créditos'}`);
    } finally {
      setComprando(false);
    }
  };

  const pacoteSelecionado = pacotes.find(p => p.creditos === quantidade);
  const precoTotal = pacoteSelecionado ? pacoteSelecionado.preco : (quantidade * 1.99).toFixed(2);

  if (loading) {
    return <div className="loading-container"><div className="loading-spinner"></div><p>Carregando...</p></div>;
  }

  return (
    <div className="comprar-creditos-page">
      <div className="container">
        <h1>💰 Comprar Créditos</h1>
        <p className="subtitle">1 crédito = 1 geração de template IA</p>

        <div className="pacotes">
          {pacotes.map(pacote => (
            <button
              key={pacote.creditos}
              className={`pacote-btn ${quantidade === pacote.creditos ? 'active' : ''}`}
              onClick={() => setQuantidade(pacote.creditos)}
            >
              <span className="creditos">{pacote.creditos} crédito(s)</span>
              <span className="preco">${pacote.preco.toFixed(2)}</span>
              <span className="preco-por-credito">${(pacote.preco / pacote.creditos).toFixed(2)}/crédito</span>
            </button>
          ))}
        </div>

        <div className="total-section">
          <strong>Total: ${precoTotal}</strong>
          <small>(modo simulação – sem cobrança real)</small>
        </div>

        <button onClick={handleCompra} disabled={comprando} className="btn-comprar">
          {comprando ? 'Processando...' : `Comprar ${quantidade} crédito(s)`}
        </button>

        {mensagem && <div className={`mensagem ${mensagem.includes('✅') ? 'success' : 'error'}`}>{mensagem}</div>}
      </div>
    </div>
  );
};

export default ComprarCreditosPage;