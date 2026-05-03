import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../../contexts/AuthContext";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

const registerSchema = z.object({
  name: z.string().min(2, "Ingresá tu nombre"),
  email: z.string().email("Ingresá un correo válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
  const [error, setError] = useState("");
  const router = useRouter();
  const { register, isLoading } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    mode: 'onSubmit',
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      setError("");
      await register({ name: data.name, email: data.email, password: data.password });
      router.replace("/(app)");
    } catch (err: any) {
      console.error("Register error:", err);
      if (err.message?.includes("Network request failed") || err.message?.includes("fetch")) {
        setError("No se pudo conectar al servidor. Verificá que el backend esté corriendo en el puerto 3001.");
      } else {
        setError(err.message || "Error al registrarse");
      }
    }
  };

  return (
    <View className="flex-1 bg-background px-6 pt-20">
      <Text className="text-3xl font-bold text-textPrimary mb-8">
        Crear cuenta
      </Text>

      <View className="mb-6">
        <Input
          control={control}
          name="name"
          placeholder="Tu nombre"
          label="Nombre"
        />

        <Input
          control={control}
          name="email"
          placeholder="usuario@email.com"
          label="Correo"
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

      {error ? (
        <Text className="text-alert text-sm mb-4 text-center">{error}</Text>
      ) : null}

      <Button
        title="Registrarse"
        onPress={handleSubmit(onSubmit)}
        size="lg"
        loading={isLoading}
      />

      <TouchableOpacity
        onPress={() => router.push("/(auth)/login")}
        className="mt-6 items-center"
      >
        <Text className="text-textSecondary">
          ¿Ya tenés cuenta?{" "}
          <Text className="text-primary font-medium">Iniciá sesión</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}
