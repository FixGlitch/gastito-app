# Gastito App - Mobile Architecture

## Overview
Gastito App is a cross-platform mobile application for personal financial management, specifically adapted for Argentine users. Built with React Native and Expo, it consumes the Gastito Back API to provide authentication, expense tracking, budget management, and savings goals with Argentine-specific features.

## Technology Stack
- React Native 0.76+ with Expo 52+
- TypeScript 5.7.3
- Expo Router (file-based routing)
- NativeWind v4 (Tailwind CSS for React Native)
- Zustand 5.0.3 (state management)
- TanStack Query v5.66.0 (server state)
- React Hook Form 7.54.2 + Zod 3.24.1
- Victory Native (charts)
- expo-secure-store, expo-notifications, expo-local-authentication
- lucide-react-native, react-native-reanimated, expo-haptics

## Project Structure
```
gastito-app/
├── app/
│   ├── (auth)/
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── (app)/
│   │   ├── index.tsx (Home screen)
│   │   ├── expenses/
│   │   ├── savings/
│   │   └── settings/
│   └── _layout.tsx
├── components/
│   ├── ui/ (Button, Card, Input, etc.)
│   ├── expense/ (ExpenseCard, ExpenseList, etc.)
│   ├── budget/ (BudgetProgress, BudgetSettingsForm, etc.)
│   ├── savings/ (SavingsGoalCard, etc.)
│   ├── home/ (StatCard, SpendingTrendChart, etc.)
│   ├── charts/ (PieChart, BarChart, etc.)
│   └── layout/ (TabLayout, TopBar)
├── lib/
│   ├── api/ (client.ts, hooks/, query-keys.ts)
│   ├── store/ (auth.ts, ui.ts)
│   ├── schemas.ts, format.ts, utils.ts
├── types/ (auth.ts, expense.ts, budget.ts, etc.)
└── app.json, eas.json, package.json
```

## Architecture Patterns

### Navigation (Expo Router + Tab Navigator)
- (auth) group: login, register
- (app) group: protected tabs (Home, Expenses, Savings, Settings)
- Home screen uses /api/dashboard/* endpoints for business logic aggregation
- Auth Guard: Root layout checks auth state via Zustand + SecureStore

### State Management
- Zustand: auth (SecureStore), ui (theme)
- TanStack Query: server state, 5min stale, offline support

### API Integration
- All backend endpoints integrated
- Dashboard endpoints used in Home screen for data aggregation
- Hooks: useLogin, useExpenses, useSavingsGoals, useDashboardOverview, etc.

## Key Features

1. Authentication: login/register with SecureStore + biometric
2. Home Screen: dashboard overview, trends, top categories (from /api/dashboard/*)
3. Expense Management: CRUD, filters, ARS formatting, swipe actions
4. Savings Goals: create, track, progress visualization
5. Settings: budget config, inflation adjustment, quincena
6. Mobile features: pull-to-refresh, haptics, push notifications, offline mode

## Argentine Features
- ARS currency: $ 1.234.567,89
- SUBE card highlighting (#2563EB)
- Inflation adjustment (POST /budget/inflation)
- 10 expense categories with colors
- Quincena support (1st/15th)

## API Endpoints (All Backend)
- Auth: /api/auth/login, /register, /me
- Expenses: /api/expenses (GET, POST, PUT, DELETE), /summary
- Budget: /api/budget/summary, /allocations, /settings, /inflation, /alerts
- Savings: /api/savings (GET, POST, PUT, DELETE)
- Dashboard: /api/dashboard/overview, /comparison, /top-categories

## Environment
EXPO_PUBLIC_API_URL=http://localhost:3001/api

## Build
npx expo start
eas build -p ios/android
npx expo lint

## Security
- Tokens in expo-secure-store (encrypted)
- Biometric auth optional
- HTTPS in production

## Notes
- Consumes Gastito Back API (same as web)
- No separate dashboard module - uses endpoints for business logic in Home
- Cross-platform iOS + Android
- Expo managed workflow
- Argentine features fully supported
