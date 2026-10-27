import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '../../utils/formatters';
import { useCurrency } from '../../context/CurrencyContext';

const IncomeExpenseChart = ({ data, period, onPeriodChange, loading }) => {
  const { currency } = useCurrency();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="panel-card p-3 rounded-xl border border-[#262D4A] dark:border-[#262D4A] dark:bg-[#1B2035] bg-white shadow-elevated text-xs space-y-1.5">
          <p className="font-semibold text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900 border-b border-[#262D4A]/50 pb-1">
            {label}
          </p>
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-[#42E8B4] font-medium">
              <span className="w-2 h-2 rounded-full bg-[#42E8B4]" />
              Income:
            </span>
            <span className="font-bold text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900">
              {formatCurrency(payload[0]?.value, currency)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-[#FF718B] font-medium">
              <span className="w-2 h-2 rounded-full bg-[#FF718B]" />
              Expense:
            </span>
            <span className="font-bold text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900">
              {formatCurrency(payload[1]?.value, currency)}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  const periods = [
    { label: '7D', value: '7d' },
    { label: 'This Month', value: 'thisMonth' },
    { label: 'Last Month', value: 'lastMonth' },
    { label: '3M', value: '3m' },
    { label: 'Year', value: 'year' },
  ];

  return (
    <div className="panel-card p-5 border border-[#262D4A] dark:border-[#262D4A] dark:bg-[#1B2035] bg-white rounded-2xl flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#262D4A]/50 dark:border-[#262D4A]/50 border-gray-100">
        <div>
          <h3 className="text-base font-bold text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900">
            Cash Inflow vs Outflow
          </h3>
          <p className="text-xs text-[#9299B3] mt-0.5">
            Periodic comparative income and expense trends
          </p>
        </div>

        {/* Period Filter Buttons */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#15192C] dark:bg-[#15192C] bg-gray-100 border border-[#262D4A]/60 dark:border-[#262D4A]/60 border-gray-200 text-xs">
          {periods.map((p) => (
            <button
              key={p.value}
              onClick={() => onPeriodChange && onPeriodChange(p.value)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                period === p.value
                  ? 'bg-[#8B5CF6] text-white shadow-sm font-semibold'
                  : 'text-[#9299B3] hover:text-[#F5F6FF]'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 sm:h-72 w-full pt-4">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <span className="text-xs text-[#9299B3]">Updating visual telemetry...</span>
          </div>
        ) : !data || data.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4">
            <p className="text-sm font-semibold text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-800">
              No transactions recorded in this period
            </p>
            <p className="text-xs text-[#9299B3] mt-1 max-w-xs">
              Log an income or expense transaction to visualize your cashflow dynamics.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#42E8B4" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#42E8B4" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF718B" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#FF718B" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#262D4A" opacity={0.5} vertical={false} />
              <XAxis
                dataKey="label"
                stroke="#9299B3"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#9299B3"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `$${val}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="income"
                stroke="#42E8B4"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#incomeGrad)"
              />
              <Area
                type="monotone"
                dataKey="expense"
                stroke="#FF718B"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#expenseGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 pt-3 border-t border-[#262D4A]/40 dark:border-[#262D4A]/40 border-gray-100 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#42E8B4]" />
          <span className="text-[#9299B3] font-medium">Income Inflow</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF718B]" />
          <span className="text-[#9299B3] font-medium">Expense Outflow</span>
        </div>
      </div>
    </div>
  );
};

export default IncomeExpenseChart;
