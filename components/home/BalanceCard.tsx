import React from "react";
import { View, Text } from "react-native";
import { ProgressBar } from "../ui/ProgressBar";

interface BalanceCardProps {
  available: number;
  daysRemaining: number;
  totalBudget: number;
  spent: number;
  savings: number;
}

export function BalanceCard({ available, daysRemaining, totalBudget, spent, savings }: BalanceCardProps) {
  const savingsPercent = totalBudget > 0 ? (savings / totalBudget) * 100 : 0;
  const spentPercent = totalBudget > 0 ? (spent / totalBudget) * 100 : 0;
  const availablePercent = 100 - savingsPercent - spentPercent;

  return (
    <View className="bg-white rounded-2xl p-5 shadow-sm">
      <Text className="text-sm text-textSecondary mb-1">Disponible para gastar</Text>
      <Text className="text-4xl font-bold text-success mb-1">
        ${available.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
      </Text>
      <Text className="text-xs text-textSecondary mb-4">
        {daysRemaining} días restantes
      </Text>
      
      <ProgressBar
        segments={[
          { percent: savingsPercent, color: "#8B5CF6" },
          { percent: spentPercent, color: "#FB7185" },
          { percent: availablePercent, color: "#6EE7B7" },
        ]}
      />
      
      <View className="flex-row justify-between mt-3">
        <View className="flex-row items-center">
          <View className="w-3 h-3 rounded-full bg-success mr-2" />
          <Text className="text-xs text-textSecondary">Disponible</Text>
        </View>
        <View className="flex-row items-center">
          <View className="w-3 h-3 rounded-full bg-alert mr-2" />
          <Text className="text-xs text-textSecondary">Gastado</Text>
        </View>
        <View className="flex-row items-center">
          <View className="w-3 h-3 rounded-full bg-primary mr-2" />
          <Text className="text-xs text-textSecondary">Ahorro</Text>
        </View>
      </View>
    </View>
  );
}
