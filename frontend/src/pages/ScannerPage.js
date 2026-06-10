import React, { useState, useRef } from 'react';
import { useModal } from '../hooks/useModal';
import Modal from '../components/Common/Modal';
import ApiService from '../services/api';
import { 
  QrCode, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  User, 
  Calendar, 
  Smartphone,
  Upload
} from 'lucide-react';
import './ScannerPage.css';

const ScannerPage = () => {
  const [loading, setLoading] = useState(false);
  const [qrInput, setQrInput] = useState('');
  const [ultimoConvite, setUltimoConvite] = useState(null);
  const [mostrarBotaoUtilizar, setMostrarBotaoUtilizar] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [processandoImagem, setProcessandoImagem] = useState(false);
  const fileInputRef = useRef(null);
  const modal = useModal();

  // Carregar biblioteca para ler QR Code de imagens
  const carregarJsQR = async () => {
    try {
      const module = await import('jsqr');
      return module.default;
    } catch (error) {
      console.error('Erro ao carregar JsQR:', error);
      throw new Error('Biblioteca de leitura de QR Code não disponível');
    }
  };

  // Extrair código da URL do QR Code
  const extrairCodigoQR = (texto) => {
    // Se for URL completa, extrai o código
    if (texto.includes('/convite/')) {
      return texto.split('/convite/')[1];
    }
    return texto;
  };

  // Processar QR Code de imagem
  const processarImagemQRCode = async (file) => {
    setProcessandoImagem(true);
    setImagePreview(URL.createObjectURL(file));
    
    try {
      const JsQR = await carregarJsQR();
      
      return new Promise((resolve, reject) => {
        const img = new Image();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        img.onload = () => {
          try {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = JsQR(imageData.data, imageData.width, imageData.height);
            
            if (code) {
              console.log('QR Code encontrado na imagem:', code.data);
              // Extrair apenas o código da URL
              const codigoExtraido = extrairCodigoQR(code.data);
              resolve(codigoExtraido);
            } else {
              reject(new Error('Nenhum QR Code encontrado na imagem.'));
            }
          } catch (error) {
            reject(new Error('Erro ao processar a imagem: ' + error.message));
          }
        };

        img.onerror = () => {
          reject(new Error('Erro ao carregar a imagem. Tente com outra imagem.'));
        };

        img.src = URL.createObjectURL(file);
      });

    } catch (error) {
      console.error('Erro no processamento:', error);
      throw error;
    }
  };

  // Primeira validação (usa método protegido)
  const validarConvite = async (qrCode) => {
    if (!qrCode || loading) return;

    setLoading(true);
    setUltimoConvite(null);
    setMostrarBotaoUtilizar(false);
    setImagePreview(null);

    try {
      // Extrair apenas o código se for URL completa
      const codigoLimpo = extrairCodigoQR(qrCode);
      console.log('🔍 Validando QR Code (protegido):', codigoLimpo);
      
      // USAR O MÉTODO PROTEGIDO (para admin)
      const validacao = await ApiService.validarConviteSeguranca(codigoLimpo);
      
      if (validacao.valido) {
        setUltimoConvite({
          ...validacao.convite,
          qrCode: codigoLimpo,
          sucesso: true,
          mensagem: 'Convite válido! Clique em "Validar Convite" para confirmar a utilização.',
          podeUtilizar: true
        });
        setMostrarBotaoUtilizar(true);
      } else {
        setUltimoConvite({
          qrCode: codigoLimpo,
          sucesso: false,
          mensagem: validacao.mensagem,
          podeUtilizar: false
        });
        setMostrarBotaoUtilizar(false);
      }

    } catch (error) {
      console.error('Erro ao validar convite:', error);
      let mensagemErro = 'Erro ao conectar com o servidor. Verifique sua conexão.';
      
      if (error.message.includes('Convite não encontrado')) {
        mensagemErro = 'QR Code não encontrado na base de dados.';
      } else if (error.message.includes('Sessão expirada')) {
        mensagemErro = 'Sessão expirada. Faça login novamente.';
      }
      
      setUltimoConvite({
        qrCode: qrCode,
        sucesso: false,
        mensagem: mensagemErro,
        podeUtilizar: false
      });
      setMostrarBotaoUtilizar(false);
    } finally {
      setLoading(false);
      setProcessandoImagem(false);
    }
  };

  // Marcar como utilizado (usa método protegido)
  const utilizarConvite = async () => {
    if (!ultimoConvite) return;

    try {
      setLoading(true);
      console.log('🎫 Marcando convite como utilizado:', ultimoConvite.qrCode);
      
      await ApiService.utilizarConviteSeguranca(ultimoConvite.qrCode);
      
      setUltimoConvite(prev => ({
        ...prev,
        mensagem: '✅ Convite validado e marcado como utilizado com sucesso!',
        podeUtilizar: false
      }));
      setMostrarBotaoUtilizar(false);
      
      modal.openModal({
        title: '✅ Convite Validado!',
        message: `Convite de ${ultimoConvite.nome_convidado1} marcado como utilizado com sucesso!`,
        type: 'success',
        confirmText: 'OK'
      });

    } catch (error) {
      console.error('Erro ao utilizar convite:', error);
      modal.openModal({
        title: '❌ Erro',
        message: 'Erro ao marcar convite como utilizado. Tente novamente.',
        type: 'danger',
        confirmText: 'OK'
      });
    } finally {
      setLoading(false);
    }
  };

  // Upload de imagem
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      modal.openModal({
        title: 'Formato Inválido',
        message: 'Por favor, selecione um arquivo de imagem (PNG, JPG, JPEG).',
        type: 'warning',
        confirmText: 'OK'
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      modal.openModal({
        title: 'Arquivo Muito Grande',
        message: 'A imagem deve ter no máximo 5MB.',
        type: 'warning',
        confirmText: 'OK'
      });
      return;
    }

    try {
      const qrCode = await processarImagemQRCode(file);
      await validarConvite(qrCode);
      
    } catch (error) {
      console.error('Erro no upload:', error);
      modal.openModal({
        title: 'Erro na Imagem',
        message: error.message || 'Não foi possível ler o QR Code da imagem.',
        type: 'warning',
        confirmText: 'OK'
      });
      setProcessandoImagem(false);
      setImagePreview(null);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (qrInput.trim()) {
      validarConvite(qrInput.trim());
      setQrInput('');
    }
  };

  const limparResultado = () => {
    setUltimoConvite(null);
    setMostrarBotaoUtilizar(false);
    setImagePreview(null);
  };

  return (
    <div className="scanner-page">
      <div className="scanner-container">
        <div className="scanner-header">
          <h1>
            <Smartphone size={32} />
            Validação Rápida (Admin)
          </h1>
          <p>Faça upload da imagem do QR Code ou digite o código</p>
        </div>

        {/* Upload de Imagem */}
        <div className="upload-section">
          <h3>
            <Upload size={20} />
            Upload de Imagem QR Code
          </h3>
          <div className="upload-area" onClick={triggerFileInput}>
            {processandoImagem ? (
              <div className="processing-image">
                <RefreshCw size={48} className="spinner" />
                <p>Processando imagem...</p>
                <small>Analisando QR Code...</small>
              </div>
            ) : imagePreview ? (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview QR Code" />
                <div className="image-preview-actions">
                  <p>Imagem carregada ✓</p>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setImagePreview(null);
                    }}
                    className="btn btn-secondary btn-sm"
                  >
                    Trocar Imagem
                  </button>
                </div>
              </div>
            ) : (
              <div className="upload-placeholder">
                <Upload size={48} />
                <p>Clique para fazer upload de uma imagem com QR Code</p>
                <small>Formatos: PNG, JPG, JPEG - Máx: 5MB</small>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
          </div>
        </div>

        {/* Divisor */}
        <div className="divider">
          <span>OU</span>
        </div>

        {/* Entrada Manual */}
        <div className="input-section">
          <h3>
            <QrCode size={20} />
            Digite o código manualmente
          </h3>
          <form onSubmit={handleManualSubmit} className="qr-input-form">
            <div className="input-group">
              <input
                type="text"
                value={qrInput}
                onChange={(e) => setQrInput(e.target.value)}
                placeholder="Cole ou digite o código QR aqui..."
                className="qr-input"
                disabled={loading || processandoImagem}
              />
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading || processandoImagem || !qrInput.trim()}
              >
                {loading ? <RefreshCw size={16} className="spinner" /> : <CheckCircle size={16} />}
                {loading ? 'Validando...' : 'Verificar'}
              </button>
            </div>
          </form>
        </div>

        {/* Resultado da Validação */}
        {ultimoConvite && (
          <div className={`convite-result ${ultimoConvite.sucesso ? 'success' : 'error'}`}>
            <div className="result-header">
              {ultimoConvite.sucesso ? (
                <CheckCircle size={24} className="result-icon success" />
              ) : (
                <XCircle size={24} className="result-icon error" />
              )}
              <h3>
                {ultimoConvite.sucesso ? 'Convite Válido!' : 'Convite Inválido'}
              </h3>
            </div>
            
            <div className="qr-code-scanned">
              <strong>Código:</strong> 
              <code>{ultimoConvite.qrCode}</code>
            </div>
            
            {ultimoConvite.sucesso && ultimoConvite.nome_convidado1 && (
              <div className="convite-details">
                <div className="detail-item">
                  <User size={16} />
                  <span>
                    <strong>Convidado:</strong> {ultimoConvite.nome_convidado1}
                  </span>
                </div>
                {ultimoConvite.nome_convidado2 && (
                  <div className="detail-item">
                    <User size={16} />
                    <span>
                      <strong>Acompanhante:</strong> {ultimoConvite.nome_convidado2}
                  </span>
                  </div>
                )}
                {ultimoConvite.data_criacao && (
                  <div className="detail-item">
                    <Calendar size={16} />
                    <span>
                      <strong>Data do Convite:</strong> {new Date(ultimoConvite.data_criacao).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                )}
                <div className="detail-item status">
                  <CheckCircle size={16} />
                  <span>
                    <strong>Status:</strong> {ultimoConvite.podeUtilizar ? '🟢 Disponível para uso' : '🔴 Já utilizado'}
                  </span>
                </div>
              </div>
            )}
            
            <div className="result-message">
              <p>{ultimoConvite.mensagem}</p>
            </div>
            
            <div className="result-actions">
              {mostrarBotaoUtilizar && (
                <button 
                  onClick={utilizarConvite} 
                  className="btn btn-success"
                  disabled={loading}
                >
                  {loading ? <RefreshCw size={16} className="spinner" /> : <CheckCircle size={16} />}
                  {loading ? 'Validando...' : 'Validar Convite'}
                </button>
              )}
              
              <button onClick={limparResultado} className="btn btn-primary">
                <RefreshCw size={16} />
                Verificar Outro
              </button>
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={modal.isOpen}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        confirmText={modal.confirmText}
        cancelText={modal.cancelText}
        onConfirm={modal.onConfirm}
        onCancel={modal.closeModal}
      />
    </div>
  );
};

export default ScannerPage;