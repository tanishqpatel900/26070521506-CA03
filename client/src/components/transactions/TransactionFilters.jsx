import React from 'react';
import { Search, Filter, RotateCcw, ArrowUpDown, Calendar } from 'lucide-react';
import { CATEGORIES, PAYMENT_METHODS } from '../../utils/categoryIcons';

const TransactionFilters = ({
  search,
  onSearchChange,
  type,
  onTypeChange,
  category,
  onCategoryChange,
  paymentMethod,
  onPaymentMethodChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  sort,
  onSortChange,
  onResetFilters,
  totalCount,
}) => {
  return (
    <div className="panel-card p-4 sm:p-5 border border-[#262D4A] dark:border-[#262D4A] dark:bg-[#1B2035] bg-white rounded-2xl space-y-4">
      {/* Top Row: Search and Type Pills */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#9299B3]">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by description, title or notes..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#15192C] dark:bg-[#15192C] bg-gray-50 border border-[#262D4A] dark:border-[#262D4A] border-gray-200 text-xs sm:text-sm text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900 focus:outline-none focus:border-[#8B5CF6]"
          />
        </div>

        {/* Type Filter Buttons */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#15192C] dark:bg-[#15192C] bg-gray-100 border border-[#262D4A]/60 dark:border-[#262D4A]/60 border-gray-200 text-xs self-start sm:self-auto">
          {[
            { label: 'All Types', value: '' },
            { label: 'Income', value: 'income' },
            { label: 'Expense', value: 'expense' },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => onTypeChange(item.value)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                type === item.value
                  ? 'bg-[#8B5CF6] text-white shadow-sm font-semibold'
                  : 'text-[#9299B3] hover:text-[#F5F6FF]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Second Row: Detailed Dropdowns, Date Range, Sort, Reset */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-1">
        {/* Category Dropdown */}
        <div>
          <label className="block text-[11px] font-semibold text-[#9299B3] mb-1">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg bg-[#15192C] dark:bg-[#15192C] bg-gray-50 border border-[#262D4A] dark:border-[#262D4A] border-gray-200 text-xs text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900 focus:outline-none cursor-pointer"
          >
            <option value="All" className="bg-[#1B2035] text-[#F5F6FF]">
              All Categories
            </option>
            {CATEGORIES.map((c) => (
              <option key={c.name} value={c.name} className="bg-[#1B2035] text-[#F5F6FF]">
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Payment Method */}
        <div>
          <label className="block text-[11px] font-semibold text-[#9299B3] mb-1">
            Payment
          </label>
          <select
            value={paymentMethod}
            onChange={(e) => onPaymentMethodChange(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg bg-[#15192C] dark:bg-[#15192C] bg-gray-50 border border-[#262D4A] dark:border-[#262D4A] border-gray-200 text-xs text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900 focus:outline-none cursor-pointer"
          >
            <option value="All" className="bg-[#1B2035] text-[#F5F6FF]">
              All Methods
            </option>
            {PAYMENT_METHODS.map((m) => (
              <option key={m} value={m} className="bg-[#1B2035] text-[#F5F6FF]">
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-[11px] font-semibold text-[#9299B3] mb-1">
            From Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="w-full px-2 py-1.5 rounded-lg bg-[#15192C] dark:bg-[#15192C] bg-gray-50 border border-[#262D4A] dark:border-[#262D4A] border-gray-200 text-xs text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900 focus:outline-none"
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block text-[11px] font-semibold text-[#9299B3] mb-1">
            To Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="w-full px-2 py-1.5 rounded-lg bg-[#15192C] dark:bg-[#15192C] bg-gray-50 border border-[#262D4A] dark:border-[#262D4A] border-gray-200 text-xs text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900 focus:outline-none"
          />
        </div>

        {/* Sort */}
        <div>
          <label className="block text-[11px] font-semibold text-[#9299B3] mb-1">
            Sort Order
          </label>
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg bg-[#15192C] dark:bg-[#15192C] bg-gray-50 border border-[#262D4A] dark:border-[#262D4A] border-gray-200 text-xs text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900 focus:outline-none cursor-pointer"
          >
            <option value="newest" className="bg-[#1B2035] text-[#F5F6FF]">Newest First</option>
            <option value="oldest" className="bg-[#1B2035] text-[#F5F6FF]">Oldest First</option>
            <option value="highest" className="bg-[#1B2035] text-[#F5F6FF]">Highest Amount</option>
            <option value="lowest" className="bg-[#1B2035] text-[#F5F6FF]">Lowest Amount</option>
          </select>
        </div>

        {/* Clear Filters CTA */}
        <div className="flex flex-col justify-end">
          <button
            onClick={onResetFilters}
            className="flex items-center justify-center gap-1.5 w-full py-1.5 px-3 rounded-lg border border-[#262D4A] dark:border-[#262D4A] border-gray-200 text-xs font-medium text-[#9299B3] hover:text-[#F5F6FF] hover:bg-[#262D4A]/40 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset All
          </button>
        </div>
      </div>

      {/* Filtered Count Status Bar */}
      <div className="flex items-center justify-between pt-2 border-t border-[#262D4A]/40 dark:border-[#262D4A]/40 border-gray-100 text-xs text-[#9299B3]">
        <span>
          Showing <strong className="text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900">{totalCount}</strong> matching transactions
        </span>
        <span className="text-[11px] text-[#8B5CF6]">
          Real-time query filters applied
        </span>
      </div>
    </div>
  );
};

export default TransactionFilters;
