const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');

// @desc    Get all budgets for a given month/year with real spending progress
// @route   GET /api/budgets
// @access  Private
exports.getBudgets = async (req, res, next) => {
  try {
    const now = new Date();
    const month = parseInt(req.query.month, 10) || now.getMonth() + 1; // 1-12
    const year = parseInt(req.query.year, 10) || now.getFullYear();

    // Query user's budgets for this month & year
    const budgets = await Budget.find({
      user: req.user.id,
      month,
      year,
    }).sort({ category: 1 });

    // Date range for this month
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

    // Aggregate actual expense spending for this user in this month by category
    const spendingByCategory = await Transaction.aggregate([
      {
        $match: {
          user: req.user._id,
          type: 'expense',
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: '$category',
          totalSpent: { $sum: '$amount' },
        },
      },
    ]);

    const spendingMap = {};
    let totalMonthExpense = 0;
    spendingByCategory.forEach((item) => {
      spendingMap[item._id] = Math.round(item.totalSpent * 100) / 100;
      totalMonthExpense += item.totalSpent;
    });
    totalMonthExpense = Math.round(totalMonthExpense * 100) / 100;

    // Enhance each budget with actual spent, remaining, percentage, and warning status
    let totalBudgetedAmount = 0;
    const progressBudgets = budgets.map((b) => {
      let spent = 0;
      if (b.category.toLowerCase() === 'overall') {
        spent = totalMonthExpense;
      } else {
        spent = spendingMap[b.category] || 0;
      }

      totalBudgetedAmount += b.category.toLowerCase() === 'overall' ? 0 : b.budgetAmount;
      const remaining = Math.round((b.budgetAmount - spent) * 100) / 100;
      const percentage = Math.min(999, Math.round((spent / b.budgetAmount) * 100));

      let status = 'safe'; // < 80% (mint green)
      if (percentage >= 100) {
        status = 'exceeded'; // >= 100% (coral pink)
      } else if (percentage >= 80) {
        status = 'warning'; // 80% - 99% (purple / amber warning)
      }

      return {
        _id: b._id,
        category: b.category,
        budgetAmount: b.budgetAmount,
        month: b.month,
        year: b.year,
        spent,
        remaining,
        percentage,
        status,
        createdAt: b.createdAt,
      };
    });

    res.status(200).json({
      success: true,
      month,
      year,
      totalBudgeted: Math.round(totalBudgetedAmount * 100) / 100,
      totalSpent: totalMonthExpense,
      budgets: progressBudgets,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new budget
// @route   POST /api/budgets
// @access  Private
exports.createBudget = async (req, res, next) => {
  try {
    const { category, budgetAmount, month, year } = req.body;

    if (!category || budgetAmount === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide category and budget amount',
      });
    }

    const numAmount = parseFloat(budgetAmount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Budget amount must be a positive number',
      });
    }

    const now = new Date();
    const budgetMonth = parseInt(month, 10) || now.getMonth() + 1;
    const budgetYear = parseInt(year, 10) || now.getFullYear();

    // Check for duplicate
    const existingBudget = await Budget.findOne({
      user: req.user.id,
      category: category.trim(),
      month: budgetMonth,
      year: budgetYear,
    });

    if (existingBudget) {
      return res.status(400).json({
        success: false,
        message: `A budget for "${category.trim()}" in ${budgetMonth}/${budgetYear} already exists`,
      });
    }

    const budget = await Budget.create({
      user: req.user.id,
      category: category.trim(),
      budgetAmount: Math.round(numAmount * 100) / 100,
      month: budgetMonth,
      year: budgetYear,
    });

    res.status(201).json({
      success: true,
      message: 'Budget created successfully',
      budget,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update budget
// @route   PUT /api/budgets/:id
// @access  Private
exports.updateBudget = async (req, res, next) => {
  try {
    let budget = await Budget.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found or unauthorized',
      });
    }

    const { category, budgetAmount, month, year } = req.body;

    if (budgetAmount !== undefined) {
      const numAmount = parseFloat(budgetAmount);
      if (isNaN(numAmount) || numAmount <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Budget amount must be a positive number',
        });
      }
      budget.budgetAmount = Math.round(numAmount * 100) / 100;
    }

    if (category) budget.category = category.trim();
    if (month) budget.month = parseInt(month, 10);
    if (year) budget.year = parseInt(year, 10);

    await budget.save();

    res.status(200).json({
      success: true,
      message: 'Budget updated successfully',
      budget,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete budget
// @route   DELETE /api/budgets/:id
// @access  Private
exports.deleteBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found or unauthorized',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Budget deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};
