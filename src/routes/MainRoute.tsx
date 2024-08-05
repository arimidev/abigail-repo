import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabRoute from "./TabRoute";
import { ProfileMenu } from "../screens/profile_section/ProfileMenu";
import { PersonalDetails } from "../screens/profile_section/PersonalDetails";
import { UserProfile } from "../screens/general-screens/UserProfile";
import { PostDetails } from "../screens/general-screens/PostDetails";
import { CommentPage } from "../screens/general-screens/CommentPage";
import { ProductDetails } from "../screens/general-screens/ProductDetails";

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
      <Stack.Group screenOptions={{ animation: "slide_from_right" }}>
        <Stack.Screen component={UserProfile} name="user_profile" />
        <Stack.Screen
          component={PostDetails}
          name="post_details"
          options={{ headerShown: true, title: "Post" }}
        />
        <Stack.Screen
          component={CommentPage}
          name="comment_page"
          options={{ headerShown: true, title: "Comment" }}
        />
        <Stack.Screen
          component={ProductDetails}
          name="product_details"
          options={{ headerShown: true, title: "Product" }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default MainRoute;

const styles = StyleSheet.create({});
