import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const { user } = useAuth();
  const [currency, setCurrency] = useState('USD');
  const [rates, setRates] = useState({});
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sync default currency with user preference
  useEffect(() => {
    if (user?.preferredCurrency) {
      setCurrency(user.preferredCurrency);
    }
  }, [user]);

  const fetchRates = async () => {
    try {
      setLoading(true);
      const res = await api.get('/currency/rates?base=USD');
      if (res.data.success) {
        setRates(res.data.rates || {});
        setLastUpdated(res.data.lastUpdated);
      }
    } catch (err) {
      console.error('Error fetching currency rates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        rates,
        lastUpdated,
        loading,
        refreshRates: fetchRates,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
