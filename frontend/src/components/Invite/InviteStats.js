// src/components/Invite/InviteStats.jsx
import React from 'react';
import './InviteStats.css';

function InviteStats({ stats }) {
  if (!stats) {
    return null;
  }

  return (
    <div className="stats-container">
      <div className="stat-card stat-total">
        <div className="stat-icon">📋</div>
        <div className="stat-content">
          <div className="stat-value">{stats.total || 0}</div>
          <div className="stat-label">Convites Criados</div>
        </div>
      </div>

      <div className="stat-card stat-guests">
        <div className="stat-icon">👥</div>
        <div className="stat-content">
          <div className="stat-value">{stats.totalGuests || 0}</div>
          <div className="stat-label">Convidados Totais</div>
        </div>
      </div>

      <div className="stat-card stat-upcoming">
        <div className="stat-icon">📅</div>
        <div className="stat-content">
          <div className="stat-value">{stats.upcoming || 0}</div>
          <div className="stat-label">Eventos Próximos</div>
        </div>
      </div>

      <div className="stat-card stat-past">
        <div className="stat-icon">✓</div>
        <div className="stat-content">
          <div className="stat-value">{stats.past || 0}</div>
          <div className="stat-label">Eventos Passados</div>
        </div>
      </div>
    </div>
  );
}

export default InviteStats;