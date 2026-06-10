import React, { useState, useEffect } from 'react';

const PreviewInvitePage = () => {
  // Mock data - em produção isso viria de props
  const invite = {
    id: 1,
    eventName: 'Casamento de Ana e Carlos',
    eventDate: '2025-12-20',
    eventTime: '19:30',
    eventLocation: 'Salão de Festas Ouro Branco - Rua das Flores, 123',
    description: 'Você está convidado para celebrar conosco este momento especial!',
    guestName1: 'João Silva',
    guestName2: 'Maria Silva',
    guests: ['João Silva', 'Maria Silva']
  };

  const [qrImage, setQrImage] = useState(null);

  useEffect(() => {
    generateQRCode();
  }, []);

  const generateQRCode = async () => {
    try {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcode.js/1.5.3/qrcode.min.js';
      script.onload = () => {
        const container = document.createElement('div');
        new window.QRCode(container, {
          text: JSON.stringify(invite),
          width: 150,
          height: 150,
        });
        setTimeout(() => {
          const img = container.querySelector('img');
          if (img) setQrImage(img.src);
        }, 100);
      };
      document.body.appendChild(script);
    } catch (err) {
      console.error('Erro ao gerar QR Code:', err);
    }
  };

  const handleDownload = async () => {
    try {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
      script.onload = () => {
        const element = document.getElementById('invite-card');
        window.html2canvas(element, { scale: 2, backgroundColor: '#ffffff' }).then(canvas => {
          const link = document.createElement('a');
          link.href = canvas.toDataURL('image/png');
          link.download = `Convite_${invite.eventName}_${Date.now()}.png`;
          link.click();
        });
      };
      document.body.appendChild(script);
    } catch (err) {
      console.error('Erro ao fazer download:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🎉 Digital Invites</h1>
          <p className="text-gray-600">Crie e gerencie seus convites digitais com QR Code</p>
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mb-6">Pré-visualização do Convite</h2>

        <div
          id="invite-card"
          className="rounded-lg shadow-2xl p-8 text-white mb-6"
          style={{
            minHeight: '550px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
        >
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">✨ {invite.eventName} ✨</h1>
            <p className="text-lg opacity-90">{invite.description}</p>
          </div>

          <div className="bg-white bg-opacity-20 rounded-lg p-6 backdrop-blur-sm space-y-3">
            <p className="text-lg">
              <strong>📅 Data:</strong>{' '}
              {new Date(invite.eventDate).toLocaleDateString('pt-BR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
            <p className="text-lg"><strong>🕐 Hora:</strong> {invite.eventTime}</p>
            {invite.eventLocation && (
              <p className="text-lg"><strong>📍 Local:</strong> {invite.eventLocation}</p>
            )}
            {invite.guests.length > 0 && (
              <p className="text-lg"><strong>👥 Convidado(s):</strong> {invite.guests.join(' & ')}</p>
            )}
          </div>

          <div className="flex justify-center">
            <div className="bg-white p-4 rounded-lg">
              {qrImage ? (
                <img src={qrImage} alt="QR Code" style={{ width: '150px', height: '150px' }} />
              ) : (
                <div style={{ width: '150px', height: '150px', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  Carregando...
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleDownload}
            className="flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition font-semibold text-lg"
          >
            ⬇️ Download do Convite
          </button>
          <button
            className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition font-semibold text-lg"
          >
            ← Voltar
          </button>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">📋 Detalhes do Convite</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Evento</p>
              <p className="font-semibold text-gray-800">{invite.eventName}</p>
            </div>
            <div>
              <p className="text-gray-600">Data</p>
              <p className="font-semibold text-gray-800">{invite.eventDate}</p>
            </div>
            <div>
              <p className="text-gray-600">Hora</p>
              <p className="font-semibold text-gray-800">{invite.eventTime}</p>
            </div>
            <div>
              <p className="text-gray-600">Local</p>
              <p className="font-semibold text-gray-800">{invite.eventLocation || 'Não especificado'}</p>
            </div>
            <div className="col-span-2">
              <p className="text-gray-600">Convidados</p>
              <p className="font-semibold text-gray-800">{invite.guests.join(', ') || 'Sem convidados específicos'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewInvitePage;