export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  type: 'expense' | 'income';
}

export interface CreateExpenseData {
  amount: number;
  category: string;
  description: string;
  date: string;
  type: 'expense' | 'income';
}

export interface ExpenseSummary {
  category: string;
  total: number;
  count: number;
  color?: string;
}

export interface BudgetSummary {
  totalIncome: number;
  totalExpenses: number;
  available: number;
  savings: number;
  dailyBudget: number;
  daysRemaining: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSavingsData {
  name: string;
  targetAmount: number;
  currentAmount?: number;
  deadline: string;
}

export interface DashboardOverview {
  totalExpenses: number;
  totalIncome: number;
  savingsProgress: number;
  recentExpenses: Expense[];
  topCategories: ExpenseSummary[];
}

export interface MonthlyComparison {
  currentMonth: number;
  previousMonth: number;
  difference: number;
  percentageChange: number;
}

export interface FinanceProfile {
  salary: number;
  savingsGoal: number;
  availableThisMonth: number;
}

export interface FinanceSummary {
  salary: number;
  savings: number;
  available: number;
}

export interface BudgetAlert {
  type: 'warning' | 'danger' | 'info';
  message: string;
  category?: string;
}

export type { User, LoginCredentials, RegisterData, AuthResponse, UpdateProfileData, ChangePasswordData } from './auth';
