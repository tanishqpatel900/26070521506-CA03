const axios = require('axios');

// In-memory cache for exchange rates
let ratesCache = {
  base: 'USD',
  rates: {
    USD: 1.0,
    EUR: 0.92,
    GBP: 0.79,
    INR: 86.85,
    CAD: 1.39,
    AUD: 1.54,
    JPY: 152.4,
    SGD: 1.34,
    CHF: 0.88,
    CNY: 7.23,
    AED: 3.67,
  },
  lastUpdated: new Date().toISOString(),
  cachedAt: Date.now(),
  source: 'fallback',
};

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

/**
 * Fetch latest rates from external API with caching
 */
const fetchLatestRates = async (baseCurrency = 'USD') => {
  const base = baseCurrency.toUpperCase();
  const now = Date.now();

  // If cached data for base exists and is still fresh within TTL, return cache
  if (
    ratesCache.base === base &&
    ratesCache.rates &&
    now - ratesCache.cachedAt < CACHE_TTL_MS &&
    ratesCache.source !== 'fallback'
  ) {
    return {
      rates: ratesCache.rates,
      lastUpdated: ratesCache.lastUpdated,
      base: ratesCache.base,
      cached: true,
    };
  }

  try {
    let url = process.env.EXCHANGE_RATE_API_URL || 'https://open.er-api.com/v6/latest';
    if (process.env.EXCHANGE_RATE_API_KEY) {
      url = `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_RATE_API_KEY}/latest`;
    }

    const response = await axios.get(`${url}/${base}`, {
      timeout: 6000,
      headers: { 'User-Agent': 'FlowFinance/1.0' },
    });

    if (response.data && response.data.rates) {
      ratesCache = {
        base,
        rates: response.data.rates,
        lastUpdated: response.data.time_last_update_utc || new Date().toISOString(),
        cachedAt: now,
        source: 'live-api',
      };

      return {
        rates: ratesCache.rates,
        lastUpdated: ratesCache.lastUpdated,
        base: ratesCache.base,
        cached: false,
      };
    } else {
      throw new Error('Invalid rate data received from provider');
    }
  } catch (err) {
    console.warn(`[CurrencyService Warning]: Failed to fetch live exchange rates (${err.message}). Using cached/resilient rates.`);
    return {
      rates: ratesCache.rates,
      lastUpdated: ratesCache.lastUpdated,
      base: ratesCache.base,
      cached: true,
      fallbackUsed: true,
      warning: 'Live exchange service unavailable. Showing latest recorded rates.',
    };
  }
};

/**
 * Convert an amount from one currency to another
 */
const convertCurrency = async (amount, fromCurrency, toCurrency) => {
  const from = fromCurrency.toUpperCase();
  const to = toCurrency.toUpperCase();
  const numericAmount = parseFloat(amount);

  if (isNaN(numericAmount) || numericAmount < 0) {
    throw new Error('Valid positive amount is required for currency conversion');
  }

  // Fetch rates with USD base
  const rateData = await fetchLatestRates('USD');
  const rates = rateData.rates;

  if (!rates[from]) {
    throw new Error(`Unsupported source currency: ${from}`);
  }
  if (!rates[to]) {
    throw new Error(`Unsupported target currency: ${to}`);
  }

  // Conversion via USD base:
  // USD -> from rate = rates[from]
  // USD -> to rate = rates[to]
  // from -> to rate = rates[to] / rates[from]
  const rate = rates[to] / rates[from];
  const convertedAmount = Math.round(numericAmount * rate * 100) / 100;

  return {
    amount: numericAmount,
    from,
    to,
    rate: Math.round(rate * 10000) / 10000,
    convertedAmount,
    lastUpdated: rateData.lastUpdated,
    source: rateData.cached ? 'cached' : 'live',
  };
};

module.exports = {
  fetchLatestRates,
  convertCurrency,
};
