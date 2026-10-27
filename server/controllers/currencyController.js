const { fetchLatestRates, convertCurrency } = require('../services/currencyService');

// @desc    Get live exchange rates against base currency
// @route   GET /api/currency/rates
// @access  Public or Private
exports.getRates = async (req, res, next) => {
  try {
    const base = req.query.base || 'USD';
    const data = await fetchLatestRates(base);
    res.status(200).json({
      success: true,
      ...data,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Convert currency live
// @route   GET /api/currency/convert
// @access  Public or Private
exports.convert = async (req, res, next) => {
  try {
    const { amount, from = 'USD', to = 'INR' } = req.query;

    if (!amount || isNaN(parseFloat(amount))) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid numeric amount to convert',
      });
    }

    const result = await convertCurrency(parseFloat(amount), from, to);
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (err) {
    next(err);
  }
};
