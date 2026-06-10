// src/utils/validators.js

/**
 * Valida dados do formulário de convite
 */
export function validateInvite(formData) {
  const errors = [];

  // Validar nome do evento
  if (!formData.eventName || !formData.eventName.trim()) {
    errors.push('Nome do evento é obrigatório');
  }

  // Validar data
  if (!formData.eventDate) {
    errors.push('Data do evento é obrigatória');
  } else if (new Date(formData.eventDate) < new Date()) {
    errors.push('A data não pode ser no passado');
  }

  // Validar hora
  if (!formData.eventTime) {
    errors.push('Hora do evento é obrigatória');
  }

  // Validar nomes dos convidados
  const guests = [formData.guestName1, formData.guestName2]
    .filter(g => g && g.trim());

  if (guests.length > 2) {
    errors.push('Máximo de 2 convidados permitido');
  }

  return {
    isValid: errors.length === 0,
    errors: errors,
  };
}

/**
 * Valida email
 */
export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Valida data
 */
export function validateDate(dateString) {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
}

/**
 * Valida hora (formato HH:MM)
 */
export function validateTime(timeString) {
  const re = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return re.test(timeString);
}