import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useDispatch, useSelector } from "react-redux";
import { deleteToken, select_token } from "../redux_utils/features/token";
import AuthRoute from "./AuthRoute";
import MainRoute from "./MainRoute";
import { select_screen, setScreen } from "../redux_utils/features/screen";
import { useGet_userMutation } from "../redux_utils/api_slice";
import { setUser } from "../redux_utils/features/user";
import { DummyComp } from "../components/DummyComp";
import { jwtDecode } from "jwt-decode";

const EntryRoute = () => {
  const Stack = createNativeStackNavigator();

  // redux
  const user_token = useSelector(select_token);
  const screen = useSelector(select_screen);
  const dispatch = useDispatch();

  // api hooks
  const [get_user] = useGet_userMutation();

  // effects

  useEffect(() => {
    (async () => {
      try {
        if (user_token == null) {
          // go to auth screen
          dispatch(setScreen("auth"));
          return;
        }
        // get user profile with decoded id
        const userRes = await get_user(
          jwtDecode<Decoded>(user_token)._id
        ).unwrap();
        console.log(userRes);
        // save user profile
        dispatch(setUser(userRes.results));
        // take user to home
        dispatch(setScreen("home"));
      } catch (err) {
        console.log(err);
        // clear token and go to auth screen
        dispatch(deleteToken(null));
        dispatch(setScreen("auth"));
      }
    })();
  }, []);
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {screen == "auth" && (
        <Stack.Screen component={AuthRoute} name="auth_route" />
      )}
      {screen == "home" && (
        <Stack.Screen component={MainRoute} name="main_route" />
      )}
      {screen == null && (
        <Stack.Screen component={DummyComp} name="dummy_screen" />
      )}
    </Stack.Navigator>
  );
};

export default EntryRoute;

const styles = StyleSheet.create({});
