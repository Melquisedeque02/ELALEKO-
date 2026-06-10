// frontend/src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAutenticado, isAdmin, isOrganizador, isSeguranca } from '../utils/authUtils';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const autenticado = isAutenticado();
  const admin = isAdmin();
  const organizador = isOrganizador();
  
  if (!autenticado) {
    return <Navigate to="/login" replace />;
  }
  
  // Se requer admin, só admin passa
  if (requireAdmin && !admin) {
    return <Navigate to="/organizador/dashboard" replace />;
  }
  
  // Se não requer admin, qualquer usuário logado passa (admin, organizador, segurança)
  return children;
};

export default ProtectedRoute;