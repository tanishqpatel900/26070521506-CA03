const Transaction = require('../models/Transaction');

// @desc    Get all transactions with filtering, search, sorting & pagination
// @route   GET /api/transactions
// @access  Private
exports.getTransactions = async (req, res, next) => {
  try {
    const {
      search,
      type,
      category,
      paymentMethod,
      startDate,
      endDate,
      sort = 'newest',
      page = 1,
      limit = 10,
    } = req.query;

    const query = { user: req.user.id };

    // Search by title or notes
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ title: searchRegex }, { notes: searchRegex }];
    }

    // Filter by type (income or expense)
    if (type && ['income', 'expense'].includes(type.toLowerCase())) {
      query.type = type.toLowerCase();
    }

    // Filter by category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Filter by payment method
    if (paymentMethod && paymentMethod !== 'All') {
      query.paymentMethod = paymentMethod;
    }

    // Filter by date range
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    // Sorting
    let sortOptions = { date: -1 };
    if (sort === 'oldest') {
      sortOptions = { date: 1 };
    } else if (sort === 'highest') {
      sortOptions = { amount: -1 };
    } else if (sort === 'lowest') {
      sortOptions = { amount: 1 };
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const total = await Transaction.countDocuments(query);
    const transactions = await Transaction.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: transactions.length,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      transactions,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single transaction by ID
// @route   GET /api/transactions/:id
// @access  Private
exports.getTransactionById = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found or unauthorized',
      });
    }

    res.status(200).json({
      success: true,
      transaction,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new transaction
// @route   POST /api/transactions
// @access  Private
exports.createTransaction = async (req, res, next) => {
  try {
    const { title, amount, type, category, date, paymentMethod, currency, notes } = req.body;

    if (!title || amount === undefined || !type || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, amount, type (income/expense), and category',
      });
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Transaction amount must be a positive number',
      });
    }

    const transaction = await Transaction.create({
      user: req.user.id,
      title: title.trim(),
      amount: Math.round(numAmount * 100) / 100,
      type: type.toLowerCase(),
      category: category.trim(),
      date: date ? new Date(date) : new Date(),
      paymentMethod: paymentMethod || 'Debit Card',
      currency: currency || req.user.preferredCurrency || 'USD',
      notes: notes ? notes.trim() : '',
    });

    res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      transaction,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update transaction
// @route   PUT /api/transactions/:id
// @access  Private
exports.updateTransaction = async (req, res, next) => {
  try {
    let transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found or unauthorized',
      });
    }

    const { title, amount, type, category, date, paymentMethod, currency, notes } = req.body;

    if (title) transaction.title = title.trim();
    if (amount !== undefined) {
      const numAmount = parseFloat(amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Transaction amount must be a positive number',
        });
      }
      transaction.amount = Math.round(numAmount * 100) / 100;
    }
    if (type && ['income', 'expense'].includes(type.toLowerCase())) {
      transaction.type = type.toLowerCase();
    }
    if (category) transaction.category = category.trim();
    if (date) transaction.date = new Date(date);
    if (paymentMethod) transaction.paymentMethod = paymentMethod;
    if (currency) transaction.currency = currency.toUpperCase();
    if (notes !== undefined) transaction.notes = notes.trim();

    await transaction.save();

    res.status(200).json({
      success: true,
      message: 'Transaction updated successfully',
      transaction,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
exports.deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found or unauthorized',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Transaction deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};
