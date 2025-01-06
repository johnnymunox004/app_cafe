import React from "react";
import { Tabs } from "expo-router";
import TabBar from "../components/TabBar";
import { View, SafeAreaView, StatusBar, Platform, Button } from "react-native";
import { useRouter } from "expo-router";
import { COLORS } from '../utils/styles';

export default function RootLayout() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar
        translucent={true}
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <Tabs 
        tabBar={(props) => <TabBar {...props} />}
        screenOptions={{
          headerStyle: {
            height: Platform.OS === 'ios' ? 90 : 50 + StatusBar.currentHeight,
          },
          headerTopInsetEnabled: false,
        }}
        screenListeners={{
          tabPress: (e) => {
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
    </View>
  );
}