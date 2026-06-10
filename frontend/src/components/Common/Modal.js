import React from 'react';
//import './Modal.css';

const Modal = ({ 
  isOpen, 
  title, 
  message, 
  type = 'info', 
  confirmText = 'OK', 
  cancelText = 'Cancelar',
  onConfirm, 
  onCancel 
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className={`modal-content modal-${type}`}>
        <h3 className="modal-title">{title}</h3>
        <p className="modal-message">{message}</p>
        <div className="modal-actions">
          {onConfirm && (
            <button onClick={onConfirm} className="btn btn-primary">
              {confirmText}
            </button>
          )}
          <button onClick={onCancel} className="btn btn-secondary">
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;