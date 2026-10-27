import React, { useState, useEffect } from 'react';
import { ArrowLeftRight, RefreshCw, Clock, ShieldCheck, AlertCircle, TrendingUp } from 'lucide-react';
import { formatCurrency, getCurrencySymbol } from '../utils/formatters';
import { useCurrency } from '../context/CurrencyContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

const SUPPORTED_CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'AU$' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'SG$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'AED' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
];

const CurrencyPage = () => {
  const { rates, lastUpdated, refreshRates, loading: contextLoading } = useCurrency();
  const { showToast } = useToast();

  const [amount, setAmount] = useState('1000');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('INR');
  const [conversionResult, setConversionResult] = useState(null);
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState(null);

  const handleConvert = async () => {
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      setError('Please provide a valid positive numeric amount');
      return;
    }
    setError(null);

    try {
      setConverting(true);
      const res = await api.get(`/currency/convert?amount=${num}&from=${fromCurrency}&to=${toCurrency}`);
      if (res.data.success) {
        setConversionResult(res.data);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Currency conversion request failed';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setConverting(false);
    }
  };

  useEffect(() => {
    handleConvert();
  }, [fromCurrency, toCurrency]);

  const handleSwap = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900">
            Live Currency Converter
          </h2>
          <p className="text-xs text-[#9299B3]">
            Global real-time foreign exchange conversion powered by live bank market rates
          </p>
        </div>

        <button
          onClick={async () => {
            await refreshRates();
            await handleConvert();
            showToast('Currency rates refreshed', 'success');
          }}
          disabled={contextLoading}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-[#9299B3] hover:text-[#F5F6FF] border border-[#262D4A] dark:border-[#262D4A] border-gray-200 bg-[#1B2035] dark:bg-[#1B2035] bg-white hover:bg-[#262D4A]/30 transition-all self-start sm:self-auto shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${contextLoading ? 'animate-spin text-[#8B5CF6]' : ''}`} />
          Refresh Live Rates
        </button>
      </div>

      {/* Main Conversion Card */}
      <div className="panel-card p-6 sm:p-8 border border-[#262D4A] dark:border-[#262D4A] dark:bg-[#1B2035] bg-white rounded-2xl max-w-4xl mx-auto shadow-elevated">
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
          {/* Amount & Source Currency */}
          <div className="md:col-span-3 space-y-2">
            <label className="block text-xs font-semibold text-[#9299B3]">Amount to Convert</label>
            <div className="relative">
              <input
                type="number"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleConvert()}
                className="w-full px-4 py-3 rounded-xl bg-[#15192C] dark:bg-[#15192C] bg-gray-50 border border-[#262D4A] dark:border-[#262D4A] border-gray-200 text-lg font-bold text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900 focus:outline-none focus:border-[#8B5CF6]"
              />
            </div>
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#15192C] dark:bg-[#15192C] bg-gray-50 border border-[#262D4A] dark:border-[#262D4A] border-gray-200 text-xs font-semibold text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900 focus:outline-none cursor-pointer"
            >
              {SUPPORTED_CURRENCIES.map((c) => (
                <option key={c.code} value={c.code} className="bg-[#1B2035] text-[#F5F6FF]">
                  {c.code} — {c.name} ({c.symbol})
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div className="md:col-span-1 flex justify-center py-2 md:py-0">
            <button
              onClick={handleSwap}
              title="Swap currencies"
              className="p-3 rounded-2xl border border-[#262D4A] dark:border-[#262D4A] bg-[#15192C] dark:bg-[#15192C] bg-gray-100 hover:border-[#8B5CF6] hover:bg-[#8B5CF6]/15 text-[#8B5CF6] transition-all shadow-sm active:scale-95"
            >
              <ArrowLeftRight className="w-5 h-5" />
            </button>
          </div>

          {/* Target Currency & Result */}
          <div className="md:col-span-3 space-y-2">
            <label className="block text-xs font-semibold text-[#9299B3]">Converted Value</label>
            <div className="w-full px-4 py-3 rounded-xl bg-[#15192C]/70 dark:bg-[#15192C]/70 bg-gray-100 border border-[#262D4A] dark:border-[#262D4A] border-gray-200 text-lg font-bold text-[#42E8B4] flex items-center justify-between">
              <span>
                {converting ? (
                  <span className="text-xs text-[#9299B3] animate-pulse">Calculating rate...</span>
                ) : conversionResult ? (
                  `${getCurrencySymbol(toCurrency)} ${conversionResult.convertedAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                ) : (
                  '--'
                )}
              </span>
              <span className="text-xs font-semibold text-[#9299B3]">{toCurrency}</span>
            </div>
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#15192C] dark:bg-[#15192C] bg-gray-50 border border-[#262D4A] dark:border-[#262D4A] border-gray-200 text-xs font-semibold text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900 focus:outline-none cursor-pointer"
            >
              {SUPPORTED_CURRENCIES.map((c) => (
                <option key={c.code} value={c.code} className="bg-[#1B2035] text-[#F5F6FF]">
                  {c.code} — {c.name} ({c.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-[#FF718B]/15 border border-[#FF718B]/30 text-xs text-[#FF718B] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Live Exchange Rate & Timestamp Footer */}
        <div className="mt-6 pt-5 border-t border-[#262D4A]/50 dark:border-[#262D4A]/50 border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#8B5CF6]" />
            <span className="text-[#9299B3]">
              Exchange Rate:{' '}
              <strong className="text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900">
                1 {fromCurrency} = {conversionResult?.rate || '--'} {toCurrency}
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-[#9299B3]">
            <Clock className="w-3.5 h-3.5 text-[#42E8B4]" />
            <span>Rates updated: {lastUpdated ? new Date(lastUpdated).toUTCString() : 'Active cache'}</span>
          </div>
        </div>
      </div>

      {/* Foreign Exchange Rate Board against 1 USD */}
      <div className="panel-card p-6 border border-[#262D4A] dark:border-[#262D4A] dark:bg-[#1B2035] bg-white rounded-2xl max-w-4xl mx-auto">
        <h3 className="text-base font-bold text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900 pb-3 border-b border-[#262D4A]/50">
          Global FX Benchmark Rates (Base: 1 USD)
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-4">
          {SUPPORTED_CURRENCIES.filter((c) => c.code !== 'USD').map((c) => {
            const rate = rates ? rates[c.code] : null;
            return (
              <div
                key={c.code}
                className="p-3 rounded-xl bg-[#15192C]/60 dark:bg-[#15192C]/60 bg-gray-50 border border-[#262D4A]/50 dark:border-[#262D4A]/50 border-gray-200"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900">
                    {c.code}
                  </span>
                  <span className="text-[11px] text-[#9299B3]">{c.symbol}</span>
                </div>
                <p className="text-sm font-semibold text-[#8B5CF6] mt-1">
                  {rate ? rate.toLocaleString('en-US', { maximumFractionDigits: 4 }) : '--'}
                </p>
                <p className="text-[10px] text-[#9299B3] mt-0.5 truncate">{c.name}</p>
              </div>
            );
          })}
        </div>

        {/* Disclaimer Note */}
        <div className="mt-6 p-3 rounded-xl bg-[#262D4A]/25 text-[11px] text-[#9299B3] space-y-1">
          <p className="flex items-center gap-1.5 font-semibold text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-800">
            <ShieldCheck className="w-3.5 h-3.5 text-[#42E8B4]" /> Real-time Banking Market Data
          </p>
          <p>
            Converted values are estimates based on live bank rates. In accordance with fintech accounting
            standards, live currency conversion calculations are isolated and do not retroactively alter your
            recorded historical transactions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CurrencyPage;
