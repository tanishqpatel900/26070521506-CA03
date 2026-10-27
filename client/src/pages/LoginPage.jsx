import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Wallet, Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const LoginPage = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setAuthError(null);
      const res = await login(data.email, data.password);
      if (res.success) {
        showToast(`Welcome back, ${res.user.name}!`, 'success');
        navigate('/');
      } else {
        setAuthError(res.message);
      }
    } catch (err) {
      setAuthError('Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setValue('email', 'demo@flowfinance.com');
    setValue('password', 'password123');
    try {
      setLoading(true);
      setAuthError(null);
      const res = await login('demo@flowfinance.com', 'password123');
      if (res.success) {
        showToast('Logged in as Demo User with full sample telemetry!', 'success');
        navigate('/');
      } else {
        setAuthError(res.message);
      }
    } catch (err) {
      setAuthError('Failed to sign in demo account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#101323] dark:bg-[#101323] bg-gray-50 text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900 transition-colors">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-[#8B5CF6] shadow-glow-purple mb-2">
            <Wallet className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Flow<span className="text-[#8B5CF6]">Finance</span>
          </h1>
          <p className="text-xs text-[#9299B3]">
            Premium Expense Tracker & Predictive Budget Management
          </p>
        </div>

        {/* Login Card */}
        <div className="panel-card p-6 sm:p-8 border border-[#262D4A] dark:border-[#262D4A] dark:bg-[#1B2035] bg-white rounded-2xl shadow-elevated">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900">
              Welcome back
            </h2>
            <p className="text-xs text-[#9299B3]">
              Enter your credentials to access your financial dashboard
            </p>
          </div>

          {authError && (
            <div className="mb-4 p-3 rounded-xl bg-[#FF718B]/15 border border-[#FF718B]/30 text-xs text-[#FF718B] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-[#9299B3] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#9299B3]">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  placeholder="alexander@flowfinance.com"
                  {...register('email')}
                  className={`w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#15192C] dark:bg-[#15192C] bg-gray-50 border ${
                    errors.email ? 'border-[#FF718B]' : 'border-[#262D4A] dark:border-[#262D4A] border-gray-200'
                  } text-sm text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900 focus:outline-none focus:border-[#8B5CF6]`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-[#FF718B] font-medium">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-[#9299B3] mb-1.5">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#9299B3]">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password')}
                  className={`w-full pl-9 pr-10 py-2.5 rounded-xl bg-[#15192C] dark:bg-[#15192C] bg-gray-50 border ${
                    errors.password ? 'border-[#FF718B]' : 'border-[#262D4A] dark:border-[#262D4A] border-gray-200'
                  } text-sm text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900 focus:outline-none focus:border-[#8B5CF6]`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#9299B3] hover:text-[#F5F6FF]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-[#FF718B] font-medium">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white bg-[#8B5CF6] hover:bg-[#7C3AED] shadow-md shadow-[#8B5CF6]/30 transition-all disabled:opacity-60"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* One Click Demo Login Button */}
          <div className="mt-4 pt-4 border-t border-[#262D4A]/50 dark:border-[#262D4A]/50 border-gray-100">
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-[#42E8B4] border border-[#42E8B4]/40 bg-[#42E8B4]/10 hover:bg-[#42E8B4]/20 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              One-Click Demo Account Login
            </button>
            <p className="text-[10px] text-center text-[#9299B3] mt-1.5">
              Instant login with sample transactions, charts & realistic budgets
            </p>
          </div>

          {/* Footer Signup Link */}
          <div className="mt-6 text-center text-xs text-[#9299B3]">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-semibold text-[#8B5CF6] hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
