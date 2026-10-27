import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import SummaryCards from '../components/dashboard/SummaryCards';
import IncomeExpenseChart from '../components/dashboard/IncomeExpenseChart';
import ExpenseDonutChart from '../components/dashboard/ExpenseDonutChart';
import BudgetProgressWidget from '../components/dashboard/BudgetProgressWidget';
import SpendingInsightsWidget from '../components/dashboard/SpendingInsightsWidget';
import RecentTransactionsWidget from '../components/dashboard/RecentTransactionsWidget';
import api from '../services/api';

const DashboardPage = () => {
  const { selectedMonth, selectedYear, openAddModal } = useOutletContext();

  const [summary, setSummary] = useState(null);
  const [insights, setInsights] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [totalExpense, setTotalExpense] = useState(0);
  const [budgets, setBudgets] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartPeriod, setChartPeriod] = useState('thisMonth');

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);

      const [summaryRes, insightsRes, chartsRes, budgetsRes, txRes] = await Promise.all([
        api.get('/analytics/summary'),
        api.get('/analytics/spending'),
        api.get(`/analytics/charts?period=${chartPeriod}`),
        api.get(`/budgets?month=${selectedMonth}&year=${selectedYear}`),
        api.get('/transactions?limit=7&sort=newest'),
      ]);

      if (summaryRes.data.success) setSummary(summaryRes.data.summary);
      if (insightsRes.data.success) setInsights(insightsRes.data.insights);
      if (chartsRes.data.success) {
        setChartData(chartsRes.data.timeline || []);
        setCategoryBreakdown(chartsRes.data.categoryBreakdown || []);
        setTotalExpense(chartsRes.data.totalExpense || 0);
      }
      if (budgetsRes.data.success) setBudgets(budgetsRes.data.budgets || []);
      if (txRes.data.success) setRecentTransactions(txRes.data.transactions || []);
    } catch (err) {
      console.error('Error fetching dashboard telemetry:', err);
    } finally {
      setLoading(false);
    }
  }, [chartPeriod, selectedMonth, selectedYear]);

  useEffect(() => {
    fetchDashboardData();

    // Listen to global refresh event triggered by transactions or budgets
    const handleGlobalRefresh = () => {
      fetchDashboardData();
    };

    window.addEventListener('flowfinance:refresh', handleGlobalRefresh);
    return () => window.removeEventListener('flowfinance:refresh', handleGlobalRefresh);
  }, [fetchDashboardData]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 4 Top Summary Metric Cards */}
      <SummaryCards summary={summary} loading={loading} />

      {/* Main Charts Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <IncomeExpenseChart
            data={chartData}
            period={chartPeriod}
            onPeriodChange={setChartPeriod}
            loading={loading}
          />
        </div>
        <div className="lg:col-span-1">
          <ExpenseDonutChart
            data={categoryBreakdown}
            totalExpense={totalExpense}
            loading={loading}
          />
        </div>
      </div>

      {/* Second Row: Budget Progress & Smart Spending Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BudgetProgressWidget budgets={budgets} loading={loading} />
        <SpendingInsightsWidget insights={insights} loading={loading} />
      </div>

      {/* Third Row: Recent Transactions Table */}
      <RecentTransactionsWidget
        transactions={recentTransactions}
        onEdit={(tx) => openAddModal(tx)}
        onRefresh={fetchDashboardData}
        loading={loading}
      />
    </div>
  );
};

export default DashboardPage;
