import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import TransactionModal from '../transactions/TransactionModal';

const PAGE_TITLES = {
  '/': { title: 'Financial Overview', subtitle: 'Real-time performance, spending trends & balance metrics' },
  '/transactions': { title: 'Transactions Ledger', subtitle: 'Search, filter, and inspect detailed income & expense records' },
  '/budgets': { title: 'Budget Management', subtitle: 'Target spending limits with proactive 80% and 100% threshold alerts' },
  '/analytics': { title: 'Interactive Analytics', subtitle: 'Comprehensive cash-flow distributions and category breakdowns' },
  '/currency': { title: 'Live Currency Converter', subtitle: 'Real-time multi-currency exchange calculations with cached rates' },
  '/reports': { title: 'Financial Reports & Exports', subtitle: 'Download filtered audit-ready CSVs and executive monthly summaries' },
  '/settings': { title: 'Account Settings', subtitle: 'Manage profile preferences, display currency, and appearance' },
};

const DashboardLayout = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState(null);

  // Month and Year state for global dashboard date filtering
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const pageInfo = PAGE_TITLES[location.pathname] || {
    title: 'FlowFinance',
    subtitle: 'Intelligent Wealth OS',
  };

  const handleOpenAddModal = (transaction = null) => {
    setTransactionToEdit(transaction);
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setTransactionToEdit(null);
  };

  const handleDateChange = (month, year) => {
    setSelectedMonth(month);
    setSelectedYear(year);
  };

  return (
    <div className="min-h-screen flex bg-[#101323] text-[#F5F6FF] dark:bg-[#101323] dark:text-[#F5F6FF] bg-gray-50 text-gray-900 transition-colors duration-200">
      {/* Sidebar */}
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Header
          title={pageInfo.title}
          subtitle={pageInfo.subtitle}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenAddModal={() => handleOpenAddModal(null)}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onDateChange={handleDateChange}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          <Outlet
            context={{
              selectedMonth,
              selectedYear,
              openAddModal: handleOpenAddModal,
            }}
          />
        </main>
      </div>

      {/* Global Quick Add Transaction Modal */}
      <TransactionModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        transactionToEdit={transactionToEdit}
        onSave={() => {
          // Trigger custom event so active pages refresh their data instantly
          window.dispatchEvent(new Event('flowfinance:refresh'));
        }}
      />
    </div>
  );
};

export default DashboardLayout;
