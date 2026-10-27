import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCurrency } from '../../utils/formatters';
import { useCurrency } from '../../context/CurrencyContext';

const ExpenseDonutChart = ({ data, totalExpense, loading }) => {
  const { currency } = useCurrency();

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="panel-card p-2.5 rounded-xl border border-[#262D4A] dark:border-[#262D4A] dark:bg-[#1B2035] bg-white shadow-elevated text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="font-semibold text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900">
              {item.name}:
            </span>
            <span className="font-bold text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900">
              {formatCurrency(item.value, currency)} ({item.percentage}%)
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="panel-card p-5 border border-[#262D4A] dark:border-[#262D4A] dark:bg-[#1B2035] bg-white rounded-2xl flex flex-col justify-between">
      <div className="flex items-center justify-between pb-3 border-b border-[#262D4A]/50 dark:border-[#262D4A]/50 border-gray-100">
        <div>
          <h3 className="text-base font-bold text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900">
            Expense Allocation
          </h3>
          <p className="text-xs text-[#9299B3] mt-0.5">
            Category distribution of spending
          </p>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#FF718B]/15 text-[#FF718B]">
          {data?.length || 0} Categories
        </span>
      </div>

      {/* Donut Chart & Center Metric */}
      <div className="relative h-56 w-full flex items-center justify-center pt-2">
        {loading ? (
          <span className="text-xs text-[#9299B3]">Loading categories...</span>
        ) : !data || data.length === 0 ? (
          <div className="text-center p-4">
            <p className="text-xs text-[#9299B3]">No expense records to display</p>
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<CustomTooltip />} />
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={58}
                  outerRadius={84}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="#1B2035"
                  strokeWidth={2}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-[#9299B3]">
                Total Spent
              </span>
              <span className="text-sm font-bold text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900">
                {formatCurrency(totalExpense, currency)}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Top Categories Legend List */}
      <div className="pt-3 border-t border-[#262D4A]/40 dark:border-[#262D4A]/40 border-gray-100 max-h-28 overflow-y-auto space-y-1.5 pr-1">
        {data && data.slice(0, 4).map((cat, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 truncate">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
              <span className="text-[#9299B3] dark:text-[#9299B3] text-gray-600 truncate font-medium">
                {cat.name}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="font-semibold text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-800">
                {formatCurrency(cat.value, currency)}
              </span>
              <span className="text-[11px] text-[#9299B3] font-medium w-8 text-right">
                {cat.percentage}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseDonutChart;
