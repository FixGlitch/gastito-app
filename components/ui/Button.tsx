import React from "react";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
}

export function Button({ title, onPress, loading, size = "md", disabled, className }: ButtonProps) {
  const height = size === "lg" ? "h-12" : size === "sm" ? "h-8" : "h-10";
  
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`${height} bg-primary rounded-xl items-center justify-center px-6 ${disabled ? 'opacity-50' : ''} ${className}`}
    >
      {loading ? (
        <ActivityIndicator color="white" size="small" />
      ) : (
        <Text className="text-white font-semibold text-base">{title}</Text>
      )}
    </TouchableOpacity>
  );
}
