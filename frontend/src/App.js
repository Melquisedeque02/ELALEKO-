import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import CriarPage from './pages/criarPage';
import ManageInvitesPage from './pages/ManageInvitesPage';
import Sobre from './pages/Sobre';
import LoginPage from './pages/LoginPage';
import RegistroPage from './pages/RegistroPage';
import ValidarSegurancaPage from './pages/ValidarSegurancaPage';
import ConvitePublicoPage from './pages/ConvitePublicoPage';
import ValidatePage from './pages/ValidatePage';
import ScannerPage from './pages/ScannerPage';
import AdminDashboard from './pages/AdminDashboard';
import FaqPage from './pages/FaqPage';
import OrganizadorDashboard from './pages/OrganizadorDashboard';
import EventoConvitesPage from './pages/EventoConvitesPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminNovoUsuarioPage from './pages/AdminNovoUsuarioPage';
//import ComprarCreditosPage from './pages/ComprarCreditosPage';
//import CriarTemplateIAPage from './pages/CriarTemplateIAPage';
//import AdminCreditosPage from './pages/AdminCreditosPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';



function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/login" element={<LoginPage />} />          
          <Route path="/convite/:qrCode" element={<ConvitePublicoPage />} />
          
          {/* Rotas protegidas - apenas ADMIN */}
          <Route path="/criar" element={
            <ProtectedRoute requireAdmin={false}>
              <CriarPage />
            </ProtectedRoute>
          } />
          <Route path="/gerenciar" element={
            <ProtectedRoute requireAdmin={true}>
              <ManageInvitesPage />
            </ProtectedRoute>
          } />
          <Route path="/validar/:qrCode" element={
            <ProtectedRoute requireAdmin={false}>
              <ValidatePage />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          <Route path="/organizador/evento/:eventoId/convites" element={
            <ProtectedRoute requireAdmin={false}>
              <EventoConvitesPage />
            </ProtectedRoute>
          } />

          <Route path="/admin/usuarios" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminUsersPage />
            </ProtectedRoute>
          } />

          <Route path="/admin/usuarios" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminUsersPage />
            </ProtectedRoute>
          } />

          <Route path="/admin/usuarios/novo" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminNovoUsuarioPage />
            </ProtectedRoute>
          } />

          <Route path="/scanner" element={<ScannerPage />} />
{/*
          <Route path="/comprar-creditos" element={
            <ProtectedRoute requireAdmin={false}>
              <ComprarCreditosPage />
            </ProtectedRoute>
          } />
          <Route path="/criar-template-ia" element={
            <ProtectedRoute requireAdmin={false}>
                <CriarTemplateIAPage />
            </ProtectedRoute>
          } />

          <Route path="/admin/creditos" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminCreditosPage />
            </ProtectedRoute>
          } />*/}
          
          {/* Rotas protegidas - qualquer usuário logado (admin ou segurança) */}
          <Route path="/validar-seguranca" element={
            <ProtectedRoute requireAdmin={false}>
              <ValidarSegurancaPage />
            </ProtectedRoute>
          } />

          <Route path="/organizador/dashboard" element={
            <ProtectedRoute requireAdmin={false}>
              <OrganizadorDashboard />
            </ProtectedRoute>
          } />

          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/resetar-senha" element={<ResetPasswordPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;