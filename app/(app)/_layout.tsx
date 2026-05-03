import React from "react";
import { Tabs, useRouter } from "expo-router";
import { View, TouchableOpacity, Text } from "react-native";
import * as LucideIcons from "lucide-react-native";

function CustomTabBar({ state, descriptors, navigation }: any) {
  const router = useRouter();
  
  return (
    <View className="flex-row bg-white border-t border-gray-200" style={{ paddingBottom: 8, paddingTop: 8 }}>
      {/* Inicio */}
      <TouchableOpacity
        className="flex-1 items-center justify-center"
        onPress={() => navigation.navigate("index")}
      >
        <LucideIcons.Home 
          size={24} 
          color={state.index === 0 ? "#8B5CF6" : "#6B7280"} 
        />
        <Text className={`text-xs mt-1 ${state.index === 0 ? 'text-primary' : 'text-gray-500'}`}>
          Inicio
        </Text>
      </TouchableOpacity>

      {/* Gastos */}
      <TouchableOpacity
        className="flex-1 items-center justify-center"
        onPress={() => navigation.navigate("expenses/index")}
      >
        <LucideIcons.Receipt 
          size={24} 
          color={state.index === 1 ? "#8B5CF6" : "#6B7280"} 
        />
        <Text className={`text-xs mt-1 ${state.index === 1 ? 'text-primary' : 'text-gray-500'}`}>
          Gastos
        </Text>
      </TouchableOpacity>

      {/* Botón Central Agregar */}
      <View className="flex-1 items-center justify-center">
        <TouchableOpacity
          onPress={() => router.push("/(app)/expenses/add")}
          className="w-14 h-14 rounded-full bg-primary items-center justify-center"
          style={{ marginTop: -20, elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84 }}
        >
          <LucideIcons.Plus size={28} color="white" />
        </TouchableOpacity>
      </View>

      {/* Ahorros */}
      <TouchableOpacity
        className="flex-1 items-center justify-center"
        onPress={() => navigation.navigate("savings/index")}
      >
        <LucideIcons.PiggyBank 
          size={24} 
          color={state.index === 2 ? "#8B5CF6" : "#6B7280"} 
        />
        <Text className={`text-xs mt-1 ${state.index === 2 ? 'text-primary' : 'text-gray-500'}`}>
          Ahorros
        </Text>
      </TouchableOpacity>

      {/* Ajustes */}
      <TouchableOpacity
        className="flex-1 items-center justify-center"
        onPress={() => navigation.navigate("settings/index")}
      >
        <LucideIcons.Settings 
          size={24} 
          color={state.index === 3 ? "#8B5CF6" : "#6B7280"} 
        />
        <Text className={`text-xs mt-1 ${state.index === 3 ? 'text-primary' : 'text-gray-500'}`}>
          Ajustes
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' }, // Hide default tab bar
      }}
      tabBar={props => <CustomTabBar {...props} />}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="expenses/index" />
      <Tabs.Screen name="savings/index" />
      <Tabs.Screen name="settings/index" />
    </Tabs>
  );
}
