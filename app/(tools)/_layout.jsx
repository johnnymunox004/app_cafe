import { Stack } from 'expo-router';
import { COLORS } from '../../utils/styles';

export default function ToolsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTintColor: COLORS.white,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Herramientas",
        }}
      />
      <Stack.Screen
        name="create"
        options={{
          title: "Crear Registro",
        }}
      />
      <Stack.Screen
        name="scanner"
        options={{
          title: "Escáner de Café",
        }}
      />
      <Stack.Screen
        name="map"
        options={{
          title: "Mapa de Cafeterías",
        }}
      />
    </Stack>
  );
} 