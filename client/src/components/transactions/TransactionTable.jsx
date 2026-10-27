import React, { useState } from 'react';
import { Edit2, Trash2, ChevronLeft, ChevronRight, ArrowUpRight, ArrowDownRight, Tag } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useCurrency } from '../../context/CurrencyContext';
import { getCategoryMeta } from '../../utils/categoryIcons';
import ConfirmModal from '../common/ConfirmModal';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

const TransactionTable = ({
  transactions,
  loading,
  currentPage,
  totalPages,
  totalCount,
  onPageChange,
  onEdit,
  onRefresh,
}) => {
  const { currency } = useCurrency();
  const { showToast } = useToast();
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/transactions/${deleteTarget._id}`);
      showToast('Transaction removed successfully', 'success');
      if (onRefresh) onRefresh();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete transaction', 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="panel-card border border-[#262D4A] dark:border-[#262D4A] dark:bg-[#1B2035] bg-white rounded-2xl overflow-hidden flex flex-col justify-between">
      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#15192C] dark:bg-[#15192C] bg-gray-100 border-b border-[#262D4A]/60 dark:border-[#262D4A]/60 border-gray-200 text-[#9299B3] uppercase tracking-wider font-semibold">
            <tr>
              <th className="py-3 px-4">Transaction</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Payment Method</th>
              <th className="py-3 px-4 text-right">Amount</th>
              <th className="py-3 px-4 text-center">Type</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#262D4A]/30 dark:divide-[#262D4A]/30 divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan="7" className="py-12 text-center text-[#9299B3]">
                  Fetching transaction ledger...
                </td>
              </tr>
            ) : !transactions || transactions.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Tag className="w-8 h-8 text-[#9299B3]/40" />
                    <p className="text-sm font-semibold text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-800">
                      No transactions match your criteria
                    </p>
                    <p className="text-xs text-[#9299B3]">
                      Try resetting filters or adding a new transaction.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              transactions.map((tx) => {
                const meta = getCategoryMeta(tx.category);
                const Icon = meta.icon;
                const isIncome = tx.type === 'income';

                return (
                  <tr
                    key={tx._id}
                    className="hover:bg-[#15192C]/40 dark:hover:bg-[#15192C]/40 hover:bg-gray-50/70 transition-colors group"
                  >
                    {/* Title & Notes */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="p-2 rounded-xl shrink-0"
                          style={{ backgroundColor: meta.bg, color: meta.color }}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 max-w-xs truncate">
                          <p className="font-semibold text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900 truncate">
                            {tx.title}
                          </p>
                          {tx.notes && (
                            <p className="text-[11px] text-[#9299B3] truncate mt-0.5">
                              {tx.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 text-[#9299B3] dark:text-[#9299B3] text-gray-600 font-medium">
                      {tx.category}
                    </td>

                    {/* Date */}
                    <td className="py-3 px-4 text-[#9299B3] dark:text-[#9299B3] text-gray-600">
                      {formatDate(tx.date)}
                    </td>

                    {/* Payment Method */}
                    <td className="py-3 px-4 text-[#9299B3] dark:text-[#9299B3] text-gray-600">
                      <span className="px-2 py-0.5 rounded-md bg-[#262D4A]/30 dark:bg-[#262D4A]/30 bg-gray-100 text-[11px]">
                        {tx.paymentMethod}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="py-3 px-4 text-right">
                      <span
                        className={`font-bold text-sm ${
                          isIncome ? 'text-[#42E8B4]' : 'text-[#FF718B]'
                        }`}
                      >
                        {isIncome ? '+' : '-'}
                        {formatCurrency(tx.amount, currency)}
                      </span>
                    </td>

                    {/* Type Indicator */}
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          isIncome
                            ? 'bg-[#42E8B4]/15 text-[#42E8B4]'
                            : 'bg-[#FF718B]/15 text-[#FF718B]'
                        }`}
                      >
                        {isIncome ? (
                          <ArrowUpRight className="w-3 h-3" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3" />
                        )}
                        {tx.type}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onEdit && onEdit(tx)}
                          title="Edit transaction"
                          className="p-1.5 rounded-lg text-[#9299B3] hover:text-[#8B5CF6] hover:bg-[#8B5CF6]/15 transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(tx)}
                          title="Delete transaction"
                          className="p-1.5 rounded-lg text-[#9299B3] hover:text-[#FF718B] hover:bg-[#FF718B]/15 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 border-t border-[#262D4A]/50 dark:border-[#262D4A]/50 border-gray-100 text-xs text-[#9299B3]">
          <div>
            Page <strong className="text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900">{currentPage}</strong> of{' '}
            <strong className="text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900">{totalPages}</strong> (Total {totalCount} records)
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#262D4A] dark:border-[#262D4A] border-gray-200 text-[#9299B3] hover:text-[#F5F6FF] hover:bg-[#262D4A]/40 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Previous
            </button>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#262D4A] dark:border-[#262D4A] border-gray-200 text-[#9299B3] hover:text-[#F5F6FF] hover:bg-[#262D4A]/40 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Transaction"
        message={`Are you sure you want to permanently delete "${deleteTarget?.title}"? This cannot be undone.`}
      />
    </div>
  );
};

export default TransactionTable;
