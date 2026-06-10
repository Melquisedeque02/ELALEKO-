// src/pages/convitesPage.js
import React, { useState } from 'react';
import Modal from '../components/Common/Modal';
import { useModal } from '../hooks/useModal';

const ConvitesPage = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [invites, setInvites] = useState([]);
  const modal = useModal();
  const [formData, setFormData] = useState({
    eventName: '',
    eventDate: '',
    eventTime: '',
    eventLocation: '',
    guestName1: '',
    guestName2: '',
    description: '',
  });

  const handleAddInvite = (newInvite) => {
    setInvites(prev => [...prev, newInvite]);
    setFormData({
      eventName: '',
      eventDate: '',
      eventTime: '',
      eventLocation: '',
      guestName1: '',
      guestName2: '',
      description: '',
    });
    setCurrentPage('home');
  };

  const handleDeleteClick = (inviteId, eventName) => {
    modal.openModal({
      title: 'Deletar Convite',
      message: `Tem certeza que deseja deletar o convite "${eventName}"?`,
      type: 'danger',
      confirmText: 'Deletar',
      cancelText: 'Cancelar',
      onConfirm: () => {
        setInvites(prev => prev.filter(i => i.id !== inviteId));
      },
    });
  };

  const navigateToPreview = (inviteId) => {
    sessionStorage.setItem('selectedInvite', inviteId);
    setCurrentPage('preview');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2"> Digital Invites</h1>
          <p className="text-gray-600">Crie e gerencie seus convites digitais com QR Code</p>
        </div>

        {currentPage === 'home' && (
          <HomePage 
            invites={invites} 
            onCreateClick={() => setCurrentPage('create')}
            onPreview={navigateToPreview}
            onDelete={handleDeleteClick}
          />
        )}
        {currentPage === 'create' && (
          <CreatePage 
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleAddInvite}
            onCancel={() => setCurrentPage('home')}
          />
        )}
        {currentPage === 'preview' && (
          <PreviewPage 
            invites={invites}
            onBack={() => setCurrentPage('home')}
          />
        )}
      </div>

      {/* Modal */}
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

const HomePage = ({ invites, onCreateClick, onPreview, onDelete }) => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold text-gray-800">Meus Convites</h2>
    
    {invites.length === 0 ? (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500 mb-4">Nenhum convite criado ainda</p>
        <button
          onClick={onCreateClick}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-lg hover:shadow-lg transition"
        >
          + Criar Novo Convite
        </button>
      </div>
    ) : (
      <>
        <button
          onClick={onCreateClick}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition"
        >
          + Criar Novo Convite
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {invites.map(invite => (
            <div key={invite.id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{invite.eventName}</h3>
              <p className="text-gray-600 mb-1">
                <strong>Data:</strong> {new Date(invite.eventDate).toLocaleDateString('pt-BR')} às {invite.eventTime}
              </p>
              <p className="text-gray-600 mb-1">
                <strong>Local:</strong> {invite.eventLocation || 'Não especificado'}
              </p>
              {invite.guests.length > 0 && (
                <p className="text-gray-600 mb-4">
                  <strong>Convidados:</strong> {invite.guests.join(', ')}
                </p>
              )}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => onPreview(invite.id)}
                  className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                  Visualizar
                </button>
                <button
                  onClick={() => onDelete(invite.id, invite.eventName)}
                  className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                >
                  Deletar
                </button>
              </div>
            </div>
          ))}
        </div>
      </>
    )}
  </div>
);

const CreatePage = ({ formData, setFormData, onSubmit, onCancel }) => {
  const modal = useModal();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateInvite = () => {
    if (!formData.eventName || !formData.eventDate || !formData.eventTime) {
      modal.openModal({
        title: 'Campos Obrigatórios',
        message: 'Preencha os campos obrigatórios: Nome do Evento, Data e Hora',
        type: 'danger',
        confirmText: 'OK',
      });
      return;
    }

    const newInvite = {
      id: Date.now(),
      ...formData,
      guests: [formData.guestName1, formData.guestName2].filter(g => g.trim()),
    };

    onSubmit(newInvite);
  };

  return (
    <>
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Criar Novo Convite</h2>
        
        <div className="bg-white rounded-lg shadow-md p-8 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Nome do Evento *</label>
            <input
              type="text"
              name="eventName"
              value={formData.eventName}
              onChange={handleInputChange}
              placeholder="Ex: Casamento, Aniversário..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Data *</label>
              <input
                type="date"
                name="eventDate"
                value={formData.eventDate}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Hora *</label>
              <input
                type="time"
                name="eventTime"
                value={formData.eventTime}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Local do Evento</label>
            <input
              type="text"
              name="eventLocation"
              value={formData.eventLocation}
              onChange={handleInputChange}
              placeholder="Ex: Salão de Festas ABC, Rua X..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Descrição</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Detalhes adicionais sobre o evento..."
              rows="3"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-3">Convidados (até 2)</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Primeiro Convidado</label>
                <input
                  type="text"
                  name="guestName1"
                  value={formData.guestName1}
                  onChange={handleInputChange}
                  placeholder="Nome completo"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Segundo Convidado (Opcional)</label>
                <input
                  type="text"
                  name="guestName2"
                  value={formData.guestName2}
                  onChange={handleInputChange}
                  placeholder="Nome completo"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleCreateInvite}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg hover:shadow-lg transition font-semibold"
            >
              Criar Convite
            </button>
            <button
              onClick={onCancel}
              className="flex-1 bg-gray-300 text-gray-800 py-3 rounded-lg hover:bg-gray-400 transition font-semibold"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
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
    </>
  );
};

const PreviewPage = ({ invites, onBack }) => {
  const inviteId = parseInt(sessionStorage.getItem('selectedInvite'));
  const invite = invites.find(i => i.id === inviteId);

  if (!invite) return <p className="text-red-500">Convite não encontrado</p>;

  const handleDownload = async () => {
    try {
      const html2canvas = (await import('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js')).default;
      const element = document.getElementById(`invite-${invite.id}`);
      html2canvas(element, { scale: 2, backgroundColor: '#ffffff' }).then(canvas => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = `Convite_${invite.eventName}_${Date.now()}.png`;
        link.click();
      });
    } catch (error) {
      console.error('Erro ao fazer download:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Pré-visualização do Convite</h2>

      <div
        id={`invite-${invite.id}`}
        className="bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 rounded-lg shadow-2xl p-8 text-white mb-6"
        style={{
          minHeight: '500px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2"> {invite.eventName} ✨</h1>
          <p className="text-lg opacity-90">{invite.description}</p>
        </div>

        <div className="bg-white bg-opacity-20 rounded-lg p-6 backdrop-blur-sm space-y-2">
          <p className="text-xl">
            <strong> Data:</strong> {new Date(invite.eventDate).toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <p className="text-xl"><strong> Hora:</strong> {invite.eventTime}</p>
          {invite.eventLocation && <p className="text-xl"><strong> Local:</strong> {invite.eventLocation}</p>}
          {invite.guests.length > 0 && <p className="text-xl"><strong> Convidado(s):</strong> {invite.guests.join(' & ')}</p>}
        </div>

        <div className="flex justify-center">
          <div className="bg-white p-4 rounded-lg">
            <QRCodeComponent data={invite} size={150} />
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleDownload}
          className="flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition font-semibold text-lg"
        >
          ⬇ Download do Convite
        </button>
        <button
          onClick={onBack}
          className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition font-semibold text-lg"
        >
          Voltar
        </button>
      </div>
    </div>
  );
};

const QRCodeComponent = ({ data, size = 150 }) => {
  const [qrImage, setQrImage] = React.useState(null);

  React.useEffect(() => {
    try {
      const loadQRCode = async () => {
        const QRCode = (await import('https://cdnjs.cloudflare.com/ajax/libs/qrcode.js/1.5.3/qrcode.min.js')).default;
        const container = document.createElement('div');
        const qr = new QRCode(container, {
          text: JSON.stringify(data),
          width: size,
          height: size,
        });
        setTimeout(() => {
          const img = container.querySelector('img');
          if (img) setQrImage(img.src);
        }, 100);
      };
      loadQRCode();
    } catch (err) {
      console.error('Erro ao gerar QR Code:', err);
    }
  }, [data, size]);

  return qrImage ? (
    <img src={qrImage} alt="QR Code" style={{ width: size, height: size }} />
  ) : (
    <div style={{ width: size, height: size, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      Carregando...
    </div>
  );
};

export default ConvitesPage;