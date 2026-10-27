import React, { useState, useEffect, useCallback } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { TrendingUp, TrendingDown, PiggyBank, Award, Calendar, DollarSign, Filter } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { useCurrency } from '../context/CurrencyContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

const AnalyticsPage = () => {
  const { currency } = useCurrency();
  const { showToast } = useToast();

  const [period, setPeriod] = useState('thisMonth');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [loading, setLoading] = useState(true);

  const [timeline, setTimeline] = useState([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [cashFlow, setCashFlow] = useState([]);
  const [summary, setSummary] = useState(null);
  const [totalExpense, setTotalExpense] = useState(0);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      let query = `period=${period}`;
      if (period === 'custom' && customStart && customEnd) {
        query += `&startDate=${customStart}&endDate=${customEnd}`;
      }

      const [chartsRes, summaryRes] = await Promise.all([
        api.get(`/analytics/charts?${query}`),
        api.get('/analytics/summary'),
      ]);

      if (chartsRes.data.success) {
        setTimeline(chartsRes.data.timeline || []);
        setCategoryBreakdown(chartsRes.data.categoryBreakdown || []);
        setCashFlow(chartsRes.data.cashFlow || []);
        setTotalExpense(chartsRes.data.totalExpense || 0);
      }

      if (summaryRes.data.success) {
        setSummary(summaryRes.data.summary);
      }
    } catch (err) {
      console.error('Failed to load analytics telemetry:', err);
      showToast('Error loading analytics', 'error');
    } finally {
      setLoading(false);
    }
  }, [period, customStart, customEnd, showToast]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const periods = [
    { label: 'This Week', value: '7d' },
    { label: 'This Month', value: 'thisMonth' },
    { label: 'Last Month', value: 'lastMonth' },
    { label: 'Last 3 Months', value: '3m' },
    { label: 'This Year', value: 'year' },
    { label: 'Custom Range', value: 'custom' },
  ];

  const highestCategory = categoryBreakdown.length > 0 ? categoryBreakdown[0] : null;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header & Period Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900">
            Financial Telemetry & Analytics
          </h2>
          <p className="text-xs text-[#9299B3]">
            Deep multi-period insights into cash flows, asset retention, and allocations
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#15192C] dark:bg-[#15192C] bg-gray-100 border border-[#262D4A]/60 dark:border-[#262D4A]/60 border-gray-200 text-xs">
            {periods.map((p) => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  period === p.value
                    ? 'bg-[#8B5CF6] text-white shadow-sm font-semibold'
                    : 'text-[#9299B3] hover:text-[#F5F6FF]'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {period === 'custom' && (
            <div className="flex items-center gap-2 p-1 rounded-xl bg-[#15192C] dark:bg-[#15192C] bg-gray-100 border border-[#262D4A] text-xs">
              <input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="bg-transparent text-[#F5F6FF] px-2 py-1 focus:outline-none"
              />
              <span className="text-[#9299B3]">-</span>
              <input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="bg-transparent text-[#F5F6FF] px-2 py-1 focus:outline-none"
              />
            </div>
          )}
        </div>
      </div>

      {/* 4 Metric Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="panel-card p-5 border border-[#262D4A] dark:border-[#262D4A] dark:bg-[#1B2035] bg-white rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#9299B3] uppercase">Period Net Flow</span>
            <div className="p-2 rounded-xl bg-[#8B5CF6]/15 text-[#8B5CF6]">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-bold mt-3 text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900">
            {formatCurrency(summary?.currentSavings || 0, currency)}
          </h3>
          <p className="text-[11px] text-[#42E8B4] mt-1 font-medium">
            Active period retained capital
          </p>
        </div>

        <div className="panel-card p-5 border border-[#262D4A] dark:border-[#262D4A] dark:bg-[#1B2035] bg-white rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#9299B3] uppercase">Top Expense Sector</span>
            <div className="p-2 rounded-xl bg-[#FF718B]/15 text-[#FF718B]">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-xl font-bold mt-3 text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900 truncate">
            {highestCategory ? highestCategory.name : 'None'}
          </h3>
          <p className="text-[11px] text-[#9299B3] mt-1">
            {highestCategory
              ? `${formatCurrency(highestCategory.value, currency)} (${highestCategory.percentage}% of total)`
              : 'No expenses'}
          </p>
        </div>

        <div className="panel-card p-5 border border-[#262D4A] dark:border-[#262D4A] dark:bg-[#1B2035] bg-white rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#9299B3] uppercase">Savings Rate</span>
            <div className="p-2 rounded-xl bg-[#38BDF8]/15 text-[#38BDF8]">
              <PiggyBank className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-bold mt-3 text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900">
            {summary?.savingsRate || 0}%
          </h3>
          <p className="text-[11px] text-[#9299B3] mt-1">
            Proportion of income saved this period
          </p>
        </div>

        <div className="panel-card p-5 border border-[#262D4A] dark:border-[#262D4A] dark:bg-[#1B2035] bg-white rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#9299B3] uppercase">Lifetime Inflow</span>
            <div className="p-2 rounded-xl bg-[#42E8B4]/15 text-[#42E8B4]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-bold mt-3 text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900">
            {formatCurrency(summary?.lifetimeIncome || 0, currency)}
          </h3>
          <p className="text-[11px] text-[#9299B3] mt-1">
            Total historical recorded earnings
          </p>
        </div>
      </div>

      {/* Main Comparative Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income vs Expenses Area Chart */}
        <div className="panel-card p-5 border border-[#262D4A] dark:border-[#262D4A] dark:bg-[#1B2035] bg-white rounded-2xl">
          <div className="pb-4 border-b border-[#262D4A]/50 dark:border-[#262D4A]/50 border-gray-100">
            <h3 className="text-base font-bold text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900">
              Inflow vs Outflow Velocity
            </h3>
            <p className="text-xs text-[#9299B3]">
              Daily / Monthly dynamic cash tracking
            </p>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#42E8B4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#42E8B4" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="areaExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF718B" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#FF718B" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#262D4A" opacity={0.5} vertical={false} />
                <XAxis dataKey="label" stroke="#9299B3" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#9299B3" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  formatter={(val) => formatCurrency(val, currency)}
                  contentStyle={{ backgroundColor: '#1B2035', borderColor: '#262D4A', borderRadius: '12px' }}
                />
                <Area type="monotone" dataKey="income" stroke="#42E8B4" strokeWidth={2.5} fill="url(#areaIncome)" />
                <Area type="monotone" dataKey="expense" stroke="#FF718B" strokeWidth={2.5} fill="url(#areaExpense)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cash Flow Net Retention Line Chart */}
        <div className="panel-card p-5 border border-[#262D4A] dark:border-[#262D4A] dark:bg-[#1B2035] bg-white rounded-2xl">
          <div className="pb-4 border-b border-[#262D4A]/50 dark:border-[#262D4A]/50 border-gray-100">
            <h3 className="text-base font-bold text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900">
              Cumulative Net Cash Flow
            </h3>
            <p className="text-xs text-[#9299B3]">
              Net savings accumulation trajectory over the selected period
            </p>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cashFlow} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262D4A" opacity={0.5} vertical={false} />
                <XAxis dataKey="label" stroke="#9299B3" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#9299B3" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  formatter={(val) => formatCurrency(val, currency)}
                  contentStyle={{ backgroundColor: '#1B2035', borderColor: '#262D4A', borderRadius: '12px' }}
                />
                <Line
                  type="monotone"
                  dataKey="cumulative"
                  stroke="#8B5CF6"
                  strokeWidth={3}
                  dot={{ fill: '#8B5CF6', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Category Allocation & Bar Distribution Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Donut Chart */}
        <div className="panel-card p-5 border border-[#262D4A] dark:border-[#262D4A] dark:bg-[#1B2035] bg-white rounded-2xl lg:col-span-1">
          <h3 className="text-base font-bold text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900 pb-3 border-b border-[#262D4A]/50">
            Category Share
          </h3>
          <div className="h-64 w-full flex items-center justify-center pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="#1B2035"
                  strokeWidth={2}
                >
                  {categoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val) => formatCurrency(val, currency)}
                  contentStyle={{ backgroundColor: '#1B2035', borderColor: '#262D4A', borderRadius: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Horizontal Bar Ranking */}
        <div className="panel-card p-5 border border-[#262D4A] dark:border-[#262D4A] dark:bg-[#1B2035] bg-white rounded-2xl lg:col-span-2">
          <h3 className="text-base font-bold text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900 pb-3 border-b border-[#262D4A]/50">
            Category Spending Distribution
          </h3>
          <div className="pt-4 space-y-3 max-h-72 overflow-y-auto pr-1">
            {categoryBreakdown.map((cat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900">
                    {cat.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#FF718B]">
                      {formatCurrency(cat.value, currency)}
                    </span>
                    <span className="text-[#9299B3] text-[11px] w-8 text-right">
                      {cat.percentage}%
                    </span>
                  </div>
                </div>

                <div className="w-full h-2 rounded-full bg-[#15192C] dark:bg-[#15192C] bg-gray-200 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${cat.percentage}%`,
                      backgroundColor: cat.color || '#8B5CF6',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
