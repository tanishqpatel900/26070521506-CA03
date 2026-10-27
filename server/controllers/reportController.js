const Transaction = require('../models/Transaction');

// Helper to escape CSV strings according to RFC 4180
const escapeCSV = (str) => {
  if (str === null || str === undefined) return '""';
  const stringValue = String(str);
  if (
    stringValue.includes(',') ||
    stringValue.includes('"') ||
    stringValue.includes('\n') ||
    stringValue.includes('\r')
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return `"${stringValue}"`;
};

// @desc    Export filtered transactions to CSV
// @route   GET /api/reports/export-csv
// @access  Private
exports.exportCSV = async (req, res, next) => {
  try {
    const { search, type, category, paymentMethod, startDate, endDate } = req.query;
    const query = { user: req.user.id };

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ title: searchRegex }, { notes: searchRegex }];
    }

    if (type && ['income', 'expense'].includes(type.toLowerCase())) {
      query.type = type.toLowerCase();
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (paymentMethod && paymentMethod !== 'All') {
      query.paymentMethod = paymentMethod;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    const transactions = await Transaction.find(query).sort({ date: -1 });

    const headers = [
      'Transaction ID',
      'Date',
      'Title',
      'Type',
      'Category',
      'Amount',
      'Currency',
      'Payment Method',
      'Notes',
    ];

    const rows = transactions.map((tx) => [
      escapeCSV(tx._id),
      escapeCSV(new Date(tx.date).toISOString().split('T')[0]),
      escapeCSV(tx.title),
      escapeCSV(tx.type.toUpperCase()),
      escapeCSV(tx.category),
      escapeCSV(tx.amount.toFixed(2)),
      escapeCSV(tx.currency),
      escapeCSV(tx.paymentMethod),
      escapeCSV(tx.notes || ''),
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

    const filename = `flowfinance-transactions-${new Date().toISOString().split('T')[0]}.csv`;
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.status(200).send(csvContent);
  } catch (err) {
    next(err);
  }
};

// @desc    Get detailed summary report data for view and PDF export
// @route   GET /api/reports/summary
// @access  Private
exports.getSummaryReport = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { month, year } = req.query;

    const now = new Date();
    const repMonth = parseInt(month, 10) || now.getMonth() + 1;
    const repYear = parseInt(year, 10) || now.getFullYear();

    const startOfMonth = new Date(repYear, repMonth - 1, 1);
    const endOfMonth = new Date(repYear, repMonth, 0, 23, 59, 59, 999);

    const transactions = await Transaction.find({
      user: userId,
      date: { $gte: startOfMonth, $lte: endOfMonth },
    }).sort({ date: -1 });

    let totalIncome = 0;
    let totalExpense = 0;
    const categoryBreakdown = {};
    const paymentMethodBreakdown = {};

    transactions.forEach((tx) => {
      if (tx.type === 'income') {
        totalIncome += tx.amount;
      } else {
        totalExpense += tx.amount;
        categoryBreakdown[tx.category] = (categoryBreakdown[tx.category] || 0) + tx.amount;
      }
      paymentMethodBreakdown[tx.paymentMethod] = (paymentMethodBreakdown[tx.paymentMethod] || 0) + tx.amount;
    });

    const netSavings = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? Math.round((netSavings / totalIncome) * 100) : 0;

    res.status(200).json({
      success: true,
      report: {
        user: {
          name: req.user.name,
          email: req.user.email,
          currency: req.user.preferredCurrency,
        },
        period: {
          month: repMonth,
          year: repYear,
          startDate: startOfMonth,
          endDate: endOfMonth,
        },
        generatedAt: new Date().toISOString(),
        totals: {
          income: Math.round(totalIncome * 100) / 100,
          expense: Math.round(totalExpense * 100) / 100,
          netSavings: Math.round(netSavings * 100) / 100,
          savingsRate,
          transactionCount: transactions.length,
        },
        categoryBreakdown: Object.entries(categoryBreakdown).map(([category, amount]) => ({
          category,
          amount: Math.round(amount * 100) / 100,
          percentage: totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0,
        })),
        paymentMethodBreakdown: Object.entries(paymentMethodBreakdown).map(([method, amount]) => ({
          method,
          amount: Math.round(amount * 100) / 100,
        })),
        recentTransactions: transactions.slice(0, 15),
      },
    });
  } catch (err) {
    next(err);
  }
};
