const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');

dotenv.config();

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/flowfinance';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB for seeding...');

    // Clean existing demo user and demo records
    const demoEmail = 'demo@flowfinance.com';
    let demoUser = await User.findOne({ email: demoEmail });

    if (demoUser) {
      console.log('[Seed] Removing previous demo user records...');
      await Transaction.deleteMany({ user: demoUser._id });
      await Budget.deleteMany({ user: demoUser._id });
      await User.deleteOne({ _id: demoUser._id });
    }

    // Create Demo User
    demoUser = await User.create({
      name: 'Alexander Vance',
      email: demoEmail,
      password: 'password123',
      preferredCurrency: 'USD',
      themePreference: 'dark',
    });
    console.log(`[Seed] Demo user created: ${demoUser.email} (Password: password123)`);

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Helper to generate dates in current or previous month
    const getDate = (monthOffset, day) => {
      const d = new Date(currentYear, currentMonth + monthOffset, day);
      return d;
    };

    // Realistic transactions: Current Month & Last Month
    const transactions = [
      // Current Month Incomes
      {
        user: demoUser._id,
        title: 'Senior Product Designer Salary',
        amount: 5800.00,
        type: 'income',
        category: 'Salary',
        date: getDate(0, 1),
        paymentMethod: 'Bank Transfer',
        notes: 'Monthly enterprise payroll',
      },
      {
        user: demoUser._id,
        title: 'Fintech Mobile App Consulting',
        amount: 1450.00,
        type: 'income',
        category: 'Freelance',
        date: getDate(0, 10),
        paymentMethod: 'Bank Transfer',
        notes: 'Sprint 2 milestone payment',
      },
      {
        user: demoUser._id,
        title: 'S&P 500 Index Fund Dividend',
        amount: 220.50,
        type: 'income',
        category: 'Investments',
        date: getDate(0, 18),
        paymentMethod: 'Bank Transfer',
        notes: 'Quarterly reinvestment dividend',
      },

      // Current Month Expenses
      {
        user: demoUser._id,
        title: 'Whole Foods Organic Groceries',
        amount: 184.20,
        type: 'expense',
        category: 'Food',
        date: getDate(0, 3),
        paymentMethod: 'Credit Card',
        notes: 'Weekly pantry restocking and fresh produce',
      },
      {
        user: demoUser._id,
        title: 'Artisan Coffee & Bakery',
        amount: 24.50,
        type: 'expense',
        category: 'Food',
        date: getDate(0, 5),
        paymentMethod: 'Debit Card',
        notes: 'Morning coffee meeting',
      },
      {
        user: demoUser._id,
        title: 'Gigabit Fiber Internet & Mobile',
        amount: 95.00,
        type: 'expense',
        category: 'Bills',
        date: getDate(0, 6),
        paymentMethod: 'Credit Card',
        notes: 'High speed work-from-home plan',
      },
      {
        user: demoUser._id,
        title: 'Monthly Metro & Train Transit Pass',
        amount: 120.00,
        type: 'expense',
        category: 'Transport',
        date: getDate(0, 7),
        paymentMethod: 'Debit Card',
        notes: 'Unlimited regional travel',
      },
      {
        user: demoUser._id,
        title: 'Mechanical Ergonomic Keyboard',
        amount: 219.00,
        type: 'expense',
        category: 'Shopping',
        date: getDate(0, 9),
        paymentMethod: 'Credit Card',
        notes: 'Split custom wireless keyboard',
      },
      {
        user: demoUser._id,
        title: 'Electric & Renewable Energy Bill',
        amount: 135.40,
        type: 'expense',
        category: 'Bills',
        date: getDate(0, 12),
        paymentMethod: 'Bank Transfer',
        notes: 'Monthly utilities statement',
      },
      {
        user: demoUser._id,
        title: 'Fine Dining Bistro with Team',
        amount: 142.80,
        type: 'expense',
        category: 'Food',
        date: getDate(0, 14),
        paymentMethod: 'Credit Card',
        notes: 'Quarterly design sync dinner',
      },
      {
        user: demoUser._id,
        title: 'Uber City Ride to Tech Meetup',
        amount: 38.60,
        type: 'expense',
        category: 'Transport',
        date: getDate(0, 15),
        paymentMethod: 'Credit Card',
        notes: 'Downtown round trip',
      },
      {
        user: demoUser._id,
        title: 'Cloud & AI Developer Subscriptions',
        amount: 68.00,
        type: 'expense',
        category: 'Bills',
        date: getDate(0, 16),
        paymentMethod: 'Credit Card',
        notes: 'GitHub Copilot + Vercel Pro',
      },
      {
        user: demoUser._id,
        title: 'Weekend Cinema IMAX Tickets',
        amount: 45.00,
        type: 'expense',
        category: 'Entertainment',
        date: getDate(0, 19),
        paymentMethod: 'Debit Card',
        notes: 'Sci-fi film premiere',
      },
      {
        user: demoUser._id,
        title: 'Dental Checkup & Cleaning',
        amount: 110.00,
        type: 'expense',
        category: 'Healthcare',
        date: getDate(0, 21),
        paymentMethod: 'Debit Card',
        notes: 'Annual preventative care',
      },
      {
        user: demoUser._id,
        title: 'Design Systems Masterclass',
        amount: 149.00,
        type: 'expense',
        category: 'Education',
        date: getDate(0, 22),
        paymentMethod: 'Credit Card',
        notes: 'Advanced Figma & Tokens course',
      },

      // Previous Month Incomes (for Month-over-Month comparisons)
      {
        user: demoUser._id,
        title: 'Senior Product Designer Salary',
        amount: 5800.00,
        type: 'income',
        category: 'Salary',
        date: getDate(-1, 1),
        paymentMethod: 'Bank Transfer',
        notes: 'Monthly enterprise payroll',
      },
      {
        user: demoUser._id,
        title: 'Brand Identity Design Project',
        amount: 1200.00,
        type: 'income',
        category: 'Freelance',
        date: getDate(-1, 12),
        paymentMethod: 'Bank Transfer',
      },

      // Previous Month Expenses
      {
        user: demoUser._id,
        title: 'Supermarket Groceries',
        amount: 310.00,
        type: 'expense',
        category: 'Food',
        date: getDate(-1, 5),
        paymentMethod: 'Credit Card',
      },
      {
        user: demoUser._id,
        title: 'Subway & Gas',
        amount: 165.00,
        type: 'expense',
        category: 'Transport',
        date: getDate(-1, 8),
        paymentMethod: 'Debit Card',
      },
      {
        user: demoUser._id,
        title: 'Apartment Utilities & Internet',
        amount: 220.00,
        type: 'expense',
        category: 'Bills',
        date: getDate(-1, 15),
        paymentMethod: 'Bank Transfer',
      },
      {
        user: demoUser._id,
        title: 'Winter Parka & Boots',
        amount: 280.00,
        type: 'expense',
        category: 'Shopping',
        date: getDate(-1, 20),
        paymentMethod: 'Credit Card',
      },
      {
        user: demoUser._id,
        title: 'Concert & Streaming',
        amount: 95.00,
        type: 'expense',
        category: 'Entertainment',
        date: getDate(-1, 24),
        paymentMethod: 'Debit Card',
      },
    ];

    await Transaction.insertMany(transactions);
    console.log(`[Seed] Seeded ${transactions.length} realistic income and expense transactions.`);

    // Monthly Budgets for Current Month
    const currentBudgets = [
      {
        user: demoUser._id,
        category: 'Overall',
        budgetAmount: 3200.00,
        month: currentMonth + 1,
        year: currentYear,
      },
      {
        user: demoUser._id,
        category: 'Food',
        budgetAmount: 550.00,
        month: currentMonth + 1,
        year: currentYear,
      },
      {
        user: demoUser._id,
        category: 'Bills',
        budgetAmount: 400.00,
        month: currentMonth + 1,
        year: currentYear,
      },
      {
        user: demoUser._id,
        category: 'Transport',
        budgetAmount: 250.00,
        month: currentMonth + 1,
        year: currentYear,
      },
      {
        user: demoUser._id,
        category: 'Shopping',
        budgetAmount: 350.00,
        month: currentMonth + 1,
        year: currentYear,
      },
      {
        user: demoUser._id,
        category: 'Entertainment',
        budgetAmount: 180.00,
        month: currentMonth + 1,
        year: currentYear,
      },
      {
        user: demoUser._id,
        category: 'Healthcare',
        budgetAmount: 200.00,
        month: currentMonth + 1,
        year: currentYear,
      },
    ];

    await Budget.insertMany(currentBudgets);
    console.log(`[Seed] Seeded ${currentBudgets.length} budget limits for month ${currentMonth + 1}/${currentYear}.`);

    console.log('\n=========================================');
    console.log('✅ FlowFinance Database Seeded Successfully!');
    console.log('Demo Login Email:    demo@flowfinance.com');
    console.log('Demo Password:       password123');
    console.log('=========================================\n');

    process.exit(0);
  } catch (err) {
    console.error('[Seed Error]:', err);
    process.exit(1);
  }
};

seedData();
