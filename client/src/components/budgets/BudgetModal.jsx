import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X, DollarSign, Calendar, Tag } from 'lucide-react';
import { CATEGORIES } from '../../utils/categoryIcons';
import { useToast } from '../../context/ToastContext';
import { useCurrency } from '../../context/CurrencyContext';
import api from '../../services/api';

const budgetSchema = z.object({
  category: z.string().min(1, 'Please select a category'),
  budgetAmount: z.coerce.number().positive('Budget amount must be greater than 0'),
  month: z.coerce.number().min(1).max(12),
  year: z.coerce.number().min(2000),
});

const BudgetModal = ({ isOpen, onClose, onSave, budgetToEdit, defaultMonth, defaultYear }) => {
  const { showToast } = useToast();
  const { currency } = useCurrency();
  const [loading, setLoading] = useState(false);

  const now = new Date();
  const curMonth = defaultMonth || now.getMonth() + 1;
  const curYear = defaultYear || now.getFullYear();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      category: 'Overall',
      budgetAmount: '',
      month: curMonth,
      year: curYear,
    },
  });

  const selectedCategory = watch('category');

  useEffect(() => {
    if (budgetToEdit) {
      reset({
        category: budgetToEdit.category,
        budgetAmount: budgetToEdit.budgetAmount,
        month: budgetToEdit.month,
        year: budgetToEdit.year,
      });
    } else {
      reset({
        category: 'Overall',
        budgetAmount: '',
        month: curMonth,
        year: curYear,
      });
    }
  }, [budgetToEdit, isOpen, reset, curMonth, curYear]);

  if (!isOpen) return null;

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      if (budgetToEdit) {
        await api.put(`/budgets/${budgetToEdit._id}`, data);
        showToast('Budget updated successfully', 'success');
      } else {
        await api.post('/budgets', data);
        showToast('Budget created successfully', 'success');
      }

      if (onSave) onSave();
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save budget';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const budgetOptions = [
    { name: 'Overall', label: 'Overall Monthly Budget' },
    ...CATEGORIES.filter((c) => !['Salary', 'Freelance', 'Investments'].includes(c.name)),
  ];

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in">
      <div className="panel-card w-full max-w-md p-6 border border-[#262D4A] dark:border-[#262D4A] dark:bg-[#1B2035] bg-white rounded-2xl shadow-elevated">
        <div className="flex items-center justify-between pb-4 border-b border-[#262D4A]/50 dark:border-[#262D4A]/50 border-gray-100">
          <div>
            <h3 className="text-lg font-bold text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900">
              {budgetToEdit ? 'Edit Budget Limit' : 'Set Category Budget'}
            </h3>
            <p className="text-xs text-[#9299B3]">
              Configure spending limits with automatic warning thresholds
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9299B3] hover:text-[#F5F6FF] hover:bg-[#262D4A]/40 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
          {/* Category Selector */}
          <div>
            <label className="block text-xs font-semibold text-[#9299B3] mb-1.5">
              Category / Target
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#9299B3]">
                <Tag className="w-4 h-4" />
              </span>
              <select
                {...register('category')}
                disabled={!!budgetToEdit}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#15192C] dark:bg-[#15192C] bg-gray-50 border border-[#262D4A] dark:border-[#262D4A] border-gray-200 text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900 text-xs focus:outline-none focus:border-[#8B5CF6] cursor-pointer disabled:opacity-60"
              >
                {budgetOptions.map((opt) => (
                  <option key={opt.name} value={opt.name} className="bg-[#1B2035] text-[#F5F6FF]">
                    {opt.label || opt.name}
                  </option>
                ))}
              </select>
            </div>
            {errors.category && (
              <p className="mt-1 text-xs text-[#FF718B] font-medium">{errors.category.message}</p>
            )}
          </div>

          {/* Budget Limit Amount */}
          <div>
            <label className="block text-xs font-semibold text-[#9299B3] mb-1.5">
              Monthly Limit Amount ({currency})
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#9299B3]">
                <DollarSign className="w-4 h-4" />
              </span>
              <input
                type="number"
                step="0.01"
                placeholder="500.00"
                {...register('budgetAmount')}
                className={`w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#15192C] dark:bg-[#15192C] bg-gray-50 border ${
                  errors.budgetAmount ? 'border-[#FF718B]' : 'border-[#262D4A] dark:border-[#262D4A] border-gray-200'
                } text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900 text-base font-semibold focus:outline-none focus:border-[#8B5CF6]`}
              />
            </div>
            {errors.budgetAmount && (
              <p className="mt-1 text-xs text-[#FF718B] font-medium">{errors.budgetAmount.message}</p>
            )}
          </div>

          {/* Month & Year Selection */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#9299B3] mb-1.5">Month</label>
              <select
                {...register('month')}
                disabled={!!budgetToEdit}
                className="w-full px-3 py-2 rounded-xl bg-[#15192C] dark:bg-[#15192C] bg-gray-50 border border-[#262D4A] dark:border-[#262D4A] border-gray-200 text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900 text-xs focus:outline-none focus:border-[#8B5CF6] cursor-pointer disabled:opacity-60"
              >
                {months.map((m, idx) => (
                  <option key={m} value={idx + 1} className="bg-[#1B2035] text-[#F5F6FF]">
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#9299B3] mb-1.5">Year</label>
              <select
                {...register('year')}
                disabled={!!budgetToEdit}
                className="w-full px-3 py-2 rounded-xl bg-[#15192C] dark:bg-[#15192C] bg-gray-50 border border-[#262D4A] dark:border-[#262D4A] border-gray-200 text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900 text-xs focus:outline-none focus:border-[#8B5CF6] cursor-pointer disabled:opacity-60"
              >
                {[curYear - 1, curYear, curYear + 1].map((y) => (
                  <option key={y} value={y} className="bg-[#1B2035] text-[#F5F6FF]">
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Threshold Explanation Note */}
          <div className="p-3 rounded-xl bg-[#262D4A]/30 dark:bg-[#262D4A]/30 bg-gray-100 text-[11px] text-[#9299B3] space-y-1">
            <p className="font-semibold text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-800">
              Proactive Alert Thresholds:
            </p>
            <p>• Safe: Under 80% spending (Mint Green)</p>
            <p>• Alert: 80% to 99% of budget consumed (Purple / Amber)</p>
            <p>• Exceeded: 100% or more of budget surpassed (Coral Pink)</p>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#262D4A]/50 dark:border-[#262D4A]/50 border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 text-xs font-medium text-[#9299B3] hover:text-[#F5F6FF] rounded-xl hover:bg-[#262D4A]/30 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#8B5CF6] hover:bg-[#7C3AED] shadow-md shadow-[#8B5CF6]/30 transition-all disabled:opacity-60"
            >
              {loading ? 'Saving...' : budgetToEdit ? 'Save Changes' : 'Create Budget'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BudgetModal;
