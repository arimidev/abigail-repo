import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Home } from "../screens/bottom_tabs/Home";
import { Chats } from "../screens/bottom_tabs/Chats";
import _styles from "../utils/_styles";
import spacing from "../utils/spacing";
import colors from "../utils/colors";
import IonIcons from "@expo/vector-icons/Ionicons";
import { Profile } from "../screens/bottom_tabs/Profile";
import { Search } from "../screens/bottom_tabs/Search";

function MyTabBar({ state, descriptors, navigation }) {
  return (
    <View style={[_styles.flex_row, styles.tabs_cont]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = route.name;

        const isFocused = state.index === index;
        const color = isFocused ? "#141414" : "#717171";
        const size = 18;
        let component;

        switch (label) {
          case "home":
            component = (
              <IonIcons
                name={isFocused ? "home" : "home-outline"}
                size={size}
                color={color}
              />
            );
            break;
          case "chats":
            component = (
              <IonIcons
                name={isFocused ? "chatbubbles" : "chatbubbles-outline"}
                size={size}
                color={color}
              />
            );
            break;
          case "search":
            component = (
              <IonIcons
                name={isFocused ? "search" : "search-outline"}
                size={size}
                color={color}
              />
            );
            break;
          case "profile":
            component = (
              <IonIcons
                name={isFocused ? "person" : "person-outline"}
                size={size}
                color={color}
              />
            );
        }

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
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={[_styles.all_center, { flex: 1 }]}
            key={index}
          >
            {component}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const Tab = createBottomTabNavigator();
const TabRoute = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <MyTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen component={Home} name="home" />
      <Tab.Screen component={Chats} name="chats" />
      <Tab.Screen component={Search} name="search" />
      <Tab.Screen component={Profile} name="profile" />
    </Tab.Navigator>
  );
};

export default TabRoute;

const styles = StyleSheet.create({
  tabs_cont: {
    height: 50,
    width: spacing.window_width,
    backgroundColor: colors.color_1,
    // paddingHorizontal: spacing.padding_horizontal,
  },
});
