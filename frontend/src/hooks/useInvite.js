// src/hooks/useInvite.js
import { useContext } from 'react';
import { InviteContext } from '../context/InviteContext';

export function useInvite() {
  const context = useContext(InviteContext);

  if (!context) {
    throw new Error('useInvite deve ser usado dentro de InviteProvider');
  }

  return context;
}