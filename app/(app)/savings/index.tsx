import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useAuth } from "../../../contexts/AuthContext";
import { savingsAPI } from "../../../lib/api/client";
import { Card } from "../../../components/ui/Card";
import { ProgressBar } from "../../../components/ui/ProgressBar";
import { PiggyBank, Plus } from "lucide-react-native";
import { useRouter } from "expo-router";

export default function SavingsScreen() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: savings = [], isLoading } = useQuery({
    queryKey: ['savings'],
    queryFn: () => savingsAPI.list(token!),
    enabled: !!token,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => savingsAPI.delete(id, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savings'] });
    },
  });

  const handleDelete = (id: string) => {
    Alert.alert("Eliminar meta", "¿Estás seguro?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => deleteMutation.mutate(id),
      }
    ]);
  };

  const formatCurrency = (amount: number) =>
    `$${amount?.toLocaleString('es-AR') || '0'}`;

  return (
    <ScrollView className="flex-1 bg-background px-6 pt-12 pb-20">
      <View className="flex-row items-center justify-between mb-6">
        <Text className="text-2xl font-bold text-textPrimary">Ahorros</Text>
        <TouchableOpacity
          onPress={() => router.push("/(app)/savings/add")}
          className="w-10 h-10 bg-primary rounded-full items-center justify-center"
        >
          <Plus size={20} color="white" />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View className="py-8 items-center">
          <Text className="text-textSecondary">Cargando...</Text>
        </View>
      ) : savings.length === 0 ? (
        <View className="py-8 items-center">
          <Text className="text-textSecondary">No tenés metas de ahorro</Text>
        </View>
      ) : (
        savings.map((goal: any) => {
          const progress = goal.targetAmount > 0
            ? (goal.currentAmount / goal.targetAmount) * 100
            : 0;
          return (
            <Card key={goal.id} className="mb-3">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                  <View className="w-10 h-10 rounded-xl bg-success/20 items-center justify-center mr-3">
                    <PiggyBank size={20} color="#6EE7B7" />
                  </View>
                  <View className="flex-1">
                    <Text className="font-medium text-textPrimary">{goal.name}</Text>
                    <Text className="text-xs text-textSecondary">
                      {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                    </Text>
                  </View>
                </View>
                <View className="items-end">
                  <Text className="text-success font-bold">{progress.toFixed(0)}%</Text>
                  <TouchableOpacity onPress={() => handleDelete(goal.id)}>
                    <Text className="text-alert text-xs">Eliminar</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <ProgressBar
                segments={[{ percent: progress, color: "#6EE7B7" }]}
                height={8}
                className="mt-3"
              />
            </Card>
          );
        })
      )}
    </ScrollView>
  );
}
