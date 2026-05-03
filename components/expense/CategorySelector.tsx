import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import * as LucideIcons from "lucide-react-native";
import { Category } from "../../types/expense";

interface CategorySelectorProps {
  categories: Category[];
  selectedKey: string;
  onSelect: (category: Category) => void;
}

export function CategorySelector({ categories, selectedKey, onSelect }: CategorySelectorProps) {
  const getIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent || LucideIcons.HelpCircle;
  };

  return (
    <View>
      <Text className="text-sm font-medium text-textSecondary mb-3">Categoría</Text>
      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => {
          const Icon = getIcon(item.icon);
          const isSelected = item.key === selectedKey;
          return (
            <TouchableOpacity
              onPress={() => onSelect(item)}
              className={`mr-3 px-4 py-2 rounded-xl flex-row items-center ${
                isSelected ? 'bg-primary' : 'bg-gray-100'
              }`}
              style={{ minHeight: 48 }}
            >
              <Icon size={20} color={isSelected ? "white" : item.color} />
              <Text className={`ml-2 ${isSelected ? 'text-white font-medium' : 'text-textPrimary'}`}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        }}
        keyExtractor={item => item.key}
      />
    </View>
  );
}
