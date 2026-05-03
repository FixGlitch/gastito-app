import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Switch, TouchableOpacity, Alert } from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../../contexts/AuthContext";
import { financeAPI } from "../../../lib/api/client";
import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { DollarSign, PiggyBank, TrendingUp, Moon, Bell } from "lucide-react-native";

export default function SettingsScreen() {
  const { logout, token, user } = useAuth();
  const queryClient = useQueryClient();
  const [salary, setSalary] = useState("");
  const [savingsPercent, setSavingsPercent] = useState("20");
  const [inflation, setInflation] = useState("0");
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['finance-profile'],
    queryFn: () => financeAPI.getProfile(token!),
    enabled: !!token,
  });

  useEffect(() => {
    if (profile) {
      setSalary(profile.monthlySalary?.toString() || "");
      setSavingsPercent(profile.savingsPercentage?.toString() || "20");
      setInflation(profile.inflationAdjustmentPercent?.toString() || "0");
    }
  }, [profile]);

  const configureMutation = useMutation({
    mutationFn: () => {
      const salaryNum = parseFloat(salary.replace(",", "."));
      const savingsNum = parseFloat(savingsPercent.replace(",", "."));
      const inflationNum = parseFloat(inflation.replace(",", "."));
      return financeAPI.configure({
        monthlySalary: salaryNum,
        savingsPercentage: savingsNum,
        inflationAdjustmentPercent: inflationNum,
      }, token!);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finance-profile'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-overview'] });
      Alert.alert("Éxito", "Configuración guardada");
    },
    onError: () => {
      Alert.alert("Error", "No se pudo guardar");
    }
  });

  const formatCurrency = (amount: number) =>
    `$${amount?.toLocaleString('es-AR') || '0'}`;

  return (
    <ScrollView className="flex-1 bg-background px-6 pt-12 pb-20">
      <Text className="text-2xl font-bold text-textPrimary mb-6">Ajustes</Text>

      <Text className="text-lg font-bold text-textPrimary mb-3">Finanzas</Text>

      <Card className="mb-4">
        <View className="flex-row items-center mb-4">
          <View className="w-10 h-10 rounded-lg bg-secondary/20 items-center justify-center mr-3">
            <DollarSign size={20} color="#60A5FA" />
          </View>
          <View className="flex-1">
            <Text className="text-sm text-textSecondary">Sueldo mensual</Text>
            <Input
              value={salary}
              onChangeText={setSalary}
              placeholder="$ 0"
              className="border-0 p-0"
            />
          </View>
        </View>

        <View className="flex-row items-center mb-4">
          <View className="w-10 h-10 rounded-lg bg-success/20 items-center justify-center mr-3">
            <PiggyBank size={20} color="#6EE7B7" />
          </View>
          <View className="flex-1">
            <Text className="text-sm text-textSecondary">% Ahorro</Text>
            <Input
              value={savingsPercent}
              onChangeText={setSavingsPercent}
              placeholder="20"
              className="border-0 p-0"
            />
          </View>
        </View>

        <View className="flex-row items-center">
          <View className="w-10 h-10 rounded-lg bg-warning/20 items-center justify-center mr-3">
            <TrendingUp size={20} color="#FBBF24" />
          </View>
          <View className="flex-1">
            <Text className="text-sm text-textSecondary">Inflación mensual (%)</Text>
            <Input
              value={inflation}
              onChangeText={setInflation}
              placeholder="0"
              className="border-0 p-0"
            />
          </View>
        </View>
      </Card>

      <Button
        title="Guardar configuración"
        onPress={() => configureMutation.mutate()}
        loading={configureMutation.isPending}
        size="lg"
        className="mb-4"
      />

      {profile && (
        <Card className="mb-4">
          <Text className="text-sm text-textSecondary mb-2">Resumen financiero</Text>
          <View className="flex-row justify-between mb-2">
            <Text className="text-textPrimary">Sueldo:</Text>
            <Text className="font-semibold">{formatCurrency(profile.monthlySalary || 0)}</Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-textPrimary">Ahorro ({profile.savingsPercentage || 0}%):</Text>
            <Text className="font-semibold text-success">
              {formatCurrency((profile.monthlySalary || 0) * ((profile.savingsPercentage || 0) / 100))}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-textPrimary">Disponible:</Text>
            <Text className="font-semibold text-primary">
              {formatCurrency((profile.monthlySalary || 0) * (1 - (profile.savingsPercentage || 0) / 100))}
            </Text>
          </View>
        </Card>
      )}

      <Text className="text-lg font-bold text-textPrimary mb-3">Preferencias</Text>

      <Card className="mb-4">
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center">
            <Moon size={20} color="#6B7280" />
            <Text className="ml-3 text-base text-textPrimary">Modo oscuro</Text>
          </View>
          <Switch value={darkMode} onValueChange={setDarkMode} />
        </View>

        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Bell size={20} color="#6B7280" />
            <Text className="ml-3 text-base text-textPrimary">Notificaciones</Text>
          </View>
          <Switch value={notifications} onValueChange={setNotifications} />
        </View>
      </Card>

      <Button
        title="Cerrar sesión"
        onPress={logout}
        className="bg-alert mt-4"
        size="lg"
      />
    </ScrollView>
  );
}
