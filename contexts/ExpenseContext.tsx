import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { expensesAPI, savingsAPI, dashboardAPI, financeAPI } from '../lib/api/client';
import { useAuth } from './AuthContext';
import {
  Expense,
  CreateExpenseData,
  ExpenseSummary,
  SavingsGoal,
  CreateSavingsData,
  DashboardOverview,
  MonthlyComparison,
  FinanceProfile,
  FinanceSummary,
  BudgetAlert,
} from '../types';

interface ExpenseContextType {
  expenses: Expense[];
  expenseSummary: ExpenseSummary[];
  savingsGoals: SavingsGoal[];
  dashboardOverview: DashboardOverview | null;
  monthlyComparison: MonthlyComparison | null;
  financeProfile: FinanceProfile | null;
  financeSummary: FinanceSummary | null;
  budgetAlerts: BudgetAlert[];
  isLoading: boolean;
  loadExpenses: (params?: any) => Promise<void>;
  createExpense: (data: CreateExpenseData) => Promise<void>;
  updateExpense: (id: string, data: Partial<CreateExpenseData>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  loadExpenseSummary: () => Promise<void>;
  loadSavingsGoals: () => Promise<void>;
  createSavingsGoal: (data: CreateSavingsData) => Promise<void>;
  updateSavingsGoal: (id: string, data: Partial<CreateSavingsData>) => Promise<void>;
  deleteSavingsGoal: (id: string) => Promise<void>;
  loadDashboardOverview: () => Promise<void>;
  loadMonthlyComparison: () => Promise<void>;
  loadFinanceProfile: () => Promise<void>;
  configureFinance: (salary: number, savingsGoal: number) => Promise<FinanceSummary>;
  loadFinanceSummary: () => Promise<void>;
  loadBudgetAlerts: () => Promise<void>;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export function ExpenseProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [expenseSummary, setExpenseSummary] = useState<ExpenseSummary[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [dashboardOverview, setDashboardOverview] = useState<DashboardOverview | null>(null);
  const [monthlyComparison, setMonthlyComparison] = useState<MonthlyComparison | null>(null);
  const [financeProfile, setFinanceProfile] = useState<FinanceProfile | null>(null);
  const [financeSummary, setFinanceSummary] = useState<FinanceSummary | null>(null);
  const [budgetAlerts, setBudgetAlerts] = useState<BudgetAlert[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadExpenses = useCallback(async (params?: any) => {
    if (!token) return;
    setIsLoading(true);
    try {
      const data = await expensesAPI.list(token, params);
      setExpenses(data);
    } catch (error) {
      console.error('Error loading expenses:', error);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const createExpense = useCallback(async (data: CreateExpenseData) => {
    if (!token) throw new Error('No authenticated');
    const newExpense = await expensesAPI.create(data, token);
    setExpenses(prev => [newExpense, ...prev]);
  }, [token]);

  const updateExpense = useCallback(async (id: string, data: Partial<CreateExpenseData>) => {
    if (!token) throw new Error('No authenticated');
    const updated = await expensesAPI.update(id, data, token);
    setExpenses(prev => prev.map(e => e.id === id ? updated : e));
  }, [token]);

  const deleteExpense = useCallback(async (id: string) => {
    if (!token) throw new Error('No authenticated');
    await expensesAPI.delete(id, token);
    setExpenses(prev => prev.filter(e => e.id !== id));
  }, [token]);

  const loadExpenseSummary = useCallback(async () => {
    if (!token) return;
    try {
      const data = await expensesAPI.getSummary(token);
      setExpenseSummary(data);
    } catch (error) {
      console.error('Error loading expense summary:', error);
    }
  }, [token]);

  const loadSavingsGoals = useCallback(async () => {
    if (!token) return;
    try {
      const data = await savingsAPI.list(token);
      setSavingsGoals(data);
    } catch (error) {
      console.error('Error loading savings goals:', error);
    }
  }, [token]);

  const createSavingsGoal = useCallback(async (data: CreateSavingsData) => {
    if (!token) throw new Error('No authenticated');
    const newGoal = await savingsAPI.create(data, token);
    setSavingsGoals(prev => [...prev, newGoal]);
  }, [token]);

  const updateSavingsGoal = useCallback(async (id: string, data: Partial<CreateSavingsData>) => {
    if (!token) throw new Error('No authenticated');
    const updated = await savingsAPI.update(id, data, token);
    setSavingsGoals(prev => prev.map(g => g.id === id ? updated : g));
  }, [token]);

  const deleteSavingsGoal = useCallback(async (id: string) => {
    if (!token) throw new Error('No authenticated');
    await savingsAPI.delete(id, token);
    setSavingsGoals(prev => prev.filter(g => g.id !== id));
  }, [token]);

  const loadDashboardOverview = useCallback(async () => {
    if (!token) return;
    try {
      const data = await dashboardAPI.overview(token);
      setDashboardOverview(data);
    } catch (error) {
      console.error('Error loading dashboard overview:', error);
    }
  }, [token]);

  const loadMonthlyComparison = useCallback(async () => {
    if (!token) return;
    try {
      const data = await dashboardAPI.comparison(token);
      setMonthlyComparison(data);
    } catch (error) {
      console.error('Error loading monthly comparison:', error);
    }
  }, [token]);

  const loadFinanceProfile = useCallback(async () => {
    if (!token) return;
    try {
      const data = await financeAPI.getProfile(token);
      setFinanceProfile(data);
    } catch (error) {
      console.error('Error loading finance profile:', error);
    }
  }, [token]);

  const configureFinance = useCallback(async (salary: number, savingsGoal: number) => {
    if (!token) throw new Error('No authenticated');
    const data = await financeAPI.configure({ salary, savingsGoal }, token);
    await loadFinanceSummary();
    return data;
  }, [token]);

  const loadFinanceSummary = useCallback(async () => {
    if (!token) return;
    try {
      const data = await financeAPI.getSummary(token);
      setFinanceSummary(data);
    } catch (error) {
      console.error('Error loading finance summary:', error);
    }
  }, [token]);

  const loadBudgetAlerts = useCallback(async () => {
    if (!token) return;
    try {
      const data = await financeAPI.getAlerts(token);
      setBudgetAlerts(data);
    } catch (error) {
      console.error('Error loading budget alerts:', error);
    }
  }, [token]);

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        expenseSummary,
        savingsGoals,
        dashboardOverview,
        monthlyComparison,
        financeProfile,
        financeSummary,
        budgetAlerts,
        isLoading,
        loadExpenses,
        createExpense,
        updateExpense,
        deleteExpense,
        loadExpenseSummary,
        loadSavingsGoals,
        createSavingsGoal,
        updateSavingsGoal,
        deleteSavingsGoal,
        loadDashboardOverview,
        loadMonthlyComparison,
        loadFinanceProfile,
        configureFinance,
        loadFinanceSummary,
        loadBudgetAlerts,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpense() {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpense must be used within an ExpenseProvider');
  }
  return context;
}
