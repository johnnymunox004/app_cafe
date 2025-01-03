import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

const icons = {
  index: (props) => (
    <FontAwesome5 name="home" size={24} color="black" {...props} />
  ),
  explore: (props) => (
    <FontAwesome5 name="compass" size={24} color="black" {...props} />
  ),
  "(tools)": (props) => (
    <FontAwesome5 name="tools" size={24} color="black" {...props} />
  ),
  create: (props) => (
    <FontAwesome5 name="plus" size={24} color="black" {...props} />
  ),
};

const colors = {
  primary: "#3498db",
  text: "#2c3e50",
};

const TabBar = ({ navigation, state, descriptors }) => {
  const currentRoute = state.routes[state.index].name;

  if (currentRoute === "create") {
    return null;
  }

  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        if (["_sitemap", "+not-found"].includes(route.name)) return null;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.key}
            style={styles.tabItem}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
          >
            {icons[route.name] ? (
              icons[route.name]({
                color: isFocused ? colors.primary : colors.text,
              })
            ) : (
              <Text>No icon</Text>
            )}
            <Text style={{ color: isFocused ? colors.primary : colors.text }}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    marginHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 25,
    borderCurve: "continuous",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
    shadowOpacity: 0.1,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
  },
});

export default TabBar;

