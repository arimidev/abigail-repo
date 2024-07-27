import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Login } from "../screens/auth_screens/Login";
import { SignUp } from "../screens/auth_screens/SignUp";
import { Username } from "../screens/auth_screens/Username";
import { ProfileImage } from "../screens/auth_screens/ProfileImage";

const AuthRoute = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, animation: "slide_from_right" }}
    >
      <Stack.Screen component={Login} name="login" />
      <Stack.Screen component={SignUp} name="sign_up" />
      <Stack.Screen component={Username} name="user_name" />
      <Stack.Screen component={ProfileImage} name="auth_avatar_screen" />
    </Stack.Navigator>
  );
};

export default AuthRoute;

const styles = StyleSheet.create({});
