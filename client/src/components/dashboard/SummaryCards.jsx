import React from 'react';
import { Wallet, TrendingUp, TrendingDown, PiggyBank, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { useCurrency } from '../../context/CurrencyContext';

const SummaryCards = ({ summary, loading }) => {
  const { currency } = useCurrency();

  const cards = [
    {
      title: 'Total Balance',
      amount: summary?.totalBalance || 0,
      icon: Wallet,
      iconColor: 'text-[#8B5CF6]',
      iconBg: 'bg-[#8B5CF6]/15',
      trendText: 'Net accumulated wealth',
      trendPositive: (summary?.totalBalance || 0) >= 0,
    },
    {
      title: 'Total Income',
      amount: summary?.totalIncome || 0,
      icon: TrendingUp,
      iconColor: 'text-[#42E8B4]',
      iconBg: 'bg-[#42E8B4]/15',
      badge: summary?.comparisons?.incomeChangePct !== undefined
        ? `${summary.comparisons.incomeChangePct >= 0 ? '+' : ''}${summary.comparisons.incomeChangePct}% vs last month`
        : null,
      trendPositive: (summary?.comparisons?.incomeChangePct || 0) >= 0,
    },
    {
      title: 'Total Expenses',
      amount: summary?.totalExpenses || 0,
      icon: TrendingDown,
      iconColor: 'text-[#FF718B]',
      iconBg: 'bg-[#FF718B]/15',
      badge: summary?.comparisons?.expenseChangePct !== undefined
        ? `${summary.comparisons.expenseChangePct >= 0 ? '+' : ''}${summary.comparisons.expenseChangePct}% vs last month`
        : null,
      // For expenses, higher expense is negative trend
      trendPositive: (summary?.comparisons?.expenseChangePct || 0) <= 0,
    },
    {
      title: 'Savings Rate',
      amount: `${summary?.savingsRate || 0}%`,
      isRaw: true,
      icon: PiggyBank,
      iconColor: 'text-[#38BDF8]',
      iconBg: 'bg-[#38BDF8]/15',
      badge: summary?.comparisons?.savingsDelta !== undefined
        ? `${summary.comparisons.savingsDelta >= 0 ? '+' : ''}${formatCurrency(summary.comparisons.savingsDelta, currency)} saved vs last mo`
        : null,
      trendPositive: (summary?.comparisons?.savingsDelta || 0) >= 0,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="panel-card p-5 border border-[#262D4A] dark:border-[#262D4A] dark:bg-[#1B2035] bg-white rounded-2xl flex flex-col justify-between hover:border-[#8B5CF6]/50 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tracking-wide text-[#9299B3] dark:text-[#9299B3] text-gray-500 uppercase">
                {card.title}
              </span>
              <div className={`p-2.5 rounded-xl ${card.iconBg} ${card.iconColor}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-2xl font-bold tracking-tight text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900">
                {loading ? (
                  <span className="inline-block w-24 h-7 bg-[#262D4A]/50 animate-pulse rounded-lg" />
                ) : card.isRaw ? (
                  card.amount
                ) : (
                  formatCurrency(card.amount, currency)
                )}
              </h3>

              <div className="flex items-center gap-1.5 mt-2.5">
                {card.badge ? (
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                      card.trendPositive
                        ? 'text-[#42E8B4] bg-[#42E8B4]/15'
                        : 'text-[#FF718B] bg-[#FF718B]/15'
                    }`}
                  >
                    {card.trendPositive ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    )}
                    {card.badge}
                  </span>
                ) : (
                  <span className="text-[11px] text-[#9299B3] dark:text-[#9299B3] text-gray-500 font-medium">
                    {card.trendText}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SummaryCards;
