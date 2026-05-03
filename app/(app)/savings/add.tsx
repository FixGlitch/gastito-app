import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../../../lib/store/auth";
import { savingsAPI } from "../../../lib/api/client";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";

export default function AddSavingsScreen() {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const { token } = useAuthStore();
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: () => {
      const amountNum = parseFloat(amount.replace(",", "."));
      return savingsAPI.create({
        name,
        amount: amountNum,
        currentAmount: 0,
      }, token!);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savings'] });
      router.back();
    },
  });

  const handleNumberPress = (num: string) => {
    if (num === "⌫") {
      setAmount(prev => prev.slice(0, -1));
    } else if (num === ",") {
      if (!amount.includes(",")) {
        setAmount(prev => prev + ",");
      }
    } else {
      setAmount(prev => prev + num);
    }
  };

  const numbers = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    [",", "0", "⌫"],
  ];

  return (
    <ScrollView className="flex-1 bg-background px-6 pt-12">
      <View className="flex-row items-center justify-between mb-6">
        <TouchableOpacity onPress={() => router.back()} className="min-h-[48px] justify-center">
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-textPrimary">Nueva meta</Text>
        <View className="w-6" />
      </View>

      <View className="mb-6">
        <Input
          label="Nombre de la meta"
          placeholder="Ej: Viaje"
          value={name}
          onChangeText={setName}
        />
      </View>

      <View className="mb-6">
        <Text className="text-5xl font-bold text-center text-textPrimary mb-2">
          ${amount || "0,00"}
        </Text>
        <Text className="text-center text-textSecondary">Monto objetivo</Text>
      </View>

      <View className="mt-6">
        {numbers.map((row, rowIndex) => (
          <View key={rowIndex} className="flex-row justify-around mb-3">
            {row.map(num => (
              <TouchableOpacity
                key={num}
                onPress={() => handleNumberPress(num)}
                className="w-16 h-16 rounded-2xl bg-white items-center justify-center"
                style={{ minHeight: 64 }}
              >
                <Text className="text-2xl text-textPrimary">{num}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>

      <Button
        title="Guardar meta"
        onPress={() => mutation.mutate()}
        loading={mutation.isPending}
        size="lg"
        className="mt-4"
      />
    </ScrollView>
  );
}
