import { Platform } from 'react-native';

// 🔧 Cambiá a true para usar datos mock sin backend
const USE_MOCK = false;

const getDefaultApiUrl = () => {
  if (Platform.OS === 'android') {
    // Android emulator usa 10.0.2.2 para apuntar al host
    return 'http://10.0.2.2:3001/api';
  } else if (Platform.OS === 'ios') {
    // iOS simulator/device: usar IP local para evitar problemas de red
    return 'http://192.168.0.176:3001/api';
  } else {
    return 'http://localhost:3001/api';
  }
};

const API_URL = getDefaultApiUrl();

console.log("🔧 API_URL configurada:", API_URL, "Platform:", Platform.OS, "Mock:", USE_MOCK);

// Obtener token del store (se pasa en cada llamada)
let _token: string | null = null;

export function setApiToken(token: string | null) {
  console.log("🔑 Token actualizado:", token ? "Presente" : "Nulo");
  _token = token;
}

async function apiRequest(
  endpoint: string,
  options: {
    method?: string;
    headers?: Record<string, string>;
    body?: any;
    token?: string;
  } = {},
) {
  const { method = "GET", headers = {}, body, token = _token } = options;

  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (token) {
    requestHeaders["Authorization"] = `Bearer ${token}`;
  }

  const url = `${API_URL}${endpoint}`;
  console.log("📡 Haciendo petición:", { method, url, body, hasToken: !!token });

  try {
    const response = await fetch(url, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    console.log("📥 Respuesta recibida:", { status: response.status, ok: response.ok, url });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Error en respuesta:", errorText);
      let error;
      try {
        error = JSON.parse(errorText);
      } catch {
        error = { message: errorText || `Error ${response.status}` };
      }
      throw new Error(error.message || `Error ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ Datos recibidos:", data);
    // Tu backend envuelve las respuestas en { data: ... }
    if (data && typeof data === 'object' && 'data' in data) {
      return data.data;
    }
    return data;
  } catch (error: any) {
    console.error("❌ Error en fetch:", error.message, error);
    throw error;
  }
}

export const api = {
  get: (endpoint: string, token?: string) =>
    apiRequest(endpoint, { method: "GET", token }),

  post: (endpoint: string, data: any, token?: string) =>
    apiRequest(endpoint, { method: "POST", body: data, token }),

  put: (endpoint: string, data: any, token?: string) =>
    apiRequest(endpoint, { method: "PUT", body: data, token }),

  patch: (endpoint: string, data: any, token?: string) =>
    apiRequest(endpoint, { method: "PATCH", body: data, token }),

  delete: (endpoint: string, token?: string) =>
    apiRequest(endpoint, { method: "DELETE", token }),
};

// Mock data para desarrollo sin backend
const mockUser = {
  id: "1",
  name: "Usuario Demo",
  email: "demo@gastito.com",
  role: 'user' as const,
  salary: 500000,
  savingsGoal: 100000,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const mockExpenses = [
  { id: "1", amount: 1500, category: "Comida", description: "Almuerzo", date: new Date().toISOString(), type: 'expense' as const },
  { id: "2", amount: 5000, category: "Transporte", description: "Uber", date: new Date().toISOString(), type: 'expense' as const },
  { id: "3", amount: 3000, category: "Entretenimiento", description: "Cine", date: new Date().toISOString(), type: 'expense' as const },
];

const mockSavingsGoals = [
  { id: "1", name: "Vacaciones", targetAmount: 100000, currentAmount: 25000, deadline: "2026-12-31", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const mockDashboardOverview = {
  totalExpenses: 9500,
  totalIncome: 500000,
  savingsProgress: 25,
  recentExpenses: mockExpenses.slice(0, 3),
  topCategories: [
    { category: "Comida", total: 1500, count: 1, color: "#60A5FA" },
    { category: "Transporte", total: 5000, count: 1, color: "#FBBF24" },
  ],
};

const mockFinanceSummary = {
  salary: 500000,
  savings: 100000,
  available: 400000,
};

// Endpoints de autenticación
export const authAPI = {
  login: (email: string, password: string) => {
    if (USE_MOCK) {
      console.log("🔧 Usando mock login");
      return Promise.resolve({ user: mockUser, token: "mock-token-123" });
    }
    return api.post("/auth/login", { email, password });
  },
  register: (name: string, email: string, password: string) => {
    if (USE_MOCK) {
      console.log("🔧 Usando mock register");
      return Promise.resolve({ user: { ...mockUser, name, email }, token: "mock-token-123" });
    }
    return api.post("/auth/register", { name, email, password });
  },
  getProfile: (token: string) => {
    if (USE_MOCK) {
      console.log("🔧 Usando mock getProfile");
      return Promise.resolve(mockUser);
    }
    return api.get("/auth/me", token);
  },
  updateProfile: (data: any, token: string) => {
    if (USE_MOCK) {
      console.log("🔧 Usando mock updateProfile");
      return Promise.resolve({ ...mockUser, ...data });
    }
    return api.put("/auth/me", data, token);
  },
  changePassword: (data: any, token: string) => {
    if (USE_MOCK) {
      console.log("🔧 Usando mock changePassword");
      return Promise.resolve();
    }
    return api.patch("/auth/password", data, token);
  },
  // Password recovery endpoints
  requestPasswordReset: (email: string) => {
    if (USE_MOCK) {
      console.log("🔧 Usando mock requestPasswordReset");
      return Promise.resolve();
    }
    return api.post("/auth/password-reset/send", { email });
  },
  validateResetToken: (token: string) => {
    if (USE_MOCK) {
      console.log("🔧 Usando mock validateResetToken");
      return Promise.resolve({ valid: true });
    }
    return api.get(`/auth/password-reset/validate/${token}`);
  },
  resetPassword: (token: string, newPassword: string, confirmPassword: string) => {
    if (USE_MOCK) {
      console.log("🔧 Usando mock resetPassword");
      return Promise.resolve();
    }
    return api.post("/auth/password-reset/reset", { token, newPassword, confirmPassword });
  },
};

// Endpoints de gastos
export const expensesAPI = {
  list: (token: string, params?: any) => {
    if (USE_MOCK) {
      console.log("🔧 Mock: list expenses");
      return Promise.resolve([...mockExpenses]);
    }
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    return api.get(`/expenses${query}`, token);
  },
  getCategories: (token: string) => {
    if (USE_MOCK) {
      console.log("🔧 Mock: get categories");
      return Promise.resolve([
        { key: 'alimentos', label: 'Alimentos', icon: 'utensils', color: '#F59E0B', isSube: false },
        { key: 'transporte', label: 'Transporte', icon: 'car', color: '#8B5CF6', isSube: false },
        { key: 'sube', label: 'SUBE', icon: 'bus', color: '#2563EB', isSube: true },
        { key: 'servicios', label: 'Servicios', icon: 'zap', color: '#EF4444', isSube: false },
        { key: 'entretenimiento', label: 'Entretenimiento', icon: 'gamepad-2', color: '#EC4899', isSube: false },
        { key: 'salud', label: 'Salud', icon: 'heart', color: '#16A34A', isSube: false },
        { key: 'educacion', label: 'Educación', icon: 'graduation-cap', color: '#0EA5E9', isSube: false },
        { key: 'hogar', label: 'Hogar', icon: 'home', color: '#78716C', isSube: false },
        { key: 'ropa', label: 'Ropa', icon: 'shirt', color: '#A855F7', isSube: false },
        { key: 'otros', label: 'Otros', icon: 'ellipsis', color: '#6B7280', isSube: false },
      ]);
    }
    return api.get('/expenses/categories', token);
  },
  create: (data: any, token: string) => {
    if (USE_MOCK) {
      console.log("🔧 Mock: create expense", data);
      const newExpense = { id: Date.now().toString(), ...data, date: new Date().toISOString() };
      mockExpenses.push(newExpense);
      return Promise.resolve(newExpense);
    }
    return api.post("/expenses", data, token);
  },
  getSummary: (token: string) => {
    if (USE_MOCK) {
      console.log("🔧 Mock: expenses summary");
      return Promise.resolve([
        { category: "Comida", total: 1500, count: 1, color: "#60A5FA" },
        { category: "Transporte", total: 5000, count: 1, color: "#FBBF24" },
      ]);
    }
    return api.get("/expenses/summary", token);
  },
  getById: (id: string, token: string) => {
    if (USE_MOCK) {
      const expense = mockExpenses.find(e => e.id === id);
      return Promise.resolve(expense || mockExpenses[0]);
    }
    return api.get(`/expenses/${id}`, token);
  },
  update: (id: string, data: any, token: string) => {
    if (USE_MOCK) {
      console.log("🔧 Mock: update expense", id, data);
      const index = mockExpenses.findIndex(e => e.id === id);
      if (index !== -1) mockExpenses[index] = { ...mockExpenses[index], ...data };
      return Promise.resolve(mockExpenses[index]);
    }
    return api.put(`/expenses/${id}`, data, token);
  },
  delete: (id: string, token: string) => {
    if (USE_MOCK) {
      console.log("🔧 Mock: delete expense", id);
      const index = mockExpenses.findIndex(e => e.id === id);
      if (index !== -1) mockExpenses.splice(index, 1);
      return Promise.resolve();
    }
    return api.delete(`/expenses/${id}`, token);
  },
};

// Endpoints de presupuesto (budget)
export const budgetAPI = {
  // No hay endpoints específicos en la lista, usar expenses/summary o finance/summary
};

// Endpoints de ahorros (savings)
export const savingsAPI = {
  list: (token: string) => {
    if (USE_MOCK) {
      console.log("🔧 Mock: list savings");
      return Promise.resolve([...mockSavingsGoals]);
    }
    return api.get("/savings", token);
  },
  create: (data: any, token: string) => {
    if (USE_MOCK) {
      console.log("🔧 Mock: create savings", data);
      const newGoal = { id: Date.now().toString(), ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      mockSavingsGoals.push(newGoal);
      return Promise.resolve(newGoal);
    }
    return api.post("/savings", data, token);
  },
  getProjection: (token: string) => {
    if (USE_MOCK) {
      console.log("🔧 Mock: savings projection");
      return Promise.resolve({ projectedAmount: 50000, monthsToGoal: 6 });
    }
    return api.get("/savings/projection", token);
  },
  getById: (id: string, token: string) => {
    if (USE_MOCK) {
      const goal = mockSavingsGoals.find(g => g.id === id);
      return Promise.resolve(goal || mockSavingsGoals[0]);
    }
    return api.get(`/savings/${id}`, token);
  },
  update: (id: string, data: any, token: string) => {
    if (USE_MOCK) {
      console.log("🔧 Mock: update savings", id, data);
      const index = mockSavingsGoals.findIndex(g => g.id === id);
      if (index !== -1) mockSavingsGoals[index] = { ...mockSavingsGoals[index], ...data };
      return Promise.resolve(mockSavingsGoals[index]);
    }
    return api.put(`/savings/${id}`, data, token);
  },
  delete: (id: string, token: string) => {
    if (USE_MOCK) {
      console.log("🔧 Mock: delete savings", id);
      const index = mockSavingsGoals.findIndex(g => g.id === id);
      if (index !== -1) mockSavingsGoals.splice(index, 1);
      return Promise.resolve();
    }
    return api.delete(`/savings/${id}`, token);
  },
};

// Endpoints de dashboard
export const dashboardAPI = {
  overview: (token: string) => {
    if (USE_MOCK) {
      console.log("🔧 Mock: dashboard overview");
      return Promise.resolve(mockDashboardOverview);
    }
    return api.get("/dashboard/overview", token);
  },
  comparison: (token: string) => {
    if (USE_MOCK) {
      console.log("🔧 Mock: dashboard comparison");
      return Promise.resolve({ currentMonth: 9500, previousMonth: 8700, difference: 800, percentageChange: 9.2 });
    }
    return api.get("/dashboard/comparison", token);
  },
  topCategories: (token: string) => {
    if (USE_MOCK) {
      console.log("🔧 Mock: top categories");
      return Promise.resolve(mockDashboardOverview.topCategories);
    }
    return api.get("/dashboard/top-categories", token);
  },
};

// Endpoints de finanzas
export const financeAPI = {
  getProfile: (token: string) => {
    if (USE_MOCK) {
      console.log("🔧 Mock: finance profile");
      return Promise.resolve({ salary: mockUser.salary, savingsGoal: mockUser.savingsGoal, availableThisMonth: mockFinanceSummary.available });
    }
    return api.get("/finance/profile", token);
  },
  updateProfile: (data: any, token: string) => {
    if (USE_MOCK) {
      console.log("🔧 Mock: update finance profile", data);
      return Promise.resolve({ ...mockUser, ...data });
    }
    return api.put("/finance/profile", data, token);
  },
  configure: (data: any, token: string) => {
    if (USE_MOCK) {
      console.log("🔧 Mock: configure finance", data);
      return Promise.resolve({ ...mockFinanceSummary, ...data, available: (data.salary || 500000) - (data.savingsGoal || 100000) });
    }
    return api.post("/finance/configure", data, token);
  },
  getSummary: (token: string) => {
    if (USE_MOCK) {
      console.log("🔧 Mock: finance summary");
      return Promise.resolve(mockFinanceSummary);
    }
    return api.get("/finance/summary", token);
  },
  getAlerts: (token: string) => {
    if (USE_MOCK) {
      console.log("🔧 Mock: finance alerts");
      return Promise.resolve([
        { type: 'info', message: 'Llevás gastado el 20% de tu presupuesto mensual' },
      ]);
    }
    return api.get("/finance/alerts", token);
  },
};
