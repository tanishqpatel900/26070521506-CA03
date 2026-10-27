import React from 'react';
import { X, Printer, Download, FileSpreadsheet, ShieldCheck } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useCurrency } from '../../context/CurrencyContext';

const ReportSummaryModal = ({ isOpen, onClose, reportData, onDownloadCSV }) => {
  const { currency } = useCurrency();

  if (!isOpen || !reportData) return null;

  const handlePrint = () => {
    window.print();
  };

  const { user, period, generatedAt, totals, categoryBreakdown, paymentMethodBreakdown } = reportData;

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="panel-card w-full max-w-3xl p-6 sm:p-8 my-8 border border-[#262D4A] dark:border-[#262D4A] dark:bg-[#1B2035] bg-white rounded-2xl shadow-elevated max-h-[90vh] flex flex-col print:m-0 print:p-0 print:shadow-none print:border-none">
        {/* Modal Top Bar (hidden during print) */}
        <div className="flex items-center justify-between pb-4 border-b border-[#262D4A]/50 dark:border-[#262D4A]/50 border-gray-100 shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900">
              Monthly Financial Statement
            </h3>
            <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-[#42E8B4]/15 text-[#42E8B4]">
              Generated
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#262D4A] dark:border-[#262D4A] border-gray-200 text-xs font-semibold text-[#9299B3] hover:text-[#F5F6FF] hover:bg-[#262D4A]/30 transition-all"
            >
              <Printer className="w-3.5 h-3.5" /> Print / PDF
            </button>
            <button
              onClick={onDownloadCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Download className="w-3.5 h-3.5" /> CSV
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#9299B3] hover:text-[#F5F6FF] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Statement Document */}
        <div className="overflow-y-auto pt-6 space-y-6 print:overflow-visible">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#262D4A]/60 dark:border-[#262D4A]/60 border-gray-200">
            <div>
              <span className="text-xl font-bold tracking-tight text-[#8B5CF6]">
                Flow<span className="text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900">Finance</span>
              </span>
              <p className="text-xs text-[#9299B3] mt-0.5">
                Executive Financial Ledger & Audit Statement
              </p>
            </div>

            <div className="text-left sm:text-right text-xs text-[#9299B3]">
              <p>
                <strong className="text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900">Account:</strong>{' '}
                {user?.name} ({user?.email})
              </p>
              <p>
                <strong className="text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900">Statement Period:</strong>{' '}
                {months[period?.month - 1]} {period?.year}
              </p>
              <p className="text-[11px] text-[#9299B3] mt-0.5">
                Generated: {new Date(generatedAt).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Totals Summary Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-[#15192C] dark:bg-[#15192C] bg-gray-50 border border-[#262D4A]/50 dark:border-[#262D4A]/50 border-gray-200">
              <span className="text-[10px] uppercase font-semibold text-[#9299B3]">
                Total Income
              </span>
              <p className="text-base font-bold text-[#42E8B4] mt-1">
                +{formatCurrency(totals?.income, currency)}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#15192C] dark:bg-[#15192C] bg-gray-50 border border-[#262D4A]/50 dark:border-[#262D4A]/50 border-gray-200">
              <span className="text-[10px] uppercase font-semibold text-[#9299B3]">
                Total Expenses
              </span>
              <p className="text-base font-bold text-[#FF718B] mt-1">
                -{formatCurrency(totals?.expense, currency)}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#15192C] dark:bg-[#15192C] bg-gray-50 border border-[#262D4A]/50 dark:border-[#262D4A]/50 border-gray-200">
              <span className="text-[10px] uppercase font-semibold text-[#9299B3]">
                Net Savings
              </span>
              <p className={`text-base font-bold mt-1 ${totals?.netSavings >= 0 ? 'text-[#42E8B4]' : 'text-[#FF718B]'}`}>
                {formatCurrency(totals?.netSavings, currency)}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#15192C] dark:bg-[#15192C] bg-gray-50 border border-[#262D4A]/50 dark:border-[#262D4A]/50 border-gray-200">
              <span className="text-[10px] uppercase font-semibold text-[#9299B3]">
                Savings Rate
              </span>
              <p className="text-base font-bold text-[#8B5CF6] mt-1">
                {totals?.savingsRate}%
              </p>
            </div>
          </div>

          {/* Category Breakdown Table */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#9299B3] mb-2.5">
              Expense Allocation By Category
            </h4>
            <div className="overflow-x-auto rounded-xl border border-[#262D4A]/60 dark:border-[#262D4A]/60 border-gray-200">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#15192C] dark:bg-[#15192C] bg-gray-100 text-[#9299B3] font-semibold border-b border-[#262D4A]/60 dark:border-[#262D4A]/60 border-gray-200">
                  <tr>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3 text-right">Amount Spent</th>
                    <th className="py-2.5 px-3 text-right">% of Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#262D4A]/30 dark:divide-[#262D4A]/30 divide-gray-100">
                  {categoryBreakdown?.map((item, idx) => (
                    <tr key={idx} className="hover:bg-[#15192C]/20">
                      <td className="py-2 px-3 font-semibold text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900">
                        {item.category}
                      </td>
                      <td className="py-2 px-3 text-right font-medium text-[#FF718B]">
                        {formatCurrency(item.amount, currency)}
                      </td>
                      <td className="py-2 px-3 text-right text-[#9299B3]">
                        {item.percentage}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Disclaimer & Footer */}
          <div className="pt-4 border-t border-[#262D4A]/40 dark:border-[#262D4A]/40 border-gray-200 flex items-center justify-between text-[10px] text-[#9299B3]">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#42E8B4]" /> Verified Personal Financial Record
            </span>
            <span>FlowFinance v1.0 • Confidential</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportSummaryModal;
