import React, { useState } from 'react';
import { Download, FileText, Calendar, Filter, FileSpreadsheet, CheckCircle2 } from 'lucide-react';
import ReportSummaryModal from '../components/reports/ReportSummaryModal';
import { useToast } from '../context/ToastContext';
import { CATEGORIES } from '../utils/categoryIcons';
import api from '../services/api';

const ReportsPage = () => {
  const { showToast } = useToast();

  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [category, setCategory] = useState('All');
  const [type, setType] = useState('');

  const [reportData, setReportData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [downloadingCSV, setDownloadingCSV] = useState(false);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleGenerateSummary = async () => {
    try {
      setGenerating(true);
      const res = await api.get(`/reports/summary?month=${selectedMonth}&year=${selectedYear}`);
      if (res.data.success) {
        setReportData(res.data.report);
        setIsModalOpen(true);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to generate financial report', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadCSV = async () => {
    try {
      setDownloadingCSV(true);
      const params = new URLSearchParams();
      if (type) params.append('type', type);
      if (category && category !== 'All') params.append('category', category);

      const start = new Date(selectedYear, selectedMonth - 1, 1).toISOString();
      const end = new Date(selectedYear, selectedMonth, 0, 23, 59, 59).toISOString();
      params.append('startDate', start);
      params.append('endDate', end);

      const res = await api.get(`/reports/export-csv?${params.toString()}`, {
        responseType: 'blob',
      });

      const blob = new Blob([res.data], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `flowfinance-statement-${selectedYear}-${selectedMonth}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      showToast('CSV export downloaded successfully', 'success');
    } catch (err) {
      showToast('Failed to export CSV report', 'error');
    } finally {
      setDownloadingCSV(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900">
          Financial Reports & Export Center
        </h2>
        <p className="text-xs text-[#9299B3]">
          Generate authenticated audit reports, monthly summary statements, and CSV exports
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Configuration Panel */}
        <div className="panel-card p-6 border border-[#262D4A] dark:border-[#262D4A] dark:bg-[#1B2035] bg-white rounded-2xl lg:col-span-2 space-y-5">
          <h3 className="text-base font-bold text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900 pb-3 border-b border-[#262D4A]/50">
            Statement Parameters
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#9299B3] mb-1.5">
                Statement Month
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2.5 rounded-xl bg-[#15192C] dark:bg-[#15192C] bg-gray-50 border border-[#262D4A] dark:border-[#262D4A] border-gray-200 text-xs font-semibold text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900 focus:outline-none cursor-pointer"
              >
                {months.map((m, idx) => (
                  <option key={m} value={idx + 1} className="bg-[#1B2035] text-[#F5F6FF]">
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#9299B3] mb-1.5">
                Statement Year
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2.5 rounded-xl bg-[#15192C] dark:bg-[#15192C] bg-gray-50 border border-[#262D4A] dark:border-[#262D4A] border-gray-200 text-xs font-semibold text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900 focus:outline-none cursor-pointer"
              >
                {[now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1].map((y) => (
                  <option key={y} value={y} className="bg-[#1B2035] text-[#F5F6FF]">
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#9299B3] mb-1.5">
                Category Scope
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#15192C] dark:bg-[#15192C] bg-gray-50 border border-[#262D4A] dark:border-[#262D4A] border-gray-200 text-xs font-semibold text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900 focus:outline-none cursor-pointer"
              >
                <option value="All" className="bg-[#1B2035] text-[#F5F6FF]">All Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c.name} value={c.name} className="bg-[#1B2035] text-[#F5F6FF]">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#9299B3] mb-1.5">
                Transaction Type Filter
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#15192C] dark:bg-[#15192C] bg-gray-50 border border-[#262D4A] dark:border-[#262D4A] border-gray-200 text-xs font-semibold text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900 focus:outline-none cursor-pointer"
              >
                <option value="" className="bg-[#1B2035] text-[#F5F6FF]">All (Income & Expenses)</option>
                <option value="income" className="bg-[#1B2035] text-[#F5F6FF]">Income Only</option>
                <option value="expense" className="bg-[#1B2035] text-[#F5F6FF]">Expenses Only</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap gap-3">
            <button
              onClick={handleGenerateSummary}
              disabled={generating}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#8B5CF6] hover:bg-[#7C3AED] shadow-md shadow-[#8B5CF6]/30 transition-all disabled:opacity-60"
            >
              <FileText className="w-4 h-4" />
              {generating ? 'Generating Statement...' : 'Generate Monthly Summary Statement'}
            </button>

            <button
              onClick={handleDownloadCSV}
              disabled={downloadingCSV}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-[#9299B3] hover:text-[#F5F6FF] border border-[#262D4A] dark:border-[#262D4A] bg-[#1B2035] dark:bg-[#1B2035] hover:bg-[#262D4A]/40 transition-all disabled:opacity-60"
            >
              <Download className="w-4 h-4" />
              {downloadingCSV ? 'Preparing CSV...' : 'Download Filtered CSV'}
            </button>
          </div>
        </div>

        {/* Feature Highlights Card */}
        <div className="panel-card p-6 border border-[#262D4A] dark:border-[#262D4A] dark:bg-[#1B2035] bg-white rounded-2xl lg:col-span-1 space-y-4">
          <h3 className="text-base font-bold text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900 pb-3 border-b border-[#262D4A]/50">
            Export Standards
          </h3>

          <div className="space-y-3 text-xs text-[#9299B3]">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#42E8B4] shrink-0 mt-0.5" />
              <p>RFC 4180 standard CSV formatting with automatic field quoting and special character handling.</p>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#42E8B4] shrink-0 mt-0.5" />
              <p>Authenticated backend authorization ensures you can only view and export your own financial ledger.</p>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#42E8B4] shrink-0 mt-0.5" />
              <p>Clean browser-native print styles designed for high-resolution PDF generation and archiving.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Report View Modal */}
      <ReportSummaryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        reportData={reportData}
        onDownloadCSV={handleDownloadCSV}
      />
    </div>
  );
};

export default ReportsPage;
