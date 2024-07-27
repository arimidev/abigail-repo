import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useRef } from "react";
import { MainContainer } from "../../components/MainContainer";
import colors from "../../utils/colors";
import { useDispatch, useSelector } from "react-redux";
import { select_user, setUser } from "../../redux_utils/features/user";
import { ProfileHeader } from "../../components/ProfileHeader";
import _styles from "../../utils/_styles";
import { PressableLeftIcon } from "../../components/PressableLeftIcon";
import { deleteToken, setToken } from "../../redux_utils/features/token";
import { setScreen } from "../../redux_utils/features/screen";
import {
  delete_saved_token,
  select_saved_tokens,
} from "../../redux_utils/features/saved_tokens";
import { BottonSheetOptions } from "../../components/BottonSheetOptions";
import { getImage, getSavedAccount, showToast } from "../../functions";
import { Image } from "expo-image";
import { LoadingModal } from "../../components/LoadingModal";
import {
  useGet_userMutation,
  useLogin_userMutation,
} from "../../redux_utils/api_slice";
import images from "../../utils/images";

export const ProfileMenu = ({ navigation }) => {
  const User: UserProps = useSelector(select_user);
  const dispatch = useDispatch();
  const saved_accounts = useSelector(select_saved_tokens);

  // api hook

  const [login_user, { isLoading: login_loading }] = useLogin_userMutation();
  const [get_user, { isLoading: user_loading }] = useGet_userMutation();

  // refs

  const accountsRef = useRef();

  // functions

  async function LoginUser({ username, password, token }) {
    try {
      const res = await login_user({ username, password }).unwrap();
      dispatch(setToken(res.token));
      const userRes = await get_user({}).unwrap();
      dispatch(setUser(userRes));
      showToast({
        description: "successfully switched accounts.",
        type: "success",
        duration: 3000,
      });
    } catch (err) {
      console.log(err);
      dispatch(delete_saved_token(token));
      showToast({
        description: "Error switching account",
        type: "error",
        duration: 3000,
      });
    }
  }
  return (
    <MainContainer>
      <View style={{ flex: 1, backgroundColor: colors.color_1 }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
          <ProfileHeader user={User} />
          <View style={{ marginTop: 40 }}>
            <PressableLeftIcon
              title="Personal details"
              left_component={
                <Image
                  source={images.personal_details}
                  style={styles.icon_image}
                />
              }
              on_press={() => navigation.navigate("personal_details")}
            />
            <PressableLeftIcon
              title="Saved"
              left_component={
                <Image source={images.save_icon} style={styles.icon_image} />
              }
              on_press={null}
            />
            <PressableLeftIcon
              title="Suggestions"
              left_component={
                <Image
                  source={images.suggestions_icon}
                  style={styles.icon_image}
                />
              }
              on_press={null}
            />
            <PressableLeftIcon
              title="Archive"
              left_component={
                <Image source={images.archive_icon} style={styles.icon_image} />
              }
              on_press={null}
            />
            <PressableLeftIcon
              title="Password & security"
              left_component={
                <Image
                  source={images.password_icon}
                  style={styles.icon_image}
                />
              }
              on_press={null}
            />
            <PressableLeftIcon
              title="Preferences"
              left_component={
                <Image
                  source={images.preferences_icon}
                  style={styles.icon_image}
                />
              }
              on_press={null}
            />
            <PressableLeftIcon
              title="Account & privacy"
              left_component={
                <Image source={images.privacy_icon} style={styles.icon_image} />
              }
              on_press={null}
            />
            <PressableLeftIcon
              title="Go premium"
              left_component={
                <Image source={images.premium_icon} style={styles.icon_image} />
              }
              on_press={null}
            />
            <PressableLeftIcon
              title="Contact & support"
              left_component={
                <Image source={images.clock_icon} style={styles.icon_image} />
              }
              on_press={null}
            />
            {/* {saved_accounts?.length > 1 && (
              <PressableLeftIcon
                title="Switch account"
                left_component={
                  <Image
                    source={images.switch_icon}
                    style={styles.icon_image}
                  />
                }
                on_press={() => {
                  accountsRef.current?.expand();
                }}
              />
            )} */}
            <PressableLeftIcon
              title="Logout"
              left_component={
                <Image source={images.logout_icon} style={styles.icon_image} />
              }
              on_press={() => {
                // for now
                dispatch(deleteToken(null));
                dispatch(setScreen("auth"));
              }}
            />
          </View>
        </ScrollView>
        <BottonSheetOptions ref={accountsRef} height={["40%"]}>
          <View>
            {saved_accounts.map((item, index) => (
              <PressableLeftIcon
                key={index}
                title={getSavedAccount(item)?.username}
                left_component={
                  <Image
                    style={styles.saved_account_image}
                    source={getImage({
                      uri: getSavedAccount(item)?.image_url,
                      gender: null,
                    })}
                  />
                }
                on_press={() => {
                  LoginUser({
                    username: getSavedAccount(item)?.username,
                    password: getSavedAccount(item)?.password,
                    token: item,
                  });
                }}
              />
            ))}
          </View>
        </BottonSheetOptions>
        <LoadingModal loading={login_loading || user_loading} />
      </View>
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  saved_account_image: {
    height: 20,
    width: 20,
    borderRadius: 50,
  },
  icon_image: {
    height: 20,
    width: 20,
  },
});
