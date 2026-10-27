import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Plus, Download, FileSpreadsheet } from 'lucide-react';
import TransactionFilters from '../components/transactions/TransactionFilters';
import TransactionTable from '../components/transactions/TransactionTable';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

const TransactionsPage = () => {
  const { openAddModal } = useOutletContext();
  const { showToast } = useToast();

  const [transactions, setTransactions] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [category, setCategory] = useState('All');
  const [paymentMethod, setPaymentMethod] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sort, setSort] = useState('newest');

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search.trim()) params.append('search', search.trim());
      if (type) params.append('type', type);
      if (category && category !== 'All') params.append('category', category);
      if (paymentMethod && paymentMethod !== 'All') params.append('paymentMethod', paymentMethod);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (sort) params.append('sort', sort);
      params.append('page', currentPage);
      params.append('limit', 12);

      const res = await api.get(`/transactions?${params.toString()}`);
      if (res.data.success) {
        setTransactions(res.data.transactions || []);
        setTotalCount(res.data.total || 0);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (err) {
      console.error('Failed to load transactions:', err);
      showToast('Error loading transactions', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, type, category, paymentMethod, startDate, endDate, sort, currentPage, showToast]);

  useEffect(() => {
    fetchTransactions();

    const handleRefresh = () => fetchTransactions();
    window.addEventListener('flowfinance:refresh', handleRefresh);
    return () => window.removeEventListener('flowfinance:refresh', handleRefresh);
  }, [fetchTransactions]);

  const handleResetFilters = () => {
    setSearch('');
    setType('');
    setCategory('All');
    setPaymentMethod('All');
    setStartDate('');
    setEndDate('');
    setSort('newest');
    setCurrentPage(1);
  };

  const handleExportCSV = async () => {
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.append('search', search.trim());
      if (type) params.append('type', type);
      if (category && category !== 'All') params.append('category', category);
      if (paymentMethod && paymentMethod !== 'All') params.append('paymentMethod', paymentMethod);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const res = await api.get(`/reports/export-csv?${params.toString()}`, {
        responseType: 'blob',
      });

      const blob = new Blob([res.data], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `flowfinance-transactions-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      showToast('CSV report exported successfully', 'success');
    } catch (err) {
      showToast('Failed to export CSV report', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900">
            Transaction Ledger
          </h2>
          <p className="text-xs text-[#9299B3]">
            Audit, filter, and inspect your full transaction history
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-[#9299B3] hover:text-[#F5F6FF] border border-[#262D4A] dark:border-[#262D4A] border-gray-200 bg-[#1B2035] dark:bg-[#1B2035] bg-white hover:bg-[#262D4A]/30 transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>

          <button
            onClick={() => openAddModal(null)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#8B5CF6] hover:bg-[#7C3AED] shadow-md shadow-[#8B5CF6]/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Transaction
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <TransactionFilters
        search={search}
        onSearchChange={(v) => { setSearch(v); setCurrentPage(1); }}
        type={type}
        onTypeChange={(v) => { setType(v); setCurrentPage(1); }}
        category={category}
        onCategoryChange={(v) => { setCategory(v); setCurrentPage(1); }}
        paymentMethod={paymentMethod}
        onPaymentMethodChange={(v) => { setPaymentMethod(v); setCurrentPage(1); }}
        startDate={startDate}
        onStartDateChange={(v) => { setStartDate(v); setCurrentPage(1); }}
        endDate={endDate}
        onEndDateChange={(v) => { setEndDate(v); setCurrentPage(1); }}
        sort={sort}
        onSortChange={(v) => { setSort(v); setCurrentPage(1); }}
        onResetFilters={handleResetFilters}
        totalCount={totalCount}
      />

      {/* Transactions Data Table */}
      <TransactionTable
        transactions={transactions}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={totalCount}
        onPageChange={setCurrentPage}
        onEdit={(tx) => openAddModal(tx)}
        onRefresh={fetchTransactions}
      />
    </div>
  );
};

export default TransactionsPage;
