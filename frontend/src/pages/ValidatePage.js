import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApiService from '../services/api';
import { isAutenticado } from '../utils/authUtils';
import { CheckCircle, XCircle, RefreshCw, User, Calendar, ExternalLink, Home } from 'lucide-react';
import './ValidatePage.css';

function ValidatePage() {
  const { qrCode } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [validacao, setValidacao] = useState(null);
  const [error, setError] = useState('');
  const [utilizando, setUtilizando] = useState(false);

  // Verificar autenticação
  useEffect(() => {
    if (!isAutenticado()) {
      navigate('/login');
      return;
    }
    
    if (qrCode) {
      verificarConvite();
    }
  }, [qrCode]);

  const verificarConvite = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('🔍 Verificando convite (segurança):', qrCode);
      
      // Usar o método protegido
      const resultado = await ApiService.validarConviteSeguranca(qrCode);
      setValidacao(resultado);
      
    } catch (err) {
      console.error('Erro ao verificar convite:', err);
      if (err.message.includes('Sessão expirada')) {
        navigate('/login');
      } else {
        setError(err.message || 'Erro ao verificar convite. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const utilizarConvite = async () => {
    try {
      setUtilizando(true);
      console.log('🎫 Utilizando convite (segurança):', qrCode);
      
      // Usar o método protegido
      await ApiService.utilizarConviteSeguranca(qrCode);
      
      // Atualizar a validação após uso
      const novaValidacao = await ApiService.validarConviteSeguranca(qrCode);
      setValidacao(novaValidacao);
      
    } catch (err) {
      console.error('Erro ao utilizar convite:', err);
      if (err.message.includes('Sessão expirada')) {
        navigate('/login');
      } else {
        setError('Erro ao validar convite. Tente novamente.');
      }
    } finally {
      setUtilizando(false);
    }
  };

  const voltarParaInicio = () => {
    navigate('/');
  };

  const abrirGerenciamento = () => {
    // Verificar se é admin para abrir gerenciamento
    const usuario = ApiService.getUsuario();
    if (usuario?.role === 'admin') {
      navigate('/gerenciar');
    } else {
      navigate('/validar-seguranca');
    }
  };

  if (loading) {
    return (
      <div className="validate-page">
        <div className="validate-container">
          <div className="loading-state">
            <RefreshCw size={48} className="spinner" />
            <h2>Verificando Convite...</h2>
            <p>Por favor, aguarde</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="validate-page">
      <div className="validate-container">
        {/* Cabeçalho */}
        <div className="validate-header">
          <h1>🔒 Validação de Convite</h1>
          <p>Área restrita - Apenas pessoal autorizado</p>
        </div>

        {/* Código QR Verificado */}
        <div className="qr-code-info">
          <p><strong>Código Verificado:</strong></p>
          <code>{qrCode}</code>
        </div>

        {/* Resultado da Validação */}
        {validacao && (
          <div className={`validation-result ${validacao.valido ? 'valid' : 'invalid'}`}>
            <div className="result-icon">
              {validacao.valido ? (
                <CheckCircle size={64} />
              ) : (
                <XCircle size={64} />
              )}
            </div>
            
            <h2>
              {validacao.valido ? '✅ Convite Válido!' : '❌ Convite Inválido'}
            </h2>

            {validacao.valido && validacao.convite ? (
              <div className="convite-details">
                <h3>Detalhes do Convite</h3>
                <div className="detail-item">
                  <User size={20} />
                  <div>
                    <strong>Convidado Principal:</strong>
                    <span>{validacao.convite.nome_convidado1}</span>
                  </div>
                </div>
                
                {validacao.convite.nome_convidado2 && (
                  <div className="detail-item">
                    <User size={20} />
                    <div>
                      <strong>Acompanhante:</strong>
                      <span>{validacao.convite.nome_convidado2}</span>
                    </div>
                  </div>
                )}
                
                <div className="detail-item">
                  <Calendar size={20} />
                  <div>
                    <strong>Data de Criação:</strong>
                    <span>{new Date(validacao.convite.data_criacao).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>

                <div className="detail-item status">
                  <CheckCircle size={20} />
                  <div>
                    <strong>Status:</strong>
                    <span className={`status-badge ${validacao.valido ? 'valid' : 'used'}`}>
                      {validacao.valido ? '🟢 Disponível' : '🔴 Utilizado'}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="error-message">
                <p>{validacao.mensagem}</p>
              </div>
            )}

            {/* Botão de Ação */}
            {validacao.valido && (
              <div className="action-section">
                <p className="action-info">
                  Este convite está válido e pronto para ser utilizado.
                </p>
                <button 
                  onClick={utilizarConvite}
                  disabled={utilizando}
                  className="btn btn-success btn-large"
                >
                  {utilizando ? (
                    <>
                      <RefreshCw size={20} className="spinner" />
                      Validando...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={20} />
                      Validar Convite
                    </>
                  )}
                </button>
                <p className="action-warning">
                  ⚠️ Esta ação marcará o convite como utilizado e não poderá ser desfeita.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Mensagem de Sucesso após validação */}
        {validacao && !validacao.valido && validacao.mensagem?.includes('sucesso') && (
          <div className="success-message">
            <CheckCircle size={32} />
            <h3>Convite Validado com Sucesso!</h3>
            <p>Este convite já foi utilizado anteriormente.</p>
          </div>
        )}

        {/* Erro */}
        {error && (
          <div className="error-state">
            <XCircle size={48} />
            <h2>Erro na Validação</h2>
            <p>{error}</p>
            <button onClick={verificarConvite} className="btn btn-primary">
              <RefreshCw size={16} />
              Tentar Novamente
            </button>
          </div>
        )}

        {/* Botões de Navegação */}
        <div className="navigation-actions">
          <button onClick={voltarParaInicio} className="btn btn-secondary">
            <Home size={16} />
            Página Inicial
          </button>
          <button onClick={abrirGerenciamento} className="btn btn-primary">
            <ExternalLink size={16} />
            Gerenciar Convites
          </button>
        </div>
      </div>
    </div>
  );
}

export default ValidatePage;