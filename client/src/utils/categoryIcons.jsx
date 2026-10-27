import React from 'react';
import {
  Utensils,
  ShoppingBag,
  Car,
  Receipt,
  GraduationCap,
  Film,
  HeartPulse,
  Briefcase,
  Laptop,
  TrendingUp,
  Tag,
  PieChart,
  PiggyBank,
  Wallet,
  Coins,
  ShieldAlert,
} from 'lucide-react';

export const CATEGORIES = [
  { name: 'Food', icon: Utensils, color: '#38BDF8', bg: 'rgba(56, 189, 248, 0.15)' },
  { name: 'Shopping', icon: ShoppingBag, color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.15)' },
  { name: 'Transport', icon: Car, color: '#FBBF24', bg: 'rgba(251, 191, 36, 0.15)' },
  { name: 'Bills', icon: Receipt, color: '#FF718B', bg: 'rgba(255, 113, 139, 0.15)' },
  { name: 'Education', icon: GraduationCap, color: '#A78BFA', bg: 'rgba(167, 139, 250, 0.15)' },
  { name: 'Entertainment', icon: Film, color: '#F472B6', bg: 'rgba(244, 114, 182, 0.15)' },
  { name: 'Healthcare', icon: HeartPulse, color: '#FB923C', bg: 'rgba(251, 146, 60, 0.15)' },
  { name: 'Salary', icon: Briefcase, color: '#42E8B4', bg: 'rgba(66, 232, 180, 0.15)' },
  { name: 'Freelance', icon: Laptop, color: '#34D399', bg: 'rgba(52, 211, 153, 0.15)' },
  { name: 'Investments', icon: TrendingUp, color: '#60A5FA', bg: 'rgba(96, 165, 250, 0.15)' },
  { name: 'Other', icon: Tag, color: '#94A3B8', bg: 'rgba(148, 163, 184, 0.15)' },
];

export const PAYMENT_METHODS = [
  'Debit Card',
  'Credit Card',
  'Bank Transfer',
  'UPI',
  'Cash',
  'Crypto',
  'Other',
];

export const getCategoryMeta = (categoryName) => {
  if (!categoryName) return { icon: Tag, color: '#94A3B8', bg: 'rgba(148, 163, 184, 0.15)' };
  
  if (categoryName.toLowerCase() === 'overall') {
    return { icon: PieChart, color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.15)' };
  }
  if (categoryName.toLowerCase() === 'savings') {
    return { icon: PiggyBank, color: '#42E8B4', bg: 'rgba(66, 232, 180, 0.15)' };
  }
  if (categoryName.toLowerCase() === 'budget') {
    return { icon: Wallet, color: '#FBBF24', bg: 'rgba(251, 191, 36, 0.15)' };
  }

  const found = CATEGORIES.find(
    (c) => c.name.toLowerCase() === categoryName.toLowerCase()
  );

  return (
    found || {
      name: categoryName,
      icon: Tag,
      color: '#94A3B8',
      bg: 'rgba(148, 163, 184, 0.15)',
    }
  );
};
