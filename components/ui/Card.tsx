import React from "react";
import { View, Text } from "react-native";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <View className={`bg-white rounded-2xl p-4 shadow-sm ${className}`}>
      {children}
    </View>
  );
}

const colorMap: Record<string, string> = {
  "text-alert": "#FB7185",
  "text-success": "#6EE7B7",
  "text-secondary": "#60A5FA",
  "text-primary": "#8B5CF6",
};

export function StatCard({ title, value, icon: Icon, color }: { title: string; value: string; icon: React.ComponentType<any>; color: string }) {
  const iconColor = colorMap[color] || "#6B7280";
  return (
    <Card className="flex-1 items-center py-3">
      <Icon size={24} color={iconColor} />
      <Text className="text-xs text-textSecondary mt-1">{title}</Text>
      <Text className={`text-lg font-bold ${color}`}>{value}</Text>
    </Card>
  );
}
