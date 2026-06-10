// src/components/Invite/InviteCard.jsx
import React from 'react';
import { formatDateShort, formatGuestList } from '../../utils/formatters';
import './InviteCard.css';

function InviteCard({ invite, onPreview, onDelete, onDownload }) {
  return (
    <div className="invite-card">
      <div className="invite-card-header">
        <h3 className="invite-card-title">{invite.eventName}</h3>
      </div>

      <div className="invite-card-body">
        <div className="invite-card-info">
          <div className="info-item">
            <span className="info-icon">📅</span>
            <span className="info-text">{formatDateShort(invite.eventDate)}</span>
          </div>

          <div className="info-item">
            <span className="info-icon">🕐</span>
            <span className="info-text">{invite.eventTime}</span>
          </div>

          {invite.eventLocation && (
            <div className="info-item">
              <span className="info-icon">📍</span>
              <span className="info-text" title={invite.eventLocation}>
                {invite.eventLocation.length > 30
                  ? invite.eventLocation.substring(0, 30) + '...'
                  : invite.eventLocation}
              </span>
            </div>
          )}

          {invite.guests && invite.guests.length > 0 && (
            <div className="info-item">
              <span className="info-icon">👥</span>
              <span className="info-text" title={formatGuestList(invite.guests)}>
                {invite.guests.length} convidado{invite.guests.length > 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="invite-card-footer">
        <button onClick={onPreview} className="btn btn-sm btn-primary">
          👁️ Ver
        </button>
        {onDownload && (
          <button onClick={onDownload} className="btn btn-sm btn-success">
            ⬇️ Download
          </button>
        )}
        <button onClick={onDelete} className="btn btn-sm btn-danger">
          🗑️ Deletar
        </button>
      </div>
    </div>
  );
}

export default InviteCard;