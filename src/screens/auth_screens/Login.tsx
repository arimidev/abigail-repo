import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import _styles from "../../utils/_styles";
import colors from "../../utils/colors";
import { AuthHeaderImage } from "../../components/AuthHeaderImage";
import { CustomInput } from "../../components/CustomInput";
import spacing from "../../utils/spacing";
import { CustomButton } from "../../components/CustomButton";
import {
  useGet_userMutation,
  useLogin_userMutation,
  useUpdate_profileMutation,
} from "../../redux_utils/api_slice";
import { MainContainer } from "../../components/MainContainer";
import { AuthFooter } from "../../components/AuthFooter";
import { showToast } from "../../functions";
import regex from "../../utils/regex";
import { useDispatch, useSelector } from "react-redux";
import { select_token, setToken } from "../../redux_utils/features/token";
import { setUser } from "../../redux_utils/features/user";
import { setScreen } from "../../redux_utils/features/screen";
import {
  delete_saved_token,
  select_saved_tokens,
  update_saved_tokens,
} from "../../redux_utils/features/saved_tokens";
import { jwtDecode } from "jwt-decode";
import * as Location from "expo-location";

export const Login = ({ navigation }: any) => {
  // states
  const [username, set_username] = useState("");
  const [password, set_password] = useState("");
  const [username_err, setusername_err] = useState(false);
  const [location_loading, set_location_loading] = useState(false);

  // redux
  const dispatch = useDispatch();
  const saved_accounts = useSelector(select_saved_tokens);
  const user_token = useSelector(select_token);

  // api hooks
  const [login_user, { isLoading: login_loading }] = useLogin_userMutation();
  const [get_user, { isLoading: user_loading }] = useGet_userMutation();
  const [update_proile, { isLoading: updating }] = useUpdate_profileMutation();

  // regex

  const { username_regex, password_regex } = regex;

  // functions

  async function loginUser() {
    setusername_err(!username_regex.test(username));
    if (!username_regex.test(username)) {
      console.log("invalid username");
      return;
    }
    try {
      // login the user first
      const loginRes = await login_user({ username, password }).unwrap();
      // save token
      dispatch(setToken(loginRes.token));
      // get user's location
      // set_location_loading(true);
      // let { status } = await Location.requestForegroundPermissionsAsync();
      // if user granted location
      // if (status == "granted") {
      //   const decoded: Decoded = jwtDecode(loginRes.token);
      //   let location = await Location.getCurrentPositionAsync({});
      //   set_location_loading(false);
      //   // update user's location in db
      //   await update_proile({
      //     id: decoded._id,
      //     body: {
      //       location: {
      //         longitude: location.coords.longitude,
      //         latitude: location.coords.latitude,
      //       },
      //       username,
      //     },
      //   }).unwrap();
      // }
      // get user profile
      const userRes = await get_user(
        jwtDecode<Decoded>(loginRes.token)._id
      ).unwrap();
      // temporarily save user
      dispatch(setUser(userRes.results));
      // // add this token to saved tokens for multiple accounts - if user agrees
      // saved_accounts?.map((item) => {
      //   const decoded: Decoded = jwtDecode(item);
      //   // check if this user's token was previously saved
      //   if (decoded.username == userRes?.username) {
      //     // delet the token
      //     dispatch(delete_saved_token(item));
      //   }
      // });
      // // save new token
      // dispatch(update_saved_tokens(loginRes.token));

      // go to home
      dispatch(setScreen("home"));
    } catch (err) {
      console.log(err);
      showToast({
        description: "Login Error!",
        type: "error",
        duration: 3000,
      });
    }
  }
  return (
    <MainContainer>
      <View style={[_styles.flex_1, { backgroundColor: colors.color_1 }]}>
        <ScrollView>
          <View style={{ height: spacing.window_height * 0.9 }}>
            <AuthHeaderImage title="Login" />
            <View
              style={{
                paddingHorizontal: spacing.padding_horizontal,
                marginTop: 30,
                gap: 20,
              }}
            >
              <CustomInput
                place_holder="Username"
                on_change_text={set_username}
                error={username_err}
                error_message="Username can only contain letters, numbers, and underscores."
              />
              <CustomInput
                place_holder="Password"
                on_change_text={set_password}
              />
              <Pressable style={{ alignItems: "flex-end" }}>
                <Text style={[_styles.font_12_bold, { color: colors.color_4 }]}>
                  Forgot password?
                </Text>
              </Pressable>
              <View>
                <CustomButton
                  text="Login"
                  text_color="#fff"
                  background_color={colors.color_4}
                  on_press={loginUser}
                  loading={login_loading || user_loading}
                  disabled={
                    login_loading ||
                    username == "" ||
                    password == "" ||
                    user_loading ||
                    updating ||
                    location_loading
                  }
                />
              </View>
            </View>
          </View>

          <AuthFooter
            normal_text=" New to Abigail?"
            button_text="Register"
            on_button_press={() => navigation.navigate("user_name")}
          />
        </ScrollView>
      </View>
    </MainContainer>
  );
};

const styles = StyleSheet.create({});
