import React, { useState, useEffect, useMemo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "expo-router";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../contexts/AuthContext";
import { expensesAPI } from "../../../lib/api/client";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { CategorySelector } from "../../../components/expense/CategorySelector";
import { ArrowLeft } from "lucide-react-native";
import { Category } from "../../../types/expense";

const addExpenseSchema = z.object({
  description: z.string().min(1, "Ingresá una descripción"),
});

type AddExpenseForm = z.infer<typeof addExpenseSchema>;

export default function AddExpenseScreen() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [amount, setAmount] = useState("");
  const router = useRouter();
  const queryClient = useQueryClient();
  const { token } = useAuth();

  // Fetch categories from backend
  const { data: rawCategories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => expensesAPI.getCategories(token!),
    enabled: !!token,
  });

  // Map backend icon names to Lucide icon names
  const iconMap: Record<string, string> = {
    'utensils': 'UtensilsCrossed',
    'car': 'Car',
    'bus': 'Bus',
    'zap': 'Zap',
    'gamepad-2': 'Gamepad2',
    'heart': 'Heart',
    'graduation-cap': 'GraduationCap',
    'home': 'Home',
    'shirt': 'Shirt',
    'ellipsis': 'Ellipsis',
  };

  const categories: Category[] = useMemo(() => 
    rawCategories.map((cat: any) => ({
      ...cat,
      icon: iconMap[cat.icon] || cat.icon,
      iconName: iconMap[cat.icon] || cat.icon, // for compatibility
    })),
    [rawCategories]
  );

  // Set default category when categories load
  useEffect(() => {
    if (categories && categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0]);
    }
  }, [categories, selectedCategory]);

  const mutation = useMutation({
    mutationFn: async (data: AddExpenseForm) => {
      const amountNum = parseFloat(amount.replace(",", "."));
      if (isNaN(amountNum) || amountNum <= 0) {
        throw new Error("Ingresá un monto válido");
      }
      if (!selectedCategory) {
        throw new Error("Seleccioná una categoría");
      }
      return expensesAPI.create({
        description: data.description,
        amount: amountNum,
        category: selectedCategory.key,
        date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      }, token!);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-overview'] });
      queryClient.invalidateQueries({ queryKey: ['recent-expenses'] });
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

  const { handleSubmit } = useForm<AddExpenseForm>({
    resolver: zodResolver(addExpenseSchema),
  });

  const onSubmit = (data: AddExpenseForm) => {
    mutation.mutate(data);
  };

  return (
    <View className="flex-1 bg-background px-6 pt-12">
      <View className="flex-row items-center justify-between mb-6">
        <TouchableOpacity onPress={() => router.back()} className="min-h-[48px] justify-center">
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-textPrimary">Nuevo gasto</Text>
        <View className="w-6" />
      </View>

      <View className="mb-6">
        <Text className="text-5xl font-bold text-center text-textPrimary mb-2">
          ${amount || "0,00"}
        </Text>
        <Text className="text-center text-textSecondary">Monto</Text>
      </View>

      <View className="mb-6">
        <Input
          name="description"
          control={undefined}
          placeholder="Descripción del gasto"
          onChangeText={() => {}}
          className="bg-white"
        />
      </View>

      <CategorySelector
        categories={categories}
        selectedKey={selectedCategory?.key || ""}
        onSelect={(cat) => setSelectedCategory(cat)}
      />

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
        title="Guardar gasto"
        onPress={handleSubmit(onSubmit)}
        loading={mutation.isPending}
        size="lg"
        className="mt-4"
      />
    </View>
  );
}
