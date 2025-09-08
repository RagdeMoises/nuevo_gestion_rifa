// src/context/RaffleContext.js
import React, { createContext, useContext, useReducer } from 'react';

const RaffleContext = createContext();

const initialState = {
  tickets: [],
  userData: {
    name: '',
    idNumber: '',
    phone: '',
    ticketQuantity: 1
  },
  payment: {
    method: '',
    receipt: null
  },
  search: {
    ticketNumber: '',
    idNumber: ''
  },
  searchResult: null
};

function raffleReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_USER_DATA':
      return { ...state, userData: { ...state.userData, ...action.payload } };
    case 'UPDATE_PAYMENT_METHOD':
      return { ...state, payment: { ...state.payment, method: action.payload } };
    case 'UPDATE_PAYMENT_RECEIPT':
      return { ...state, payment: { ...state.payment, receipt: action.payload } };
    case 'UPDATE_SEARCH_DATA':
      return { ...state, search: { ...state.search, ...action.payload } };
    case 'SET_SEARCH_RESULT':
      return { ...state, searchResult: action.payload };
    case 'ADD_TICKET':
      return { ...state, tickets: [...state.tickets, action.payload] };
    default:
      return state;
  }
}

export function RaffleProvider({ children }) {
  const [state, dispatch] = useReducer(raffleReducer, initialState);
  
  return (
    <RaffleContext.Provider value={{ state, dispatch }}>
      {children}
    </RaffleContext.Provider>
  );
}

export function useRaffle() {
  const context = useContext(RaffleContext);
  if (!context) {
    throw new Error('useRaffle must be used within a RaffleProvider');
  }
  return context;
}