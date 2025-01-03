import React from "react";
import { Tabs } from "expo-router";
import TabBar from "../components/TabBar";
import { Button } from "react-native";
import { useRouter } from "expo-router";

export default function RootLayout() {
  const router = useRouter();

  return (
    <Tabs 
      tabBar={(props) => <TabBar {...props} />}
      screenListeners={{
        tabPress: (e) => {
          // Si se presiona la pestaña tools, redirige a la página principal de tools
          if (e.target?.includes('(tools)')) {
            e.preventDefault();
            router.push('/(tools)');
          }
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerStyle: { backgroundColor: "#FFEE58" },
          headerTintColor: "#000",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          headerStyle: { backgroundColor: "#FF7043" },
          headerTintColor: "#FFF",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      />
      <Tabs.Screen
        name="(tools)"
        options={{
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="create"
        options={({ navigation }) => ({
          title: "Create",
          tabBarStyle: { display: "none" },
          headerLeft: () => (
            <Button
              title="Back"
              onPress={() => navigation.goBack()}
            />
          ),
        })}
      />
    </Tabs>
  );
}