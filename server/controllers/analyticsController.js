const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');

// Helper to format 2 decimals
const round2 = (val) => Math.round((val || 0) * 100) / 100;

// @desc    Get dashboard financial summary cards & period comparisons
// @route   GET /api/analytics/summary
// @access  Private
exports.getSummary = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const now = new Date();

    // Current month boundaries
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    // Previous month boundaries
    const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    // Lifetime totals
    const lifetimeStats = await Transaction.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
        },
      },
    ]);

    let lifetimeIncome = 0;
    let lifetimeExpense = 0;
    lifetimeStats.forEach((stat) => {
      if (stat._id === 'income') lifetimeIncome = stat.total;
      if (stat._id === 'expense') lifetimeExpense = stat.total;
    });
    const totalBalance = round2(lifetimeIncome - lifetimeExpense);

    // Current month stats
    const currentMonthStats = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: startOfCurrentMonth, $lte: endOfCurrentMonth },
        },
      },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
        },
      },
    ]);

    let currentMonthIncome = 0;
    let currentMonthExpense = 0;
    currentMonthStats.forEach((stat) => {
      if (stat._id === 'income') currentMonthIncome = stat.total;
      if (stat._id === 'expense') currentMonthExpense = stat.total;
    });

    const currentSavings = currentMonthIncome - currentMonthExpense;
    const currentSavingsRate = currentMonthIncome > 0
      ? Math.max(0, Math.round((currentSavings / currentMonthIncome) * 100))
      : 0;

    // Previous month stats for period comparison
    const prevMonthStats = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: startOfPrevMonth, $lte: endOfPrevMonth },
        },
      },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
        },
      },
    ]);

    let prevMonthIncome = 0;
    let prevMonthExpense = 0;
    prevMonthStats.forEach((stat) => {
      if (stat._id === 'income') prevMonthIncome = stat.total;
      if (stat._id === 'expense') prevMonthExpense = stat.total;
    });
    const prevSavings = prevMonthIncome - prevMonthExpense;
    const prevSavingsRate = prevMonthIncome > 0
      ? Math.max(0, Math.round((prevSavings / prevMonthIncome) * 100))
      : 0;

    // Calculate percentage change deltas
    const calcDelta = (current, previous) => {
      if (!previous || previous === 0) {
        return current > 0 ? 100 : 0;
      }
      return Math.round(((current - previous) / previous) * 100);
    };

    res.status(200).json({
      success: true,
      summary: {
        totalBalance,
        totalIncome: round2(currentMonthIncome),
        totalExpenses: round2(currentMonthExpense),
        savingsRate: currentSavingsRate,
        currentSavings: round2(currentSavings),
        lifetimeIncome: round2(lifetimeIncome),
        lifetimeExpense: round2(lifetimeExpense),
        comparisons: {
          incomeChangePct: calcDelta(currentMonthIncome, prevMonthIncome),
          expenseChangePct: calcDelta(currentMonthExpense, prevMonthExpense),
          savingsRateChangePct: currentSavingsRate - prevSavingsRate,
          savingsDelta: round2(currentSavings - prevSavings),
          prevMonthIncome: round2(prevMonthIncome),
          prevMonthExpense: round2(prevMonthExpense),
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get deterministic smart spending insights from MongoDB transaction data
// @route   GET /api/analytics/spending
// @access  Private
exports.getInsights = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const now = new Date();

    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    // Current month category spending
    const currentCatSpending = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          type: 'expense',
          date: { $gte: startOfCurrentMonth, $lte: endOfCurrentMonth },
        },
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);

    // Previous month category spending
    const prevCatSpending = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          type: 'expense',
          date: { $gte: startOfPrevMonth, $lte: endOfPrevMonth },
        },
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
        },
      },
    ]);

    const prevMap = {};
    let prevTotalExpense = 0;
    prevCatSpending.forEach((item) => {
      prevMap[item._id] = item.total;
      prevTotalExpense += item.total;
    });

    let currentTotalExpense = 0;
    currentCatSpending.forEach((item) => {
      currentTotalExpense += item.total;
    });

    // Check monthly budget usage
    const overallBudget = await Budget.findOne({
      user: userId,
      category: { $regex: /^overall$/i },
      month: now.getMonth() + 1,
      year: now.getFullYear(),
    });

    // Or sum of category budgets
    const allBudgets = await Budget.find({
      user: userId,
      month: now.getMonth() + 1,
      year: now.getFullYear(),
    });

    let totalBudgetAmount = 0;
    if (overallBudget) {
      totalBudgetAmount = overallBudget.budgetAmount;
    } else if (allBudgets.length > 0) {
      totalBudgetAmount = allBudgets.reduce((acc, b) => acc + b.budgetAmount, 0);
    }

    const insights = [];

    // 1. Highest spending category insight
    if (currentCatSpending.length > 0) {
      const highest = currentCatSpending[0];
      const highestPct = currentTotalExpense > 0
        ? Math.round((highest.total / currentTotalExpense) * 100)
        : 0;

      insights.push({
        id: 'highest-category',
        type: 'top-spending',
        category: highest._id,
        title: `${highest._id} is your top expense`,
        message: `${highest._id} is your highest spending category this month, accounting for ${highestPct}% of total monthly expenses.`,
        amount: round2(highest.total),
        trend: 'neutral',
        isDeterministic: true,
      });
    }

    // 2. Category period comparison (biggest increase or decrease)
    if (currentCatSpending.length > 0) {
      let maxChangeCategory = null;
      let maxPctChange = 0;
      let isIncrease = true;

      currentCatSpending.forEach((cat) => {
        const prev = prevMap[cat._id];
        if (prev && prev > 0) {
          const pct = Math.round(((cat.total - prev) / prev) * 100);
          if (Math.abs(pct) > Math.abs(maxPctChange)) {
            maxPctChange = pct;
            maxChangeCategory = cat._id;
            isIncrease = pct > 0;
          }
        }
      });

      if (maxChangeCategory && Math.abs(maxPctChange) >= 5) {
        insights.push({
          id: 'category-change',
          type: 'comparison',
          category: maxChangeCategory,
          title: `${maxChangeCategory} spending ${isIncrease ? 'increased' : 'decreased'} by ${Math.abs(maxPctChange)}%`,
          message: `Your ${maxChangeCategory} spending ${isIncrease ? 'increased' : 'decreased'} by ${Math.abs(maxPctChange)}% compared with last month.`,
          trend: isIncrease ? 'negative' : 'positive',
          isDeterministic: true,
        });
      }
    }

    // 3. Monthly budget consumption insight
    if (totalBudgetAmount > 0) {
      const budgetUsedPct = Math.round((currentTotalExpense / totalBudgetAmount) * 100);
      let budgetTrend = 'positive';
      let title = `You have used ${budgetUsedPct}% of your budget`;
      let message = `You've spent ${round2(currentTotalExpense)} of your ${round2(totalBudgetAmount)} total budget.`;

      if (budgetUsedPct >= 100) {
        budgetTrend = 'negative';
        title = `Monthly budget exceeded by ${budgetUsedPct - 100}%`;
        message = `You have surpassed your planned monthly limit by ${round2(currentTotalExpense - totalBudgetAmount)}.`;
      } else if (budgetUsedPct >= 80) {
        budgetTrend = 'warning';
        title = `Warning: ${budgetUsedPct}% of budget used`;
        message = `You are nearing your monthly spending limit with only ${round2(totalBudgetAmount - currentTotalExpense)} remaining.`;
      }

      insights.push({
        id: 'budget-usage',
        type: 'budget',
        category: 'Budget',
        title,
        message,
        trend: budgetTrend,
        percentage: budgetUsedPct,
        isDeterministic: true,
      });
    }

    // 4. Savings comparison vs last month
    const currentSavings = round2(
      (await Transaction.aggregate([
        { $match: { user: userId, type: 'income', date: { $gte: startOfCurrentMonth, $lte: endOfCurrentMonth } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]))[0]?.total || 0
    ) - currentTotalExpense;

    const prevSavings = round2(
      (await Transaction.aggregate([
        { $match: { user: userId, type: 'income', date: { $gte: startOfPrevMonth, $lte: endOfPrevMonth } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]))[0]?.total || 0
    ) - prevTotalExpense;

    if (prevTotalExpense > 0 || prevSavings !== 0) {
      const savingsDelta = round2(currentSavings - prevSavings);
      if (savingsDelta !== 0) {
        insights.push({
          id: 'savings-delta',
          type: 'savings',
          category: 'Savings',
          title: savingsDelta > 0 ? `Saved more than last month` : `Saved less than last month`,
          message: savingsDelta > 0
            ? `You have saved ${Math.abs(savingsDelta)} more this month than at the same point last month!`
            : `Your net savings are down ${Math.abs(savingsDelta)} compared with last month.`,
          trend: savingsDelta > 0 ? 'positive' : 'negative',
          amount: Math.abs(savingsDelta),
          isDeterministic: true,
        });
      }
    }

    // Safe empty state fallback if user has very little data yet
    if (insights.length === 0) {
      insights.push({
        id: 'welcome-insight',
        type: 'info',
        category: 'Getting Started',
        title: 'Insights are generating',
        message: 'Log regular expenses and set category budgets to unlock deep automated spending trends and smart alerts.',
        trend: 'neutral',
        isDeterministic: true,
      });
    }

    res.status(200).json({
      success: true,
      insights,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get chart datasets for Analytics & Dashboard with dynamic period filtering
// @route   GET /api/analytics/charts
// @access  Private
exports.getCharts = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { period = 'thisMonth', startDate, endDate } = req.query;
    const now = new Date();

    let rangeStart;
    let rangeEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    if (period === '7d') {
      rangeStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      rangeStart.setHours(0, 0, 0, 0);
    } else if (period === 'thisMonth') {
      rangeStart = new Date(now.getFullYear(), now.getMonth(), 1);
      rangeEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    } else if (period === 'lastMonth') {
      rangeStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      rangeEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
    } else if (period === '3m') {
      rangeStart = new Date(now.getFullYear(), now.getMonth() - 2, 1);
      rangeEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    } else if (period === 'year') {
      rangeStart = new Date(now.getFullYear(), 0, 1);
      rangeEnd = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
    } else if (period === 'custom' && startDate && endDate) {
      rangeStart = new Date(startDate);
      rangeEnd = new Date(endDate);
      rangeEnd.setHours(23, 59, 59, 999);
    } else {
      rangeStart = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    // Fetch transactions in range
    const transactions = await Transaction.find({
      user: userId,
      date: { $gte: rangeStart, $lte: rangeEnd },
    }).sort({ date: 1 });

    // Grouping by interval: day (for 7d or single month) or month (for 3m, year)
    const isMonthlyGrouping = ['3m', 'year'].includes(period);

    const timelineMap = {};

    transactions.forEach((tx) => {
      const d = new Date(tx.date);
      let key;
      if (isMonthlyGrouping) {
        key = d.toLocaleString('default', { month: 'short' });
      } else {
        key = `${d.toLocaleString('default', { month: 'short' })} ${d.getDate()}`;
      }

      if (!timelineMap[key]) {
        timelineMap[key] = { label: key, income: 0, expense: 0, net: 0 };
      }

      if (tx.type === 'income') {
        timelineMap[key].income += tx.amount;
      } else {
        timelineMap[key].expense += tx.amount;
      }
    });

    const timeline = Object.values(timelineMap).map((item) => ({
      ...item,
      income: round2(item.income),
      expense: round2(item.expense),
      net: round2(item.income - item.expense),
    }));

    // Donut chart: Expense Breakdown by category
    const categoryTotals = {};
    let totalExpense = 0;

    transactions.forEach((tx) => {
      if (tx.type === 'expense') {
        categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount;
        totalExpense += tx.amount;
      }
    });

    // Standardized fintech palette colors for categories
    const categoryPalette = [
      '#8B5CF6', // purple
      '#FF718B', // coral pink
      '#42E8B4', // mint green
      '#38BDF8', // sky blue
      '#FBBF24', // amber
      '#F472B6', // rose
      '#A78BFA', // soft violet
      '#34D399', // emerald
      '#FB923C', // orange
      '#818CF8', // indigo
      '#94A3B8', // slate
    ];

    const categoryBreakdown = Object.entries(categoryTotals)
      .map(([name, value], index) => ({
        name,
        value: round2(value),
        percentage: totalExpense > 0 ? Math.round((value / totalExpense) * 100) : 0,
        color: categoryPalette[index % categoryPalette.length],
      }))
      .sort((a, b) => b.value - a.value);

    // Cash flow trends: cumulative net savings over time
    let cumulative = 0;
    const cashFlow = timeline.map((item) => {
      cumulative += item.net;
      return {
        label: item.label,
        cashFlow: round2(item.net),
        cumulative: round2(cumulative),
      };
    });

    res.status(200).json({
      success: true,
      period,
      range: { start: rangeStart, end: rangeEnd },
      timeline,
      categoryBreakdown,
      cashFlow,
      totalExpense: round2(totalExpense),
    });
  } catch (err) {
    next(err);
  }
};
