import React from 'react';
import { Edit2, Trash2, ShieldCheck, AlertTriangle, ShieldAlert } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { useCurrency } from '../../context/CurrencyContext';
import { getCategoryMeta } from '../../utils/categoryIcons';

const BudgetCard = ({ budget, onEdit, onDelete }) => {
  const { currency } = useCurrency();
  const meta = getCategoryMeta(budget.category);
  const Icon = meta.icon;

  let barColor = 'bg-[#42E8B4]';
  let badgeClass = 'bg-[#42E8B4]/15 text-[#42E8B4] border-[#42E8B4]/30';
  let StatusIcon = ShieldCheck;
  let statusText = 'Safe';

  if (budget.percentage >= 100) {
    barColor = 'bg-[#FF718B]';
    badgeClass = 'bg-[#FF718B]/15 text-[#FF718B] border-[#FF718B]/30';
    StatusIcon = ShieldAlert;
    statusText = 'Budget Exceeded';
  } else if (budget.percentage >= 80) {
    barColor = 'bg-[#8B5CF6]';
    badgeClass = 'bg-[#8B5CF6]/15 text-[#8B5CF6] border-[#8B5CF6]/30';
    StatusIcon = AlertTriangle;
    statusText = '80% Warning';
  }

  return (
    <div className="panel-card p-5 border border-[#262D4A] dark:border-[#262D4A] dark:bg-[#1B2035] bg-white rounded-2xl flex flex-col justify-between hover:border-[#8B5CF6]/40 transition-all duration-200">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#262D4A]/50 dark:border-[#262D4A]/50 border-gray-100">
          <div className="flex items-center gap-3">
            <div
              className="p-2.5 rounded-xl shrink-0"
              style={{ backgroundColor: meta.bg, color: meta.color }}
            >
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900">
                {budget.category}
              </h4>
              <p className="text-[11px] text-[#9299B3]">
                Month {budget.month} / {budget.year}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit && onEdit(budget)}
              title="Edit Budget"
              className="p-1.5 rounded-lg text-[#9299B3] hover:text-[#8B5CF6] hover:bg-[#8B5CF6]/15 transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete && onDelete(budget)}
              title="Delete Budget"
              className="p-1.5 rounded-lg text-[#9299B3] hover:text-[#FF718B] hover:bg-[#FF718B]/15 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Progress Bar & Percentage */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold border ${badgeClass}`}>
              <StatusIcon className="w-3 h-3" />
              {statusText} ({budget.percentage}%)
            </span>
            <span className="text-xs font-semibold text-[#9299B3]">
              Limit: {formatCurrency(budget.budgetAmount, currency)}
            </span>
          </div>

          <div className="w-full h-2.5 rounded-full bg-[#15192C] dark:bg-[#15192C] bg-gray-200 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${barColor}`}
              style={{ width: `${Math.min(100, budget.percentage)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Numerical Metrics Footer */}
      <div className="grid grid-cols-2 gap-2 mt-5 pt-3 border-t border-[#262D4A]/40 dark:border-[#262D4A]/40 border-gray-100 text-xs">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-[#9299B3] block">
            Spent
          </span>
          <span className="font-bold text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900">
            {formatCurrency(budget.spent, currency)}
          </span>
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase tracking-wider text-[#9299B3] block">
            {budget.remaining >= 0 ? 'Remaining' : 'Over Limit'}
          </span>
          <span
            className={`font-bold ${
              budget.remaining >= 0 ? 'text-[#42E8B4]' : 'text-[#FF718B]'
            }`}
          >
            {formatCurrency(Math.abs(budget.remaining), currency)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BudgetCard;
