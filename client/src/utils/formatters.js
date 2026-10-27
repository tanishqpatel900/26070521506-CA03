export const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
  CAD: 'CA$',
  AUD: 'AU$',
  JPY: '¥',
  SGD: 'SG$',
  CHF: 'CHF',
  AED: 'AED',
};

export const getCurrencySymbol = (currency = 'USD') => {
  return CURRENCY_SYMBOLS[currency?.toUpperCase()] || currency;
};

export const formatCurrency = (amount, currency = 'USD') => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return `${getCurrencySymbol(currency)}0.00`;
  }

  const symbol = getCurrencySymbol(currency);
  const formattedNumber = Math.abs(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return `${amount < 0 ? '-' : ''}${symbol}${formattedNumber}`;
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatShortDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};
