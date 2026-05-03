import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import * as LucideIcons from "lucide-react-native";

interface ExpenseItemProps {
  expense: {
    id: string;
    amount: number;
    category: string;
    description: string;
    date: string;
  };
  onPress?: () => void;
  onDelete?: () => void;
}

// Map category names to icons
const categoryIconMap: Record<string, keyof typeof LucideIcons> = {
  'Alimentos': 'UtensilsCrossed',
  'Transporte': 'Car',
  'Sube': 'Bus',
  'Servicios': 'Zap',
  'Entretenimiento': 'Gamepad2',
  'Salud': 'Pill',
  'Educación': 'GraduationCap',
  'Hogar': 'Home',
  'Ropa': 'Shirt',
  'Otros': 'Package',
};

const categoryColorMap: Record<string, string> = {
  'Alimentos': '#F59E0B',
  'Transporte': '#8B5CF6',
  'Sube': '#2563EB',
  'Servicios': '#EF4444',
  'Entretenimiento': '#EC4899',
  'Salud': '#16A34A',
  'Educación': '#0EA5E9',
  'Hogar': '#78716C',
  'Ropa': '#A855F7',
  'Otros': '#6B7280',
};

export function ExpenseItem({ expense, onPress, onDelete }: ExpenseItemProps) {
  const iconName = categoryIconMap[expense.category] || 'Package';
  const color = categoryColorMap[expense.category] || '#6B7280';
  const IconComponent = (LucideIcons as any)[iconName];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' });
  };

  return (
    <View className="flex-row items-center py-3 border-b border-gray-100" style={{ minHeight: 48 }}>
      <TouchableOpacity
        onPress={onPress}
        className="flex-1 flex-row items-center"
      >
        <View
          className="w-11 h-11 rounded-full items-center justify-center mr-3"
          style={{ backgroundColor: color + '20' }}
        >
          {IconComponent && <IconComponent size={20} color={color} />}
        </View>
        
        <View className="flex-1">
          <Text className="text-base font-medium text-textPrimary">{expense.description}</Text>
          <Text className="text-xs text-textSecondary">{expense.category}</Text>
        </View>
        
        <View className="items-end">
          <Text className="text-base font-semibold text-alert">
            -${expense.amount.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
          </Text>
          <Text className="text-xs text-textSecondary">{formatDate(expense.date)}</Text>
        </View>
      </TouchableOpacity>
      
      {onDelete && (
        <TouchableOpacity
          onPress={onDelete}
          className="ml-2 p-2"
          style={{ minHeight: 48, minWidth: 48, justifyContent: 'center', alignItems: 'center' }}
        >
          <LucideIcons.Trash2 size={18} color="#FB7185" />
        </TouchableOpacity>
      )}
    </View>
  );
}
