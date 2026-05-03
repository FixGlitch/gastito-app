import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useAuth } from "../../../contexts/AuthContext";
import { expensesAPI } from "../../../lib/api/client";
import { ExpenseItem } from "../../../components/expense/ExpenseItem";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { Plus, Trash2 } from "lucide-react-native";
import { useRouter } from "expo-router";

export default function ExpensesListScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { token } = useAuth();
  const [filter, setFilter] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  const { data: expenses = [], isLoading } = useQuery({
    queryKey: ['expenses', selectedMonth],
    queryFn: () => expensesAPI.list(token!, { month: selectedMonth }),
    enabled: !!token,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => expensesAPI.delete(id, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });

  const filteredExpenses = expenses?.filter((e: any) =>
    !filter ||
    e.description?.toLowerCase().includes(filter.toLowerCase()) ||
    e.category?.toLowerCase().includes(filter.toLowerCase())
  );

  const handleDelete = (id: string) => {
    Alert.alert(
      "Eliminar gasto",
      "¿Estás seguro?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => deleteMutation.mutate(id),
        }
      ]
    );
  };

  return (
    <View className="flex-1 bg-background px-6 pt-12">
      <View className="flex-row items-center justify-between mb-6">
        <Text className="text-2xl font-bold text-textPrimary">Gastos</Text>
        <TouchableOpacity
          onPress={() => router.push("/(app)/expenses/add")}
          className="w-10 h-10 bg-primary rounded-full items-center justify-center"
        >
          <Plus size={20} color="white" />
        </TouchableOpacity>
      </View>

      <View className="mb-4">
        <Input
          placeholder="Buscar gasto..."
          value={filter}
          onChangeText={setFilter}
          className="bg-white"
        />
      </View>

      <View className="flex-row mb-4 gap-2">
        {(() => {
          const now = new Date();
          const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
          return (
            <Button
              title="Mes actual"
              onPress={() => setSelectedMonth(currentMonth)}
              size="sm"
              className={selectedMonth === currentMonth ? "" : "bg-gray-200"}
            />
          );
        })()}
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-textSecondary">Cargando...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredExpenses || []}
          renderItem={({ item }) => (
            <ExpenseItem
              expense={item}
              onPress={() => router.push(`/(app)/expenses/${item.id}`)}
              onDelete={() => handleDelete(item.id)}
            />
          )}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="items-center py-8">
              <Text className="text-textSecondary">No hay gastos</Text>
            </View>
          }
        />
      )}
    </View>
  );
}
