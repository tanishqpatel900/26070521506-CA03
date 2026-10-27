const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    category: {
      type: String,
      required: [true, 'Please specify a category or Overall for overall budget'],
      trim: true,
    },
    budgetAmount: {
      type: Number,
      required: [true, 'Please provide a budget amount'],
      min: [0.01, 'Budget amount must be greater than 0'],
      set: (val) => Math.round(val * 100) / 100,
    },
    month: {
      type: Number,
      required: [true, 'Please specify the month (1-12)'],
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: [true, 'Please specify the year'],
      min: 2000,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate budget for same user, category, month, and year
budgetSchema.index({ user: 1, category: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Budget', budgetSchema);
