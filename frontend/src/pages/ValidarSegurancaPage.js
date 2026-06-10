import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../services/api';
import { Camera, Upload, QrCode } from 'lucide-react';
import './ValidarSegurancaPage.css';

const ValidarSegurancaPage = () => {
  const [convite, setConvite] = useState(null);
  const [qrInput, setQrInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [usuario, setUsuario] = useState(null);
  const [modo, setModo] = useState('camera'); // 'camera', 'upload', 'manual'
  const [cameraAtiva, setCameraAtiva] = useState(false);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar se está logado
    if (!ApiService.isAutenticado()) {
      navigate('/login');
    } else {
      setUsuario(ApiService.getUsuario());
    }
    
    // Limpar câmera ao desmontar
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [navigate]);

  // Iniciar câmera
  const iniciarCamera = async () => {
    setCameraAtiva(true);
    setModo('camera');
    
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Câmera traseira
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Erro ao acessar câmera:', err);
      setMensagem('❌ Não foi possível acessar a câmera. Verifique as permissões.');
      setCameraAtiva(false);
    }
  };

  // Parar câmera
  const pararCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraAtiva(false);
  };

  // Processar imagem (captura ou upload) e ler QR Code
  const processarImagem = async (imageData) => {
    setLoading(true);
    setMensagem('');
    setConvite(null);
    
    try {
      // Usar API externa para ler QR Code da imagem
      const blob = await fetch(imageData).then(res => res.blob());
      const formData = new FormData();
      formData.append('file', blob, 'qrcode.png');
      
      const response = await fetch('https://api.qrserver.com/v1/read-qr-code/', {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json();
      
      if (result[0]?.symbol[0]?.data) {
        const qrCodeLido = result[0].symbol[0].data;
        // Extrair o código da URL (última parte)
        let codigoExtraido;
        if (qrCodeLido.includes('/convite/')) {
          codigoExtraido = qrCodeLido.split('/convite/')[1];
        } else {
          codigoExtraido = qrCodeLido;
        }
        
        await validarConvite(codigoExtraido);
      } else {
        setMensagem('❌ Nenhum QR Code encontrado na imagem. Tente novamente.');
        setLoading(false);
      }
    } catch (err) {
      console.error('Erro ao processar imagem:', err);
      setMensagem('❌ Erro ao ler QR Code da imagem. Tente novamente.');
      setLoading(false);
    }
  };

  // Capturar foto da câmera
  const capturarFoto = async () => {
    if (!videoRef.current) return;
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Converter para base64
    const imageData = canvas.toDataURL('image/png');
    await processarImagem(imageData);
  };

  // Upload de imagem
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      setMensagem('❌ Por favor, selecione uma imagem (PNG, JPG, JPEG)');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      await processarImagem(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const validarConvite = async (codigo) => {
    if (!codigo.trim()) {
      setMensagem('❌ Digite ou escaneie um QR Code');
      setLoading(false);
      return;
    }

    try {
      const data = await ApiService.validarConviteSeguranca(codigo);
      
      if (data.valido) {
        setConvite(data.convite);
        setMensagem('✅ Convite VÁLIDO! Pode entrar.');
        
        // Marcar como utilizado
        await ApiService.utilizarConviteSeguranca(codigo);
      } else {
        setConvite(null);
        setMensagem(`❌ ${data.mensagem}`);
      }
    } catch (error) {
      if (error.message.includes('Sessão expirada')) {
        navigate('/login');
      } else {
        setMensagem('❌ Erro ao validar convite');
      }
    } finally {
      setLoading(false);
      setQrInput('');
      // Parar câmera após validação
      if (modo === 'camera') {
        pararCamera();
      }
    }
  };

  const handleValidarManual = () => {
    validarConvite(qrInput);
  };

  const handleLogout = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    ApiService.logout();
    navigate('/login');
  };

  const limpar = () => {
    setConvite(null);
    setMensagem('');
    setQrInput('');
  };

  return (
    <div className="validar-seguranca-page">
      <div className="validar-container">
        <div className="validar-header">
          <h1>Validação de Convites</h1>
          <div className="header-actions">
            <span className="usuario-badge">{usuario?.nome || 'Segurança'}</span>
            <button onClick={handleLogout} className="btn-logout">Sair</button>
          </div>
        </div>

        <div className="validar-card">
          {/* Seletor de Modo */}
          <div className="mode-selector">
            <button 
              className={`mode-btn ${modo === 'camera' ? 'active' : ''}`}
              onClick={() => {
                setModo('camera');
                setMensagem('');
                setConvite(null);
              }}
            >
              <Camera size={16} />
              Câmera
            </button>
            <button 
              className={`mode-btn ${modo === 'upload' ? 'active' : ''}`}
              onClick={() => {
                setModo('upload');
                setMensagem('');
                setConvite(null);
              }}
            >
              <Upload size={16} />
              Upload
            </button>
            <button 
              className={`mode-btn ${modo === 'manual' ? 'active' : ''}`}
              onClick={() => {
                setModo('manual');
                setMensagem('');
                setConvite(null);
              }}
            >
              <QrCode size={16} />
              Manual
            </button>
          </div>

          {/* Modo Câmera */}
          {modo === 'camera' && (
            <div className="camera-section">
              {!cameraAtiva ? (
                <div className="camera-placeholder">
                  <Camera size={48} />
                  <p>Clique para ativar a câmera</p>
                  <button onClick={iniciarCamera} className="btn-iniciar-camera">
                    Ativar Câmera
                  </button>
                </div>
              ) : (
                <div className="camera-active">
                  <video ref={videoRef} autoPlay playsInline className="video-preview" />
                  <canvas ref={canvasRef} style={{ display: 'none' }} />
                  <div className="camera-actions">
                    <button onClick={capturarFoto} className="btn-capturar" disabled={loading}>
                      <Camera size={16} />
                      Escanear QR Code
                    </button>
                    <button onClick={pararCamera} className="btn-fechar-camera">
                      Fechar Câmera
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Modo Upload */}
          {modo === 'upload' && (
            <div className="upload-section">
              <div className="upload-area" onClick={triggerFileInput}>
                <Upload size={32} />
                <p>Clique para fazer upload da imagem do QR Code</p>
                <small>Formatos: PNG, JPG, JPEG</small>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
            </div>
          )}

          {/* Modo Manual */}
          {modo === 'manual' && (
            <div className="input-area">
              <h3>Digite o código manualmente</h3>
              <div className="input-group">
                <input
                  type="text"
                  value={qrInput}
                  onChange={(e) => setQrInput(e.target.value)}
                  placeholder="Digite ou cole o código QR aqui"
                  className="qr-input"
                  disabled={loading}
                />
                <button onClick={handleValidarManual} className="btn-validar" disabled={loading}>
                  {loading ? 'Validando...' : 'Validar'}
                </button>
              </div>
            </div>
          )}

          {/* Mensagem */}
          {mensagem && (
            <div className={`mensagem ${mensagem.includes('VÁLIDO') ? 'success' : 'error'}`}>
              {mensagem}
            </div>
          )}

          {/* Informações do Convite */}
          {convite && (
            <div className="convite-info">
              <h3>Informações do Convidado</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="label">Convidado:</span>
                  <span className="value">{convite.nome_convidado1}</span>
                </div>
                {convite.nome_convidado2 && (
                  <div className="info-item">
                    <span className="label">Acompanhante:</span>
                    <span className="value">{convite.nome_convidado2}</span>
                  </div>
                )}
                <div className="info-item">
                  <span className="label">Evento:</span>
                  <span className="value">{convite.nome_evento || 'Não informado'}</span>
                </div>
                <div className="info-item">
                  <span className="label">Data:</span>
                  <span className="value">
                    {convite.data_evento ? new Date(convite.data_evento).toLocaleDateString('pt-BR') : 'Não informada'}
                  </span>
                </div>
                <div className="info-item">
                  <span className="label">Status:</span>
                  <span className="value">{convite.utilizado === 1 ? 'Utilizado' : 'Válido'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Botão Limpar (quando houver resultado) */}
          {(convite || mensagem) && (
            <div className="limpar-section">
              <button onClick={limpar} className="btn-limpar">
                Limpar
              </button>
            </div>
          )}
        </div>

        <div className="validar-footer">
          <p>Escaneie o QR Code do convite para validar a entrada</p>
        </div>
      </div>
    </div>
  );
};

export default ValidarSegurancaPage;