import { Stack } from "expo-router";

export default function ToolsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Herramientas",
          headerStyle: { backgroundColor: "#42A5F5" },
          headerTintColor: "#FFF",
        }}
      />
      <Stack.Screen
        name="calculator"
        options={{
          title: "Calculadora",
          headerStyle: { backgroundColor: "#4CAF50" },
          headerTintColor: "#FFF",
        }}
      />
      <Stack.Screen
        name="scanner"
        options={{
          title: "Escáner",
          headerStyle: { backgroundColor: "#9C27B0" },
          headerTintColor: "#FFF",
        }}
      />
      <Stack.Screen
        name="history"
        options={{
          title: "Historial",
          headerStyle: { backgroundColor: "#2196F3" },
          headerTintColor: "#FFF",
        }}
      />
      <Stack.Screen
        name="map"
        options={{
          title: "Cafeterías",
          headerStyle: { backgroundColor: "#795548" },
          headerTintColor: "#FFF",
        }}
      />
    </Stack>
  );
} 