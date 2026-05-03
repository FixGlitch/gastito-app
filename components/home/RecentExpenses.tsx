import React from "react";
import { View, Text } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../contexts/AuthContext";
import { expensesAPI } from "../../lib/api/client";
import { ExpenseItem } from "../expense/ExpenseItem";

export function RecentExpenses() {
  const { token } = useAuth();

  const { data: expenses, isLoading } = useQuery({
    queryKey: ['recent-expenses'],
    queryFn: () => expensesAPI.list(token!),
    enabled: !!token,
  });

  if (isLoading) {
    return (
      <View className="py-4 items-center">
        <Text className="text-textSecondary">Cargando...</Text>
      </View>
    );
  }

  if (!expenses || expenses.length === 0) {
    return (
      <View className="py-4 items-center">
        <Text className="text-textSecondary">No hay gastos recientes</Text>
      </View>
    );
  }

  return (
    <View>
      {expenses.map((expense: any) => (
        <ExpenseItem key={expense.id} expense={expense} />
      ))}
    </View>
  );
}
