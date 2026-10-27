import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ReceiptText,
  PieChart,
  BarChart3,
  ArrowLeftRight,
  FileText,
  Settings,
  LogOut,
  Wallet,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { name: 'Overview', path: '/', icon: LayoutDashboard },
  { name: 'Transactions', path: '/transactions', icon: ReceiptText },
  { name: 'Budgets', path: '/budgets', icon: PieChart },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'Currency Converter', path: '/currency', icon: ArrowLeftRight },
  { name: 'Reports', path: '/reports', icon: FileText },
  { name: 'Settings', path: '/settings', icon: Settings },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden animate-in fade-in"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 flex flex-col border-r transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } bg-[#101323] border-[#262D4A] dark:bg-[#101323] dark:border-[#262D4A] bg-white border-gray-200`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-[#262D4A]/60 dark:border-[#262D4A]/60 border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-[#8B5CF6]">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900">
                Flow<span className="text-[#8B5CF6]">Finance</span>
              </span>
              <p className="text-[10px] tracking-wider uppercase font-semibold text-[#9299B3] dark:text-[#9299B3] text-gray-400">
                Wealth OS
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-[#9299B3] hover:text-[#F5F6FF] hover:bg-[#1B2035]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-[#8B5CF6] text-white shadow-md shadow-[#8B5CF6]/25 font-semibold'
                      : 'text-[#9299B3] hover:text-[#F5F6FF] hover:bg-[#1B2035] dark:text-[#9299B3] dark:hover:text-[#F5F6FF] dark:hover:bg-[#1B2035] text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-[#262D4A]/60 dark:border-[#262D4A]/60 border-gray-100">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#1B2035]/50 dark:bg-[#1B2035]/50 bg-gray-50 border border-[#262D4A]/40 dark:border-[#262D4A]/40 border-gray-200">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 text-[#8B5CF6] font-bold text-sm shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold truncate text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900">
                  {user?.name || 'User'}
                </p>
                <p className="text-[11px] truncate text-[#9299B3] dark:text-[#9299B3] text-gray-500">
                  {user?.email || 'user@flowfinance.com'}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="p-1.5 text-[#9299B3] hover:text-[#FF718B] hover:bg-[#FF718B]/10 rounded-lg transition-colors shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
