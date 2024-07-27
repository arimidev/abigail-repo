import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { MainContainer } from "../../components/MainContainer";
import colors from "../../utils/colors";
import { AuthHeaderImage } from "../../components/AuthHeaderImage";
import spacing from "../../utils/spacing";
import { CustomInput } from "../../components/CustomInput";
import { CustomButton } from "../../components/CustomButton";
import { AuthFooter } from "../../components/AuthFooter";
import { useCheck_usernameMutation } from "../../redux_utils/api_slice";
import { showToast } from "../../functions";
import regex from "../../utils/regex";

export const Username = ({ navigation }: any) => {
  const [username, set_username] = useState("");
  const [username_err, setusername_err] = useState(false);

  // regex

  const { username_regex } = regex;

  // api hooks

  const [check_username, { isLoading: username_loading }] =
    useCheck_usernameMutation();

  // functions

  async function checkUsername() {
    setusername_err(!username_regex.test(username));
    if (!username_regex.test(username)) {
      console.log("invalid username");
      return;
    }
    try {
      const usernameRes = await check_username({ username }).unwrap();
      console.log(usernameRes);
      navigation.navigate("sign_up", { username });
    } catch (err) {
      console.log(err);
      showToast({
        description: "Username already exists!!",
        type: "error",
        duration: 3000,
      });
    }
  }
  return (
    <MainContainer>
      <View style={{ backgroundColor: colors.color_1, flex: 1 }}>
        <ScrollView>
          <View style={{ height: spacing.window_height * 0.9 }}>
            <AuthHeaderImage title="Username" />
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
              <CustomButton
                text="Continue"
                text_color="#fff"
                background_color={colors.color_4}
                on_press={checkUsername}
                loading={username_loading}
                disabled={username_loading || username == ""}
              />
            </View>
          </View>
          <AuthFooter
            normal_text="Already have an account?"
            button_text="Sign In"
            on_button_press={() => navigation.navigate("login")}
          />
        </ScrollView>
      </View>
    </MainContainer>
  );
};

const styles = StyleSheet.create({});
