import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X, ArrowDownRight, ArrowUpRight, Calendar, DollarSign, FileText, Tag, CreditCard } from 'lucide-react';
import { CATEGORIES, PAYMENT_METHODS } from '../../utils/categoryIcons';
import { useToast } from '../../context/ToastContext';
import { useCurrency } from '../../context/CurrencyContext';
import api from '../../services/api';

const transactionSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').max(100, 'Title too long'),
  amount: z.coerce.number().positive('Amount must be greater than 0'),
  type: z.enum(['income', 'expense']),
  category: z.string().min(1, 'Please select a category'),
  date: z.string().min(1, 'Please select a valid date'),
  paymentMethod: z.string().min(1, 'Please select a payment method'),
  notes: z.string().max(500, 'Notes too long').optional(),
  currency: z.string().default('USD'),
});

const TransactionModal = ({ isOpen, onClose, onSave, transactionToEdit }) => {
  const { showToast } = useToast();
  const { currency: userCurrency } = useCurrency();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      title: '',
      amount: '',
      type: 'expense',
      category: 'Food',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'Debit Card',
      notes: '',
      currency: userCurrency || 'USD',
    },
  });

  const selectedType = watch('type');
  const selectedCategory = watch('category');

  // Populate fields when editing an existing transaction
  useEffect(() => {
    if (transactionToEdit) {
      reset({
        title: transactionToEdit.title,
        amount: transactionToEdit.amount,
        type: transactionToEdit.type,
        category: transactionToEdit.category,
        date: new Date(transactionToEdit.date).toISOString().split('T')[0],
        paymentMethod: transactionToEdit.paymentMethod || 'Debit Card',
        notes: transactionToEdit.notes || '',
        currency: transactionToEdit.currency || userCurrency || 'USD',
      });
    } else {
      reset({
        title: '',
        amount: '',
        type: 'expense',
        category: 'Food',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'Debit Card',
        notes: '',
        currency: userCurrency || 'USD',
      });
    }
  }, [transactionToEdit, isOpen, reset, userCurrency]);

  if (!isOpen) return null;

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      let res;
      if (transactionToEdit) {
        res = await api.put(`/transactions/${transactionToEdit._id}`, data);
        showToast('Transaction updated successfully', 'success');
      } else {
        res = await api.post('/transactions', data);
        showToast('Transaction created successfully', 'success');
      }

      if (onSave) onSave(res.data.transaction);
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save transaction';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="panel-card w-full max-w-lg p-6 my-8 border border-[#262D4A] dark:border-[#262D4A] dark:bg-[#1B2035] bg-white rounded-2xl shadow-elevated relative max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#262D4A]/50 dark:border-[#262D4A]/50 border-gray-100 shrink-0">
          <div>
            <h3 className="text-lg font-bold text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900">
              {transactionToEdit ? 'Edit Transaction' : 'Quick Add Transaction'}
            </h3>
            <p className="text-xs text-[#9299B3]">
              {transactionToEdit
                ? 'Update transaction details and category'
                : 'Log income or expenses to track in your budget'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9299B3] hover:text-[#F5F6FF] hover:bg-[#262D4A]/40 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4 overflow-y-auto pr-1">
          {/* Income vs Expense Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[#15192C] dark:bg-[#15192C] bg-gray-100 border border-[#262D4A]/60 dark:border-[#262D4A]/60 border-gray-200">
            <button
              type="button"
              onClick={() => {
                setValue('type', 'expense');
                if (['Salary', 'Freelance', 'Investments'].includes(selectedCategory)) {
                  setValue('category', 'Food');
                }
              }}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                selectedType === 'expense'
                  ? 'bg-[#FF718B] text-white shadow-md shadow-[#FF718B]/25'
                  : 'text-[#9299B3] hover:text-[#F5F6FF]'
              }`}
            >
              <ArrowDownRight className="w-4 h-4" />
              Expense
            </button>
            <button
              type="button"
              onClick={() => {
                setValue('type', 'income');
                if (!['Salary', 'Freelance', 'Investments'].includes(selectedCategory)) {
                  setValue('category', 'Salary');
                }
              }}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                selectedType === 'income'
                  ? 'bg-[#42E8B4] text-[#101323] shadow-md shadow-[#42E8B4]/25'
                  : 'text-[#9299B3] hover:text-[#F5F6FF]'
              }`}
            >
              <ArrowUpRight className="w-4 h-4" />
              Income
            </button>
          </div>

          {/* Amount & Currency */}
          <div>
            <label className="block text-xs font-semibold text-[#9299B3] mb-1.5">
              Amount ({watch('currency')})
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#9299B3]">
                <DollarSign className="w-4 h-4" />
              </span>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register('amount')}
                className={`w-full pl-9 pr-24 py-2.5 rounded-xl bg-[#15192C] dark:bg-[#15192C] bg-gray-50 border ${
                  errors.amount ? 'border-[#FF718B]' : 'border-[#262D4A] dark:border-[#262D4A] border-gray-200'
                } text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900 text-base font-semibold focus:outline-none focus:border-[#8B5CF6]`}
              />
              <div className="absolute inset-y-0 right-1 flex items-center">
                <select
                  {...register('currency')}
                  className="bg-transparent text-xs font-semibold text-[#9299B3] focus:outline-none px-2 py-1 cursor-pointer"
                >
                  {['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD', 'JPY', 'SGD'].map((cur) => (
                    <option key={cur} value={cur} className="bg-[#1B2035] text-[#F5F6FF]">
                      {cur}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {errors.amount && (
              <p className="mt-1 text-xs text-[#FF718B] font-medium">{errors.amount.message}</p>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-[#9299B3] mb-1.5">
              Title / Description
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#9299B3]">
                <FileText className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="e.g. Whole Foods Groceries, Tech Salary"
                {...register('title')}
                className={`w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#15192C] dark:bg-[#15192C] bg-gray-50 border ${
                  errors.title ? 'border-[#FF718B]' : 'border-[#262D4A] dark:border-[#262D4A] border-gray-200'
                } text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900 text-sm focus:outline-none focus:border-[#8B5CF6]`}
              />
            </div>
            {errors.title && (
              <p className="mt-1 text-xs text-[#FF718B] font-medium">{errors.title.message}</p>
            )}
          </div>

          {/* Category Selector Grid */}
          <div>
            <label className="block text-xs font-semibold text-[#9299B3] mb-1.5">Category</label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-36 overflow-y-auto p-1.5 rounded-xl bg-[#15192C] dark:bg-[#15192C] bg-gray-50 border border-[#262D4A]/60 dark:border-[#262D4A]/60 border-gray-200">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.name;
                return (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => setValue('category', cat.name)}
                    className={`flex items-center gap-2 p-2 rounded-lg text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-[#8B5CF6] text-white shadow-sm'
                        : 'text-[#9299B3] hover:text-[#F5F6FF] hover:bg-[#1B2035] dark:hover:bg-[#1B2035] hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{cat.name}</span>
                  </button>
                );
              })}
            </div>
            {errors.category && (
              <p className="mt-1 text-xs text-[#FF718B] font-medium">{errors.category.message}</p>
            )}
          </div>

          {/* Date & Payment Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#9299B3] mb-1.5">Date</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#9299B3]">
                  <Calendar className="w-4 h-4" />
                </span>
                <input
                  type="date"
                  {...register('date')}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#15192C] dark:bg-[#15192C] bg-gray-50 border border-[#262D4A] dark:border-[#262D4A] border-gray-200 text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900 text-xs focus:outline-none focus:border-[#8B5CF6]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#9299B3] mb-1.5">
                Payment Method
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#9299B3]">
                  <CreditCard className="w-4 h-4" />
                </span>
                <select
                  {...register('paymentMethod')}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#15192C] dark:bg-[#15192C] bg-gray-50 border border-[#262D4A] dark:border-[#262D4A] border-gray-200 text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900 text-xs focus:outline-none focus:border-[#8B5CF6] cursor-pointer"
                >
                  {PAYMENT_METHODS.map((method) => (
                    <option key={method} value={method} className="bg-[#1B2035] text-[#F5F6FF]">
                      {method}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-[#9299B3] mb-1.5">
              Notes (Optional)
            </label>
            <textarea
              rows="2"
              placeholder="Additional context or merchant details..."
              {...register('notes')}
              className="w-full px-3.5 py-2 rounded-xl bg-[#15192C] dark:bg-[#15192C] bg-gray-50 border border-[#262D4A] dark:border-[#262D4A] border-gray-200 text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900 text-xs focus:outline-none focus:border-[#8B5CF6]"
            />
          </div>

          {/* Footer CTAs */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#262D4A]/50 dark:border-[#262D4A]/50 border-gray-100 shrink-0">
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
              {loading ? 'Saving...' : transactionToEdit ? 'Save Changes' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
