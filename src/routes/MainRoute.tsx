import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabRoute from "./TabRoute";
import { ProfileMenu } from "../screens/profile_section/ProfileMenu";
import { PersonalDetails } from "../screens/profile_section/PersonalDetails";
import { UserProfile } from "../screens/general-screens/UserProfile";

const MainRoute = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen component={TabRoute} name="tab_route" />
      <Stack.Group>
        <Stack.Screen
          component={ProfileMenu}
          name="profile_menu"
          options={{ animation: "slide_from_bottom" }}
        />
        <Stack.Screen
          component={PersonalDetails}
          name="personal_details"
          options={{ animation: "slide_from_bottom" }}
        />
      </Stack.Group>
      <Stack.Group>
        <Stack.Screen component={UserProfile} name="user_profile" />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default MainRoute;

const styles = StyleSheet.create({});
