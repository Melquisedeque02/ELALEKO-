// src/context/InviteContext.jsx
import React, { createContext, useReducer, useCallback, useEffect } from 'react';
import * as inviteService from '../services/inviteService';
import * as storageService from '../services/storageService';

export const InviteContext = createContext();

const initialState = {
  invites: [],
  loading: false,
  error: null,
  selectedInvite: null,
};

function inviteReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'SET_INVITES':
      return { ...state, invites: action.payload };
    
    case 'ADD_INVITE':
      return {
        ...state,
        invites: [...state.invites, action.payload],
        error: null,
      };
    
    case 'UPDATE_INVITE':
      return {
        ...state,
        invites: state.invites.map(inv =>
          inv.id === action.payload.id ? action.payload : inv
        ),
        error: null,
      };
    
    case 'DELETE_INVITE':
      return {
        ...state,
        invites: state.invites.filter(inv => inv.id !== action.payload),
        error: null,
      };
    
    case 'SELECT_INVITE':
      return { ...state, selectedInvite: action.payload };
    
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    
    default:
      return state;
  }
}

export function InviteProvider({ children }) {
  const [state, dispatch] = useReducer(inviteReducer, initialState);

  // Carregar convites ao montar o componente
  useEffect(() => {
    try {
      const invites = storageService.getInvites();
      dispatch({ type: 'SET_INVITES', payload: invites || [] });
    } catch (error) {
      console.error('Erro ao carregar convites:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao carregar convites' });
    }
  }, []);

  // Criar novo convite
  const createInvite = useCallback(async (formData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const newInvite = inviteService.createInvite(formData);
      dispatch({ type: 'ADD_INVITE', payload: newInvite });
      
      // Salvar no localStorage
      const updatedInvites = [...state.invites, newInvite];
      storageService.saveInvites(updatedInvites);

      dispatch({ type: 'SET_LOADING', payload: false });
      return newInvite;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  }, [state.invites]);

  // Atualizar convite
  const updateInvite = useCallback(async (id, formData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const updatedInvite = inviteService.updateInvite(id, formData);
      dispatch({ type: 'UPDATE_INVITE', payload: updatedInvite });
      
      const allInvites = state.invites.map(inv =>
        inv.id === id ? updatedInvite : inv
      );
      storageService.saveInvites(allInvites);

      dispatch({ type: 'SET_LOADING', payload: false });
      return updatedInvite;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  }, [state.invites]);

  // Deletar convite
  const deleteInvite = useCallback(async (id) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      dispatch({ type: 'DELETE_INVITE', payload: id });
      
      const allInvites = state.invites.filter(inv => inv.id !== id);
      storageService.saveInvites(allInvites);

      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  }, [state.invites]);

  // Obter convite por ID
  const getInviteById = useCallback((id) => {
    return state.invites.find(inv => inv.id === parseInt(id));
  }, [state.invites]);

  // Limpar erro
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const value = {
    // Estado
    invites: state.invites,
    loading: state.loading,
    error: state.error,
    selectedInvite: state.selectedInvite,

    // Ações
    createInvite,
    updateInvite,
    deleteInvite,
    getInviteById,
    clearError,
  };

  return (
    <InviteContext.Provider value={value}>
      {children}
    </InviteContext.Provider>
  );
}