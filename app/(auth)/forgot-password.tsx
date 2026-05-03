import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "expo-router";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { requestPasswordReset } = useAuth();
  const router = useRouter();

  const handleSubmit = async () => {
    if (!email) {
      Alert.alert("Error", "Por favor ingresa tu correo electrónico");
      return;
    }
    setIsLoading(true);
    try {
      await requestPasswordReset(email);
      Alert.alert(
        "Correo enviado",
        "Se ha enviado un enlace para restablecer tu contraseña a tu correo.",
        [{ text: "OK", onPress: () => router.back() }]
      );
    } catch (error: any) {
      Alert.alert("Error", error.message || "No se pudo enviar el correo");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-background p-6 justify-center">
      <Text className="text-2xl font-bold text-foreground mb-2">Recuperar contraseña</Text>
      <Text className="text-muted-foreground mb-8">
        Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
      </Text>
      <TextInput
        className="bg-card border border-border rounded-lg p-4 mb-6 text-foreground"
        placeholder="Correo electrónico"
        placeholderTextColor="#6B7280"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TouchableOpacity
        className="bg-primary rounded-lg p-4 items-center"
        onPress={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-primary-foreground font-semibold">Enviar enlace</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        className="mt-4 items-center"
        onPress={() => router.back()}
      >
        <Text className="text-primary">Volver al inicio de sesión</Text>
      </TouchableOpacity>
    </View>
  );
}
