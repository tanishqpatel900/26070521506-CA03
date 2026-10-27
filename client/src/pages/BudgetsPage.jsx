import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Plus, PieChart, ShieldAlert, AlertTriangle, ShieldCheck, Calendar } from 'lucide-react';
import BudgetCard from '../components/budgets/BudgetCard';
import BudgetModal from '../components/budgets/BudgetModal';
import ConfirmModal from '../components/common/ConfirmModal';
import { formatCurrency } from '../utils/formatters';
import { useCurrency } from '../context/CurrencyContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

const BudgetsPage = () => {
  const { selectedMonth, selectedYear } = useOutletContext();
  const { currency } = useCurrency();
  const { showToast } = useToast();

  const [budgets, setBudgets] = useState([]);
  const [totalBudgeted, setTotalBudgeted] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [budgetToEdit, setBudgetToEdit] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchBudgets = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/budgets?month=${selectedMonth}&year=${selectedYear}`);
      if (res.data.success) {
        setBudgets(res.data.budgets || []);
        setTotalBudgeted(res.data.totalBudgeted || 0);
        setTotalSpent(res.data.totalSpent || 0);
      }
    } catch (err) {
      console.error('Failed to load budgets:', err);
      showToast('Error loading budgets', 'error');
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear, showToast]);

  useEffect(() => {
    fetchBudgets();

    const handleRefresh = () => fetchBudgets();
    window.addEventListener('flowfinance:refresh', handleRefresh);
    return () => window.removeEventListener('flowfinance:refresh', handleRefresh);
  }, [fetchBudgets]);

  const handleDeleteBudget = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/budgets/${deleteTarget._id}`);
      showToast('Budget limit removed', 'success');
      fetchBudgets();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete budget', 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  const overallBudget = budgets.find((b) => b.category.toLowerCase() === 'overall');
  const categoryBudgets = budgets.filter((b) => b.category.toLowerCase() !== 'overall');

  const overallSpent = totalSpent;
  const overallLimit = overallBudget ? overallBudget.budgetAmount : totalBudgeted;
  const overallPct = overallLimit > 0 ? Math.round((overallSpent / overallLimit) * 100) : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900">
            Monthly Budget Manager
          </h2>
          <p className="text-xs text-[#9299B3]">
            Target limits, predictive thresholds, and category spend tracking
          </p>
        </div>

        <button
          onClick={() => {
            setBudgetToEdit(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#8B5CF6] hover:bg-[#7C3AED] shadow-md shadow-[#8B5CF6]/30 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Create Budget Limit
        </button>
      </div>

      {/* Overall Month Budget Banner Card */}
      <div className="panel-card p-6 border border-[#262D4A] dark:border-[#262D4A] dark:bg-[#1B2035] bg-white rounded-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#8B5CF6]/20 text-[#8B5CF6]">
                Month {selectedMonth}/{selectedYear} Overall Health
              </span>
              {overallPct >= 100 ? (
                <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#FF718B]/20 text-[#FF718B] flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" /> Exceeded by {overallPct - 100}%
                </span>
              ) : overallPct >= 80 ? (
                <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#8B5CF6]/20 text-[#8B5CF6] flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> 80%+ Alert
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#42E8B4]/20 text-[#42E8B4] flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Under Budget Limit
                </span>
              )}
            </div>

            <h3 className="text-2xl font-bold text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900">
              {formatCurrency(overallSpent, currency)}{' '}
              <span className="text-sm font-normal text-[#9299B3]">
                spent of {formatCurrency(overallLimit, currency)} planned
              </span>
            </h3>

            <p className="text-xs text-[#9299B3]">
              {overallLimit - overallSpent >= 0
                ? `${formatCurrency(overallLimit - overallSpent, currency)} left in your monthly allowance`
                : `${formatCurrency(Math.abs(overallLimit - overallSpent), currency)} over planned threshold`}
            </p>
          </div>

          <div className="w-full lg:w-72 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-[#9299B3]">Budget Consumed</span>
              <span className={overallPct >= 100 ? 'text-[#FF718B]' : overallPct >= 80 ? 'text-[#8B5CF6]' : 'text-[#42E8B4]'}>
                {overallPct}%
              </span>
            </div>

            <div className="w-full h-3 rounded-full bg-[#15192C] dark:bg-[#15192C] bg-gray-200 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  overallPct >= 100 ? 'bg-[#FF718B]' : overallPct >= 80 ? 'bg-[#8B5CF6]' : 'bg-[#42E8B4]'
                }`}
                style={{ width: `${Math.min(100, overallPct)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Category Budgets Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900">
            Category Breakdown ({categoryBudgets.length})
          </h3>
          <span className="text-xs text-[#9299B3]">
            Threshold alerts trigger automatically at 80% and 100%
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-44 bg-[#1B2035]/60 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : categoryBudgets.length === 0 ? (
          <div className="panel-card p-12 text-center rounded-2xl border border-[#262D4A] dark:border-[#262D4A]">
            <PieChart className="w-12 h-12 text-[#9299B3]/40 mx-auto mb-3" />
            <h4 className="text-base font-semibold text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-800">
              No category budgets established for this month
            </h4>
            <p className="text-xs text-[#9299B3] mt-1 max-w-sm mx-auto">
              Create category limits for Food, Transport, Bills, or Shopping to safeguard your savings goals.
            </p>
            <button
              onClick={() => {
                setBudgetToEdit(null);
                setIsModalOpen(true);
              }}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#8B5CF6] hover:bg-[#7C3AED] shadow-sm transition-all"
            >
              + Create Category Budget
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryBudgets.map((b) => (
              <BudgetCard
                key={b._id}
                budget={b}
                onEdit={(item) => {
                  setBudgetToEdit(item);
                  setIsModalOpen(true);
                }}
                onDelete={(item) => setDeleteTarget(item)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create / Edit Budget Modal */}
      <BudgetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={fetchBudgets}
        budgetToEdit={budgetToEdit}
        defaultMonth={selectedMonth}
        defaultYear={selectedYear}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteBudget}
        title="Delete Budget Target"
        message={`Are you sure you want to delete the budget limit for "${deleteTarget?.category}"?`}
      />
    </div>
  );
};

export default BudgetsPage;
