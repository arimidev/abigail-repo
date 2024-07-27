import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { MainContainer } from "../../components/MainContainer";
import colors from "../../utils/colors";
import { AuthHeaderImage } from "../../components/AuthHeaderImage";
import spacing from "../../utils/spacing";
import { AuthFooter } from "../../components/AuthFooter";
import { CustomInput } from "../../components/CustomInput";
import { CustomButton } from "../../components/CustomButton";
import { useSign_upMutation } from "../../redux_utils/api_slice";
import { showToast } from "../../functions";
import regex from "../../utils/regex";
import { useDispatch } from "react-redux";
import { setTemporaryToken } from "../../redux_utils/features/temporary_token";

export const SignUp = ({ route, navigation }) => {
  // states

  const [email, set_emai] = useState("");
  const [password, set_password] = useState("");
  const [pass_err, set_passs_err] = useState(false);
  const [email_err, set_email_err] = useState(false);

  // redux
  const dispatch = useDispatch();

  //
  const { username } = route.params;

  // regex

  const { email_regex, password_regex } = regex;

  // api hooks

  const [sign_up, { isLoading: sign_up_loading }] = useSign_upMutation();

  // function

  async function register() {
    set_email_err(!email_regex.test(email));

    if (!email_regex.test(email)) {
      return;
    }
    set_passs_err(!password_regex.test(password));
    if (!password_regex.test(password)) {
      return;
    }
    try {
      const signInRes = await sign_up({ username, password, email }).unwrap();
      dispatch(setTemporaryToken(signInRes.token));
      showToast({
        description: "Sign up successful",
        type: "success",
        duration: 3000,
      });
      navigation.navigate("auth_avatar_screen");
    } catch (err) {
      console.log(err);
      showToast({
        description: "Sign Up Error!",
        type: "error",
        duration: 3000,
      });
    }
  }
  return (
    <MainContainer>
      <View style={{ flex: 1, backgroundColor: colors.color_1 }}>
        <ScrollView>
          <View style={{ height: spacing.window_height * 0.9 }}>
            <AuthHeaderImage title="Sign Up" />
            <View
              style={{
                paddingHorizontal: spacing.padding_horizontal,
                marginTop: 30,
                gap: 20,
              }}
            >
              <CustomInput
                place_holder="Email"
                on_change_text={set_emai}
                keyboard_type="email-address"
                error={email_err}
                error_message="Please enter a valid email address."
              />
              <CustomInput
                place_holder="Password"
                on_change_text={set_password}
                error={pass_err}
                error_message="Password must contain at least a number and a letter, and must be 6 characters long."
              />
              <CustomButton
                text="Register"
                text_color="#fff"
                background_color={colors.color_4}
                on_press={register}
                loading={sign_up_loading}
                disabled={sign_up_loading || email == "" || password == ""}
              />
            </View>
          </View>
          <AuthFooter
            normal_text="By signing up, you agree to our"
            button_text="terms & conditions"
            on_button_press={null}
          />
        </ScrollView>
      </View>
    </MainContainer>
  );
};

const styles = StyleSheet.create({});
