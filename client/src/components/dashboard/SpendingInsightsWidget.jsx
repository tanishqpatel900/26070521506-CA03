import React from 'react';
import { Sparkles, TrendingUp, TrendingDown, AlertCircle, CheckCircle, Shield } from 'lucide-react';
import { getCategoryMeta } from '../../utils/categoryIcons';

const SpendingInsightsWidget = ({ insights, loading }) => {
  return (
    <div className="panel-card p-5 border border-[#262D4A] dark:border-[#262D4A] dark:bg-[#1B2035] bg-white rounded-2xl flex flex-col justify-between">
      <div className="flex items-center justify-between pb-3 border-b border-[#262D4A]/50 dark:border-[#262D4A]/50 border-gray-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#8B5CF6]/15 text-[#8B5CF6]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900">
              Spending Insights
            </h3>
            <p className="text-xs text-[#9299B3]">
              Deterministic financial telemetry & patterns
            </p>
          </div>
        </div>
        <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#8B5CF6]/15 text-[#8B5CF6] border border-[#8B5CF6]/30">
          <Shield className="w-3 h-3" /> Real DB Analytics
        </span>
      </div>

      <div className="py-3 space-y-2.5">
        {loading ? (
          <div className="space-y-2.5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-[#262D4A]/25 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : !insights || insights.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-xs text-[#9299B3]">
              Log additional transactions to surface period-over-period insights.
            </p>
          </div>
        ) : (
          insights.map((insight, idx) => {
            const meta = getCategoryMeta(insight.category);
            const Icon = meta.icon;

            let borderClass = 'border-[#262D4A]/60 dark:border-[#262D4A]/60 border-gray-200';
            let trendBadge = null;

            if (insight.trend === 'positive') {
              borderClass = 'border-[#42E8B4]/30 hover:border-[#42E8B4]/60';
              trendBadge = (
                <span className="text-[10px] font-semibold text-[#42E8B4] flex items-center gap-1">
                  <TrendingDown className="w-3 h-3" /> Favorable
                </span>
              );
            } else if (insight.trend === 'negative') {
              borderClass = 'border-[#FF718B]/30 hover:border-[#FF718B]/60';
              trendBadge = (
                <span className="text-[10px] font-semibold text-[#FF718B] flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> Spending Spike
                </span>
              );
            } else if (insight.trend === 'warning') {
              borderClass = 'border-[#8B5CF6]/30 hover:border-[#8B5CF6]/60';
              trendBadge = (
                <span className="text-[10px] font-semibold text-[#8B5CF6] flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> Limit Alert
                </span>
              );
            }

            return (
              <div
                key={insight.id || idx}
                className={`p-3 rounded-xl bg-[#15192C]/60 dark:bg-[#15192C]/60 bg-gray-50 border ${borderClass} transition-all duration-200 flex items-start gap-3`}
              >
                <div
                  className="p-2 rounded-xl shrink-0 mt-0.5"
                  style={{ backgroundColor: meta.bg, color: meta.color }}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-semibold text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900 truncate">
                      {insight.title}
                    </h4>
                    {trendBadge}
                  </div>
                  <p className="text-[11px] text-[#9299B3] dark:text-[#9299B3] text-gray-600 mt-0.5 leading-relaxed">
                    {insight.message}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="pt-2 text-[10px] text-[#9299B3] dark:text-[#9299B3] text-gray-500 italic text-center">
        * Insights are mathematically computed from your real database history, comparing equivalent calendar ranges.
      </div>
    </div>
  );
};

export default SpendingInsightsWidget;
