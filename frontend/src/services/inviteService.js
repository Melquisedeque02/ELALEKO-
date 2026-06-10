// src/services/inviteService.js
import { validateInvite } from '../utils/validators';

/**
 * Cria um novo convite com validação
 */
export function createInvite(formData) {
  const validation = validateInvite(formData);
  
  if (!validation.isValid) {
    throw new Error(validation.errors.join(', '));
  }

  const guests = [formData.guestName1, formData.guestName2]
    .filter(g => g && g.trim())
    .slice(0, 2);

  return {
    id: Date.now(),
    eventName: formData.eventName.trim(),
    eventDate: formData.eventDate,
    eventTime: formData.eventTime,
    eventLocation: formData.eventLocation?.trim() || '',
    description: formData.description?.trim() || '',
    guests: guests,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Atualiza um convite existente
 */
export function updateInvite(id, formData) {
  const validation = validateInvite(formData);
  
  if (!validation.isValid) {
    throw new Error(validation.errors.join(', '));
  }

  const guests = [formData.guestName1, formData.guestName2]
    .filter(g => g && g.trim())
    .slice(0, 2);

  return {
    id,
    eventName: formData.eventName.trim(),
    eventDate: formData.eventDate,
    eventTime: formData.eventTime,
    eventLocation: formData.eventLocation?.trim() || '',
    description: formData.description?.trim() || '',
    guests: guests,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Busca convites por termo
 */
export function searchInvites(invites, searchTerm) {
  if (!searchTerm) return invites;

  const term = searchTerm.toLowerCase();
  return invites.filter(invite =>
    invite.eventName.toLowerCase().includes(term) ||
    invite.eventLocation.toLowerCase().includes(term) ||
    invite.guests.some(guest => guest.toLowerCase().includes(term))
  );
}

/**
 * Ordena convites por data
 */
export function sortInvitesByDate(invites, order = 'asc') {
  return [...invites].sort((a, b) => {
    const dateA = new Date(a.eventDate);
    const dateB = new Date(b.eventDate);
    return order === 'asc' ? dateA - dateB : dateB - dateA;
  });
}

/**
 * Gera estatísticas dos convites
 */
export function generateStats(invites) {
  const now = new Date();

  return {
    total: invites.length,
    totalGuests: invites.reduce((acc, inv) => acc + (inv.guests?.length || 0), 0),
    upcoming: invites.filter(inv => new Date(inv.eventDate) > now).length,
    past: invites.filter(inv => new Date(inv.eventDate) <= now).length,
  };
}