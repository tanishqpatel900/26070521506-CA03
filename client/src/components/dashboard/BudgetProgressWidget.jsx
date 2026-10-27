import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, AlertTriangle, ShieldCheck, ShieldAlert } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { useCurrency } from '../../context/CurrencyContext';
import { getCategoryMeta } from '../../utils/categoryIcons';

const BudgetProgressWidget = ({ budgets, loading }) => {
  const { currency } = useCurrency();

  return (
    <div className="panel-card p-5 border border-[#262D4A] dark:border-[#262D4A] dark:bg-[#1B2035] bg-white rounded-2xl flex flex-col justify-between">
      <div className="flex items-center justify-between pb-3 border-b border-[#262D4A]/50 dark:border-[#262D4A]/50 border-gray-100">
        <div>
          <h3 className="text-base font-bold text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900">
            Monthly Budget Health
          </h3>
          <p className="text-xs text-[#9299B3] mt-0.5">
            Real-time threshold tracking & alerts
          </p>
        </div>
        <Link
          to="/budgets"
          className="flex items-center gap-1 text-xs font-semibold text-[#8B5CF6] hover:text-[#7C3AED] transition-colors"
        >
          Manage <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="py-3 space-y-4">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-[#262D4A]/30 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : !budgets || budgets.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-xs text-[#9299B3]">No active budgets defined this month.</p>
            <Link
              to="/budgets"
              className="mt-2 inline-block text-xs font-semibold text-[#8B5CF6] hover:underline"
            >
              + Create Category Budget
            </Link>
          </div>
        ) : (
          budgets.slice(0, 4).map((b) => {
            const meta = getCategoryMeta(b.category);
            const Icon = meta.icon;

            // Color coding based on exact threshold rules:
            // Safe: <80% (mint green)
            // Warning: 80% - 99% (purple / warning amber)
            // Exceeded: >=100% (coral pink)
            let barColor = 'bg-[#42E8B4]';
            let badgeBg = 'bg-[#42E8B4]/15 text-[#42E8B4]';
            let statusText = 'Safe';
            let StatusIcon = ShieldCheck;

            if (b.status === 'exceeded' || b.percentage >= 100) {
              barColor = 'bg-[#FF718B]';
              badgeBg = 'bg-[#FF718B]/15 text-[#FF718B]';
              statusText = 'Exceeded';
              StatusIcon = ShieldAlert;
            } else if (b.status === 'warning' || b.percentage >= 80) {
              barColor = 'bg-[#8B5CF6]';
              badgeBg = 'bg-[#8B5CF6]/15 text-[#8B5CF6]';
              statusText = '80%+ Alert';
              StatusIcon = AlertTriangle;
            }

            return (
              <div key={b._id || b.category} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div
                      className="p-1.5 rounded-lg shrink-0"
                      style={{ backgroundColor: meta.bg, color: meta.color }}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-semibold text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900">
                      {b.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[#9299B3]">
                      {formatCurrency(b.spent, currency)} / {formatCurrency(b.budgetAmount, currency)}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 ${badgeBg}`}>
                      <StatusIcon className="w-3 h-3" />
                      {b.percentage}%
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 rounded-full bg-[#15192C] dark:bg-[#15192C] bg-gray-200 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                    style={{ width: `${Math.min(100, b.percentage)}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="pt-3 border-t border-[#262D4A]/40 dark:border-[#262D4A]/40 border-gray-100 flex items-center justify-between text-[11px] text-[#9299B3]">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#42E8B4]" /> &lt;80% Safe
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#8B5CF6]" /> 80-99% Warning
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#FF718B]" /> &ge;100% Exceeded
        </span>
      </div>
    </div>
  );
};

export default BudgetProgressWidget;
