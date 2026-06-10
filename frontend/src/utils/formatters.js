// src/utils/formatters.js

/**
 * Formata data no padrão brasileiro
 */
export function formatDateBR(dateString) {
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return new Date(dateString).toLocaleDateString('pt-BR', options);
}

/**
 * Formata data de forma curta (DD/MM/YYYY)
 */
export function formatDateShort(dateString) {
  return new Date(dateString).toLocaleDateString('pt-BR');
}

/**
 * Formata hora (garante formato HH:MM)
 */
export function formatTime(timeString) {
  return timeString || '--:--';
}

/**
 * Formata data e hora juntas
 */
export function formatDateTime(dateString, timeString) {
  const date = formatDateBR(dateString);
  const time = formatTime(timeString);
  return `${date} às ${time}`;
}

/**
 * Capitaliza primeira letra
 */
export function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Trunca texto com ellipsis
 */
export function truncateText(text, maxLength = 50) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Formata lista de convidados
 */
export function formatGuestList(guests) {
  if (!guests || guests.length === 0) return 'Sem convidados';
  if (guests.length === 1) return guests[0];
  return guests.join(' & ');
}