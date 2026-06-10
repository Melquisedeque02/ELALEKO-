import React, { useState } from 'react';
import { CheckCircle, XCircle, Edit3, Loader } from 'lucide-react';
import ApiService from '../../services/api';
import './StatusBadge.css';

const StatusBadge = ({ convite, onStatusChange }) => {
  const [editando, setEditando] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const toggleStatus = async () => {
    if (carregando) return;
    
    setCarregando(true);
    try {
      const novoStatus = !convite.utilizado;
      await ApiService.atualizarStatus(convite.qr_code, novoStatus);
      
      if (onStatusChange) {
        onStatusChange(convite.id, novoStatus);
      }
      
      setEditando(false);
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      alert('Erro ao atualizar status. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  const StatusDisplay = () => (
    <div 
      className={`status-badge ${convite.utilizado ? 'used' : 'valid'} ${carregando ? 'loading' : ''}`}
      onClick={() => !carregando && setEditando(true)}
    >
      {convite.utilizado ? (
        <>
          <XCircle size={16} />
          <span>Utilizado</span>
        </>
      ) : (
        <>
          <CheckCircle size={16} />
          <span>Válido</span>
        </>
      )}
      <Edit3 size={12} className="edit-icon" />
    </div>
  );

  const StatusEditor = () => (
    <div className="status-editor">
      <button
        onClick={toggleStatus}
        className={`btn-status ${convite.utilizado ? 'btn-valid' : 'btn-used'}`}
        disabled={carregando}
      >
        {carregando ? <Loader size={14} className="spin" /> : 
         convite.utilizado ? 'Marcar como Válido' : 'Marcar como Utilizado'}
      </button>
      <button
        onClick={() => setEditando(false)}
        className="btn-cancel"
        disabled={carregando}
      >
        Cancelar
      </button>
    </div>
  );

  return editando ? <StatusEditor /> : <StatusDisplay />;
};

export default StatusBadge;