export function calculateDailyBudget(
  totalIncome: number,
  savingsPercent: number,
  daysInMonth: number = 30
): number {
  const savings = totalIncome * (savingsPercent / 100);
  const available = totalIncome - savings;
  return available / daysInMonth;
}

export function getDaysRemaining(): number {
  const today = new Date();
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  return lastDay.getDate() - today.getDate();
}

export function getMonthName(date: Date = new Date()): string {
  return date.toLocaleDateString('es-AR', { month: 'long' });
}

export function isQuincena(): boolean {
  const day = new Date().getDate();
  return day <= 15;
}

export const CATEGORIES = [
  { id: "1", name: "Comida", iconName: "UtensilsCrossed", color: "#60A5FA" },
  { id: "2", name: "Transporte", iconName: "Car", color: "#FBBF24" },
  { id: "3", name: "Servicios", iconName: "Lightbulb", color: "#FB7185" },
  { id: "4", name: "Entretenimiento", iconName: "Gamepad2", color: "#8B5CF6" },
  { id: "5", name: "Salud", iconName: "Pill", color: "#6EE7B7" },
  { id: "6", name: "Otros", iconName: "Package", color: "#6B7280" },
];
