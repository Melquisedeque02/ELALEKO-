// src/services/storageService.js
const STORAGE_KEY = 'digital_invites_data';

/**
 * Obtém todos os convites do localStorage
 */
export function getInvites() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Erro ao recuperar convites:', error);
    return [];
  }
}

/**
 * Salva convites no localStorage
 */
export function saveInvites(invites) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(invites));
    return true;
  } catch (error) {
    console.error('Erro ao salvar convites:', error);
    return false;
  }
}

/**
 * Limpa todos os convites
 */
export function clearInvites() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Erro ao limpar convites:', error);
    return false;
  }
}

/**
 * Exporta convites como JSON
 */
export function exportInvitesAsJSON(invites) {
  try {
    const dataStr = JSON.stringify(invites, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `convites_backup_${new Date().getTime()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error('Erro ao exportar convites:', error);
    return false;
  }
}

/**
 * Importa convites de arquivo JSON
 */
export function importInvitesFromJSON(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const invites = JSON.parse(e.target.result);
        if (Array.isArray(invites)) {
          saveInvites(invites);
          resolve(invites);
        } else {
          reject(new Error('Formato inválido: esperado array de convites'));
        }
      } catch (error) {
        reject(new Error('Erro ao ler arquivo JSON'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Erro ao ler arquivo'));
    };

    reader.readAsText(file);
  });
}