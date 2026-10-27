import React, { useState } from 'react';
import { User, DollarSign, Palette, ShieldCheck, Database, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useCurrency } from '../context/CurrencyContext';
import { useToast } from '../context/ToastContext';

const SettingsPage = () => {
  const { user, updateProfile } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const { currency, setCurrency } = useCurrency();
  const { showToast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [preferredCurrency, setPreferredCurrency] = useState(user?.preferredCurrency || currency || 'USD');
  const [saving, setSaving] = useState(false);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await updateProfile({
        name,
        preferredCurrency,
        themePreference: theme,
      });

      if (res.success) {
        setCurrency(preferredCurrency);
        showToast('Settings saved successfully', 'success');
      } else {
        showToast(res.message || 'Failed to update profile', 'error');
      }
    } catch (err) {
      showToast('Error saving profile changes', 'error');
    } finally {
      setSaving(false);
    }
  };

  const currencies = [
    { code: 'USD', name: 'US Dollar ($)' },
    { code: 'EUR', name: 'Euro (€)' },
    { code: 'GBP', name: 'British Pound (£)' },
    { code: 'INR', name: 'Indian Rupee (₹)' },
    { code: 'CAD', name: 'Canadian Dollar (CA$)' },
    { code: 'AUD', name: 'Australian Dollar (AU$)' },
    { code: 'JPY', name: 'Japanese Yen (¥)' },
    { code: 'SGD', name: 'Singapore Dollar (SG$)' },
    { code: 'AED', name: 'UAE Dirham (AED)' },
    { code: 'CHF', name: 'Swiss Franc (CHF)' },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      <div>
        <h2 className="text-xl font-bold text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900">
          Account & Workspace Settings
        </h2>
        <p className="text-xs text-[#9299B3]">
          Manage profile details, default currency, and dashboard appearance
        </p>
      </div>

      <div className="panel-card p-6 sm:p-8 border border-[#262D4A] dark:border-[#262D4A] dark:bg-[#1B2035] bg-white rounded-2xl space-y-6 shadow-elevated">
        <form onSubmit={handleSaveProfile} className="space-y-6">
          {/* Profile Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#8B5CF6] flex items-center gap-2">
              <User className="w-4 h-4" /> Personal Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#9299B3] mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#15192C] dark:bg-[#15192C] bg-gray-50 border border-[#262D4A] dark:border-[#262D4A] border-gray-200 text-sm font-medium text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900 focus:outline-none focus:border-[#8B5CF6]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#9299B3] mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-4 py-2.5 rounded-xl bg-[#15192C]/50 dark:bg-[#15192C]/50 bg-gray-100 border border-[#262D4A]/50 dark:border-[#262D4A]/50 border-gray-200 text-sm font-medium text-[#9299B3] cursor-not-allowed"
                />
                <span className="text-[10px] text-[#9299B3] mt-1 block">
                  Email is locked to your authenticated security identity.
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-[#262D4A]/50 dark:border-[#262D4A]/50 border-gray-100 pt-6 space-y-4">
            {/* Preferred Currency Section */}
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#8B5CF6] flex items-center gap-2">
              <DollarSign className="w-4 h-4" /> Financial Preferences
            </h3>

            <div>
              <label className="block text-xs font-semibold text-[#9299B3] mb-1.5">
                Default Display Currency
              </label>
              <select
                value={preferredCurrency}
                onChange={(e) => setPreferredCurrency(e.target.value)}
                className="w-full sm:w-80 px-4 py-2.5 rounded-xl bg-[#15192C] dark:bg-[#15192C] bg-gray-50 border border-[#262D4A] dark:border-[#262D4A] border-gray-200 text-xs font-semibold text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900 focus:outline-none cursor-pointer"
              >
                {currencies.map((c) => (
                  <option key={c.code} value={c.code} className="bg-[#1B2035] text-[#F5F6FF]">
                    {c.code} — {c.name}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-[#9299B3] mt-1.5">
                Sets your primary monetary symbol across overview cards, transaction records, and budgets.
              </p>
            </div>
          </div>

          <div className="border-t border-[#262D4A]/50 dark:border-[#262D4A]/50 border-gray-100 pt-6 space-y-4">
            {/* Theme & Visual Preferences */}
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#8B5CF6] flex items-center gap-2">
              <Palette className="w-4 h-4" /> Appearance & Theme
            </h3>

            <div className="flex items-center justify-between p-4 rounded-xl bg-[#15192C]/50 dark:bg-[#15192C]/50 bg-gray-50 border border-[#262D4A]/50 dark:border-[#262D4A]/50 border-gray-200 max-w-md">
              <div>
                <p className="text-xs font-semibold text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900">
                  {isDark ? 'Dark Mode (Fintech Purple & Navy)' : 'Light Mode (Clean Slate & Purple)'}
                </p>
                <p className="text-[11px] text-[#9299B3] mt-0.5">
                  Theme is persisted without visual flicker.
                </p>
              </div>

              <button
                type="button"
                onClick={toggleTheme}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isDark ? 'bg-[#8B5CF6]' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isDark ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-[#262D4A]/50 dark:border-[#262D4A]/50 border-gray-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#8B5CF6] hover:bg-[#7C3AED] shadow-md shadow-[#8B5CF6]/30 transition-all disabled:opacity-60"
            >
              <Check className="w-4 h-4" />
              {saving ? 'Saving Preferences...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>

      {/* System Diagnostic Information */}
      <div className="panel-card p-5 border border-[#262D4A] dark:border-[#262D4A] dark:bg-[#1B2035] bg-white rounded-2xl text-xs space-y-2">
        <h4 className="font-bold text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900 flex items-center gap-2">
          <Database className="w-4 h-4 text-[#42E8B4]" /> FlowFinance Architecture Status
        </h4>
        <p className="text-[#9299B3]">
          • MongoDB Service: Connected with native indexing on <code className="text-[#8B5CF6]">[user, date, category]</code>.
        </p>
        <p className="text-[#9299B3]">
          • Currency Feed: Live exchange rate proxy with 60-minute in-memory caching and automatic fallback.
        </p>
        <p className="text-[#9299B3]">
          • Security: Encrypted password hashing with bcrypt, JWT authorization tokens, and strict user-ownership middleware.
        </p>
      </div>
    </div>
  );
};

export default SettingsPage;
