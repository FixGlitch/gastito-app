import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../../contexts/AuthContext";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Wallet } from "lucide-react-native";

const loginSchema = z.object({
  email: z.string().email("Ingresá un correo válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const [error, setError] = useState("");
  const { login, isLoading } = useAuth();
  const router = useRouter();

  const { control, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    mode: 'onSubmit',
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setError("");
      await login({ email: data.email, password: data.password });
      router.replace("/(app)");
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.message?.includes("Network request failed") || err.message?.includes("fetch")) {
        setError("No se pudo conectar al servidor. Verificá que el backend esté corriendo en el puerto 3001.");
      } else {
        setError(err.message || "Error al iniciar sesión");
      }
    }
  };

  return (
    <View className="flex-1 bg-background px-6 pt-20">
      <View className="items-center mb-10">
        <View className="w-20 h-20 rounded-2xl bg-primary items-center justify-center mb-4">
          <Wallet size={36} color="#fff" />
        </View>
        <Text className="text-3xl font-bold text-textPrimary">Gastito</Text>
        <Text className="text-textSecondary text-base mt-1">
          Controlá tus finanzas
        </Text>
      </View>

      <View className="mb-6">
        <Input
          control={control}
          name="email"
          placeholder="usuario@email.com"
          label="Correo electrónico"
          keyboardType="email-address"
          error={errors.email?.message}
        />

        <Input
          control={control}
          name="password"
          placeholder="••••••"
          label="Contraseña"
          secureTextEntry
          error={errors.password?.message}
        />
      </View>

      <TouchableOpacity
        onPress={() => router.push("/(auth)/forgot-password")}
        className="mb-4 items-end"
      >
        <Text className="text-primary text-sm">¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>

      {error ? (
        <Text className="text-alert text-sm mb-4 text-center">{error}</Text>
      ) : null}

      <Button
        title="Iniciar sesión"
        onPress={handleSubmit(onSubmit)}
        loading={isLoading}
        size="lg"
      />

      <TouchableOpacity
        onPress={() => router.push("/(auth)/register")}
        className="mt-6 items-center min-h-[48px] justify-center"
      >
        <Text className="text-textSecondary">
          ¿No tenés cuenta?{" "}
          <Text className="text-primary font-medium">Registrate</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}
