import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function ResetPasswordScreen() {
  const { token } = useLocalSearchParams<{ token: string }>();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const { validateResetToken, resetPassword } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        Alert.alert("Error", "Token no válido");
        router.back();
        return;
      }
      try {
        await validateResetToken(token);
        setIsTokenValid(true);
      } catch (error: any) {
        Alert.alert("Error", "El enlace ha expirado o no es válido");
        router.replace("/(auth)/forgot-password");
      } finally {
        setIsValidating(false);
      }
    };
    validateToken();
  }, [token]);

  const handleSubmit = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres");
      return;
    }
    try {
      await resetPassword(token!, newPassword, confirmPassword);
      Alert.alert("Éxito", "Tu contraseña ha sido actualizada", [
        { text: "OK", onPress: () => router.replace("/(auth)/login") },
      ]);
    } catch (error: any) {
      Alert.alert("Error", error.message || "No se pudo actualizar la contraseña");
    }
  };

  if (isValidating) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text className="text-foreground mt-4">Validando enlace...</Text>
      </View>
    );
  }

  if (!isTokenValid) {
    return null;
  }

  return (
    <View className="flex-1 bg-background p-6 justify-center">
      <Text className="text-2xl font-bold text-foreground mb-2">Nueva contraseña</Text>
      <Text className="text-muted-foreground mb-8">
        Ingresa tu nueva contraseña y confírmala.
      </Text>
      <TextInput
        className="bg-card border border-border rounded-lg p-4 mb-4 text-foreground"
        placeholder="Nueva contraseña"
        placeholderTextColor="#6B7280"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
      />
      <TextInput
        className="bg-card border border-border rounded-lg p-4 mb-6 text-foreground"
        placeholder="Confirmar contraseña"
        placeholderTextColor="#6B7280"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <TouchableOpacity
        className="bg-primary rounded-lg p-4 items-center"
        onPress={handleSubmit}
      >
        <Text className="text-primary-foreground font-semibold">Actualizar contraseña</Text>
      </TouchableOpacity>
    </View>
  );
}
