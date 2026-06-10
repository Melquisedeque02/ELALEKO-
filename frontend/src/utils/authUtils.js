export const isAutenticado = () => {
  return !!localStorage.getItem('token');
};

export const getUsuario = () => {
  const usuario = localStorage.getItem('usuario');
  return usuario ? JSON.parse(usuario) : null;
};

export const isAdmin = () => {
  const usuario = getUsuario();
  return usuario?.role === 'admin';
};

export const isSeguranca = () => {
  const usuario = getUsuario();
  return usuario?.role === 'seguranca';
};

export const isOrganizador = () => {
  const usuario = getUsuario();
  return usuario?.role === 'organizador';
};