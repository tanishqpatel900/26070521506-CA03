import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Sun,
  Moon,
  Bell,
  Plus,
  Search,
  Calendar,
  ChevronDown,
  User as UserIcon,
  Settings as SettingsIcon,
  LogOut,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = ({
  title,
  subtitle,
  onOpenMobileMenu,
  onOpenAddModal,
  selectedMonth,
  selectedYear,
  onDateChange,
}) => {
  const { theme, toggleTheme, isDark } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Close popovers on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentYear = new Date().getFullYear();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-20 px-6 border-b border-[#262D4A]/60 dark:border-[#262D4A]/60 border-gray-200 bg-[#101323]/80 dark:bg-[#101323]/80 bg-white/80 backdrop-blur-md">
      {/* Title & Mobile Toggle */}
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-[#9299B3] hover:text-[#F5F6FF] hover:bg-[#1B2035] dark:text-[#9299B3] dark:hover:text-[#F5F6FF] dark:hover:bg-[#1B2035] text-gray-600 hover:bg-gray-100"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-[#9299B3] dark:text-[#9299B3] text-gray-500 font-medium hidden sm:block">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-3">
        {/* Date / Month Picker if date controls are enabled */}
        {onDateChange && selectedMonth !== undefined && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1B2035] dark:bg-[#1B2035] bg-gray-100 border border-[#262D4A] dark:border-[#262D4A] border-gray-200 text-xs">
            <Calendar className="w-3.5 h-3.5 text-[#8B5CF6]" />
            <select
              value={selectedMonth}
              onChange={(e) => onDateChange(parseInt(e.target.value, 10), selectedYear)}
              className="bg-transparent text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-800 font-medium cursor-pointer focus:outline-none"
            >
              {months.map((m, idx) => (
                <option key={m} value={idx + 1} className="bg-[#1B2035] text-[#F5F6FF]">
                  {m}
                </option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => onDateChange(selectedMonth, parseInt(e.target.value, 10))}
              className="bg-transparent text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-800 font-medium cursor-pointer focus:outline-none"
            >
              {[currentYear - 1, currentYear, currentYear + 1].map((y) => (
                <option key={y} value={y} className="bg-[#1B2035] text-[#F5F6FF]">
                  {y}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Prominent Quick + Add Transaction Button */}
        {onOpenAddModal && (
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#8B5CF6] hover:bg-[#7C3AED] shadow-md shadow-[#8B5CF6]/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Transaction</span>
            <span className="sm:hidden">Add</span>
          </button>
        )}

        {/* Dark / Light Mode Toggle */}
        <button
          onClick={toggleTheme}
          title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          className="p-2 rounded-xl border border-[#262D4A] dark:border-[#262D4A] border-gray-200 bg-[#1B2035] dark:bg-[#1B2035] bg-gray-100 text-[#9299B3] hover:text-[#F5F6FF] dark:hover:text-[#F5F6FF] text-gray-600 hover:text-gray-900 transition-colors"
        >
          {isDark ? <Sun className="w-4 h-4 text-[#FBBF24]" /> : <Moon className="w-4 h-4 text-[#8B5CF6]" />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            title="Notifications"
            className="relative p-2 rounded-xl border border-[#262D4A] dark:border-[#262D4A] border-gray-200 bg-[#1B2035] dark:bg-[#1B2035] bg-gray-100 text-[#9299B3] hover:text-[#F5F6FF] dark:hover:text-[#F5F6FF] text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#8B5CF6] ring-2 ring-[#101323]" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 panel-card p-4 rounded-2xl shadow-elevated border border-[#262D4A] dark:border-[#262D4A] dark:bg-[#1B2035] bg-white border-gray-200 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-3 border-b border-[#262D4A]/50 dark:border-[#262D4A]/50 border-gray-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#9299B3]">
                  Notifications & Alerts
                </h4>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded-md bg-[#8B5CF6]/20 text-[#8B5CF6]">
                  Live
                </span>
              </div>
              <div className="py-2 space-y-3">
                <div className="flex gap-3 text-xs p-2 rounded-xl bg-[#262D4A]/20 dark:bg-[#262D4A]/20 bg-gray-50">
                  <AlertCircle className="w-4 h-4 text-[#FF718B] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900">
                      Budget Tracking Active
                    </p>
                    <p className="text-[#9299B3] dark:text-[#9299B3] text-gray-500 text-[11px] mt-0.5">
                      Your category budget limits are monitoring real spending. Alerts trigger at 80% and 100%.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 text-xs p-2 rounded-xl bg-[#262D4A]/20 dark:bg-[#262D4A]/20 bg-gray-50">
                  <CheckCircle2 className="w-4 h-4 text-[#42E8B4] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900">
                      Live Rates Synchronized
                    </p>
                    <p className="text-[#9299B3] dark:text-[#9299B3] text-gray-500 text-[11px] mt-0.5">
                      Exchange rate service connected with 160+ currency feeds.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar & Menu */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1.5 rounded-xl border border-[#262D4A] dark:border-[#262D4A] border-gray-200 bg-[#1B2035] dark:bg-[#1B2035] bg-gray-100 hover:border-[#8B5CF6]/50 transition-colors"
          >
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#8B5CF6] text-white font-bold text-xs">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#9299B3]" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 panel-card p-2 rounded-2xl shadow-elevated border border-[#262D4A] dark:border-[#262D4A] dark:bg-[#1B2035] bg-white border-gray-200 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-3 py-2 border-b border-[#262D4A]/50 dark:border-[#262D4A]/50 border-gray-100">
                <p className="text-xs font-semibold text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900 truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-[11px] text-[#9299B3] dark:text-[#9299B3] text-gray-500 truncate">
                  {user?.email}
                </p>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate('/settings');
                  }}
                  className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-medium text-[#9299B3] hover:text-[#F5F6FF] hover:bg-[#262D4A]/40 dark:text-[#9299B3] dark:hover:text-[#F5F6FF] dark:hover:bg-[#262D4A]/40 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-xl transition-colors"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  Account Settings
                </button>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate('/reports');
                  }}
                  className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-medium text-[#9299B3] hover:text-[#F5F6FF] hover:bg-[#262D4A]/40 dark:text-[#9299B3] dark:hover:text-[#F5F6FF] dark:hover:bg-[#262D4A]/40 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-xl transition-colors"
                >
                  <SettingsIcon className="w-3.5 h-3.5" />
                  Financial Reports
                </button>
              </div>

              <div className="pt-1 border-t border-[#262D4A]/50 dark:border-[#262D4A]/50 border-gray-100">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                  }}
                  className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-medium text-[#FF718B] hover:bg-[#FF718B]/10 rounded-xl transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
