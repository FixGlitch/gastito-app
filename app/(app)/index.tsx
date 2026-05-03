import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../contexts/AuthContext";
import { Card, StatCard } from "../../components/ui/Card";
import { BalanceCard } from "../../components/home/BalanceCard";
import { RecentExpenses } from "../../components/home/RecentExpenses";
import { TrendingDown, PiggyBank, Target, Plus } from "lucide-react-native";
import * as LucideIcons from "lucide-react-native";
import { useRouter } from "expo-router";
import { dashboardAPI } from "../../lib/api/client";

export default function HomeScreen() {
  const router = useRouter();
  const { token, user } = useAuth();

  const { data: dashboard, isLoading } = useQuery({
    queryKey: ['dashboard-overview'],
    queryFn: () => dashboardAPI.overview(token!),
    enabled: !!token,
  });

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="px-6 pt-12 pb-6">
        <View className="flex-row items-center mb-6">
          <Text className="text-2xl font-bold text-textPrimary">
            Hola, {user?.name || 'Usuario'}
          </Text>
        </View>

        <BalanceCard
          available={dashboard?.available || 0}
          daysRemaining={dashboard?.daysRemaining || 30}
          totalBudget={dashboard?.totalIncome || 0}
          spent={dashboard?.totalExpenses || 0}
          savings={dashboard?.savings || 0}
        />

        <View className="flex-row gap-3 mt-4">
          <StatCard
            title="Gastado"
            value={`$${(dashboard?.totalExpenses || 0).toLocaleString('es-AR')}`}
            icon={LucideIcons.TrendingDown}
            color="text-alert"
          />
          <StatCard
            title="Ahorro"
            value={`$${(dashboard?.savings || 0).toLocaleString('es-AR')}`}
            icon={LucideIcons.PiggyBank}
            color="text-success"
          />
          <StatCard
            title="Metas"
            value={`${dashboard?.savingsGoalsCount || '0'}`}
            icon={LucideIcons.Target}
            color="text-secondary"
          />
        </View>

        <View className="flex-row items-center justify-between mt-6 mb-4">
          <Text className="text-lg font-bold text-textPrimary">Últimos gastos</Text>
          <TouchableOpacity onPress={() => router.push("/(app)/expenses")}>
            <Text className="text-primary font-medium">Ver todos</Text>
          </TouchableOpacity>
        </View>

        <RecentExpenses />
      </View>

      <TouchableOpacity
        onPress={() => router.push("/(app)/expenses/add")}
        className="absolute bottom-8 right-6 w-14 h-14 bg-primary rounded-full items-center justify-center shadow-lg"
        style={{ elevation: 8 }}
      >
        <Plus size={28} color="white" />
      </TouchableOpacity>
    </ScrollView>
  );
}
