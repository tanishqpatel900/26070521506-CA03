import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Edit2, Trash2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useCurrency } from '../../context/CurrencyContext';
import { getCategoryMeta } from '../../utils/categoryIcons';
import ConfirmModal from '../common/ConfirmModal';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

const RecentTransactionsWidget = ({ transactions, onEdit, onRefresh, loading }) => {
  const { currency } = useCurrency();
  const { showToast } = useToast();
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/transactions/${deleteTarget._id}`);
      showToast('Transaction deleted successfully', 'success');
      if (onRefresh) onRefresh();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete transaction', 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="panel-card p-5 border border-[#262D4A] dark:border-[#262D4A] dark:bg-[#1B2035] bg-white rounded-2xl flex flex-col justify-between">
      <div className="flex items-center justify-between pb-3 border-b border-[#262D4A]/50 dark:border-[#262D4A]/50 border-gray-100">
        <div>
          <h3 className="text-base font-bold text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900">
            Recent Transactions
          </h3>
          <p className="text-xs text-[#9299B3] mt-0.5">
            Latest incoming and outgoing records
          </p>
        </div>
        <Link
          to="/transactions"
          className="flex items-center gap-1 text-xs font-semibold text-[#8B5CF6] hover:text-[#7C3AED] transition-colors"
        >
          View All <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="py-2 divide-y divide-[#262D4A]/40 dark:divide-[#262D4A]/40 divide-gray-100 overflow-x-auto">
        {loading ? (
          <div className="space-y-3 py-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-[#262D4A]/25 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : !transactions || transactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-xs text-[#9299B3]">No recent transactions logged.</p>
          </div>
        ) : (
          transactions.slice(0, 6).map((tx) => {
            const meta = getCategoryMeta(tx.category);
            const Icon = meta.icon;
            const isIncome = tx.type === 'income';

            return (
              <div
                key={tx._id}
                className="flex items-center justify-between py-3 hover:bg-[#15192C]/40 dark:hover:bg-[#15192C]/40 hover:bg-gray-50 px-2 rounded-xl transition-colors group"
              >
                {/* Left details */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="p-2.5 rounded-xl shrink-0"
                    style={{ backgroundColor: meta.bg, color: meta.color }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 truncate">
                    <p className="text-xs font-semibold text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900 truncate">
                      {tx.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#9299B3]">
                      <span>{tx.category}</span>
                      <span>•</span>
                      <span>{formatDate(tx.date)}</span>
                      <span>•</span>
                      <span className="hidden sm:inline">{tx.paymentMethod}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Amount & Action buttons on hover */}
                <div className="flex items-center gap-3 shrink-0 ml-4">
                  <div className="text-right">
                    <span
                      className={`text-xs font-bold flex items-center justify-end gap-0.5 ${
                        isIncome ? 'text-[#42E8B4]' : 'text-[#FF718B]'
                      }`}
                    >
                      {isIncome ? '+' : '-'}
                      {formatCurrency(tx.amount, currency)}
                    </span>
                    <span className="text-[10px] text-[#9299B3] block uppercase tracking-wider font-semibold">
                      {tx.type}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEdit && onEdit(tx)}
                      title="Edit"
                      className="p-1 rounded-lg text-[#9299B3] hover:text-[#8B5CF6] hover:bg-[#8B5CF6]/15 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(tx)}
                      title="Delete"
                      className="p-1 rounded-lg text-[#9299B3] hover:text-[#FF718B] hover:bg-[#FF718B]/15 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Transaction"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This will update your balances and budget calculations.`}
      />
    </div>
  );
};

export default RecentTransactionsWidget;
