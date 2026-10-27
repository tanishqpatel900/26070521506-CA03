import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Wallet, User, Mail, Lock, Eye, EyeOff, ArrowRight, DollarSign, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name too long'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  preferredCurrency: z.string().default('USD'),
});

const RegisterPage = () => {
  const { register: registerUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      preferredCurrency: 'USD',
    },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setAuthError(null);
      const res = await registerUser(data);
      if (res.success) {
        showToast('Account created successfully! Welcome to FlowFinance.', 'success');
        navigate('/');
      } else {
        setAuthError(res.message);
      }
    } catch (err) {
      setAuthError('Registration failed. Please check details.');
    } finally {
      setLoading(false);
    }
  };

  const currencies = [
    { code: 'USD', name: 'US Dollar ($)' },
    { code: 'EUR', name: 'Euro (€)' },
    { code: 'GBP', name: 'British Pound (£)' },
    { code: 'INR', name: 'Indian Rupee (₹)' },
    { code: 'CAD', name: 'Canadian Dollar (CA$)' },
    { code: 'AUD', name: 'Australian Dollar (AU$)' },
  ];

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
            Start tracking expenses and smart category budgets in minutes
          </p>
        </div>

        {/* Card */}
        <div className="panel-card p-6 sm:p-8 border border-[#262D4A] dark:border-[#262D4A] dark:bg-[#1B2035] bg-white rounded-2xl shadow-elevated">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900">
              Create your account
            </h2>
            <p className="text-xs text-[#9299B3]">
              Join the modern fintech platform designed for personal wealth management
            </p>
          </div>

          {authError && (
            <div className="mb-4 p-3 rounded-xl bg-[#FF718B]/15 border border-[#FF718B]/30 text-xs text-[#FF718B] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-[#9299B3] mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#9299B3]">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="Alexander Vance"
                  {...register('name')}
                  className={`w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#15192C] dark:bg-[#15192C] bg-gray-50 border ${
                    errors.name ? 'border-[#FF718B]' : 'border-[#262D4A] dark:border-[#262D4A] border-gray-200'
                  } text-sm text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900 focus:outline-none focus:border-[#8B5CF6]`}
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-xs text-[#FF718B] font-medium">{errors.name.message}</p>
              )}
            </div>

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
                  placeholder="At least 6 characters"
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

            {/* Preferred Currency */}
            <div>
              <label className="block text-xs font-semibold text-[#9299B3] mb-1.5">
                Preferred Currency
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#9299B3]">
                  <DollarSign className="w-4 h-4" />
                </span>
                <select
                  {...register('preferredCurrency')}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#15192C] dark:bg-[#15192C] bg-gray-50 border border-[#262D4A] dark:border-[#262D4A] border-gray-200 text-xs font-semibold text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900 focus:outline-none cursor-pointer"
                >
                  {currencies.map((c) => (
                    <option key={c.code} value={c.code} className="bg-[#1B2035] text-[#F5F6FF]">
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white bg-[#8B5CF6] hover:bg-[#7C3AED] shadow-md shadow-[#8B5CF6]/30 transition-all disabled:opacity-60"
            >
              {loading ? 'Creating Account...' : 'Get Started'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Footer Login Link */}
          <div className="mt-6 text-center text-xs text-[#9299B3]">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-[#8B5CF6] hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
