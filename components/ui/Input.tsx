import React from "react";
import { TextInput, View, Text } from "react-native";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

interface InputProps<T extends FieldValues> {
  placeholder?: string;
  control?: Control<T>;
  name?: Path<T>;
  value?: string;
  onChangeText?: (text: string) => void;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  secureTextEntry?: boolean;
  error?: string;
  label?: string;
  className?: string;
}

export function Input<T extends FieldValues>({
  placeholder,
  control,
  name,
  value,
  onChangeText,
  keyboardType = "default",
  secureTextEntry,
  error,
  label,
  className,
}: InputProps<T>) {
  const inputClass = className || "bg-white border border-gray-200 rounded-xl px-4 py-3 text-base text-textPrimary";

  return (
    <View className="mb-4">
      {label && (
        <Text className="text-sm font-medium text-textSecondary mb-2">{label}</Text>
      )}
      {control && name ? (
        <Controller
          control={control}
          name={name}
          render={({ field: { onChange, onBlur, value: fieldValue } }) => (
            <TextInput
              placeholder={placeholder}
              value={fieldValue}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType={keyboardType}
              secureTextEntry={secureTextEntry}
              className={inputClass}
              placeholderTextColor="#9CA3AF"
            />
          )}
        />
      ) : (
        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          className={inputClass}
          placeholderTextColor="#9CA3AF"
        />
      )}
      {error && <Text className="text-alert text-sm mt-1">{error}</Text>}
    </View>
  );
}
