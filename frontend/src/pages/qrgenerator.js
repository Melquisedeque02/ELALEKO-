// src/components/QRCode/QRCodeGenerator.jsx
/*import React, { useState, useEffect } from 'react';

const QRCodeGenerator = ({ data, size = 150, showLoader = true }) => {
  const [qrImage, setQrImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    generateQRCode();
  }, [data, size]);

  const generateQRCode = async () => {
    try {
      setLoading(true);
      setError(null);

      // Carrega a biblioteca QRCode
      const scriptId = 'qrcode-script';
      let script = document.getElementById(scriptId);
      
      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcode.js/1.5.3/qrcode.min.js';
        document.body.appendChild(script);
      }

      // Aguarda a biblioteca estar disponível
      const waitForQRCode = () => {
        return new Promise((resolve) => {
          if (window.QRCode) {
            resolve();
          } else {
            setTimeout(waitForQRCode, 100);
          }
        });
      };

      await waitForQRCode();

      // Cria o container e gera o QR Code
      const container = document.createElement('div');
      new window.QRCode(container, {
        text: typeof data === 'string' ? data : JSON.stringify(data),
        width: size,
        height: size,
        correctLevel: window.QRCode.CorrectLevel.H,
      });

      // Extrai a imagem após geração
      setTimeout(() => {
        const img = container.querySelector('img');
        if (img) {
          setQrImage(img.src);
          setLoading(false);
        } else {
          throw new Error('Falha ao gerar QR Code');
        }
      }, 200);
    } catch (err) {
      console.error('Erro ao gerar QR Code:', err);
      setError('Erro ao gerar QR Code');
      setLoading(false);
    }
  };

  if (loading && showLoader) {
    return (
      <div
        style={{
          width: size,
          height: size,
          background: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px',
          color: '#999',
          fontSize: '12px'
        }}
      >
        Carregando...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          width: size,
          height: size,
          background: '#ffe0e0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px',
          color: '#d32f2f',
          fontSize: '12px',
          textAlign: 'center',
          padding: '8px'
        }}
      >
        {error}
      </div>
    );
  }

  if (!qrImage) {
    return null;
  }

  return (
    <img
      src={qrImage}
      alt="QR Code"
      style={{
        width: size,
        height: size,
        borderRadius: '8px',
        cursor: 'pointer'
      }}
      title="QR Code do Convite"
    />
  );
};

export default QRCodeGenerator;*/