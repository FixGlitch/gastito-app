export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  type: 'expense' | 'income';
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
  key: string;
  label: string;
  icon: string;
  color: string;
  isSube?: boolean;
}
