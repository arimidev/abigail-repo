import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import spacing from "../utils/spacing";
import _styles from "../utils/_styles";
import { Image } from "expo-image";
import { useDispatch, useSelector } from "react-redux";
import { select_user, setUser } from "../redux_utils/features/user";
import colors from "../utils/colors";
import IonIcons from "@expo/vector-icons/Ionicons";
import { getImage, getName, showToast } from "../functions";
import { useNavigation } from "@react-navigation/native";
import { StoryRing } from "./StoryRing";
import { update_user } from "../redux_utils/features/seen_users";
import { useFollow_userMutation } from "../redux_utils/api_slice";

interface Props {
  user: UserProps;
  on_follow: any;
}

export const ProfileHeader = ({ user, on_follow }: Props) => {
  const User: UserProps = useSelector(select_user);
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();

  // api hooks
  const [follow_user] = useFollow_userMutation();

  // functions

  // follow page user ===================================================================== follow user on page localy

  function followPageUserLocally() {
    if (user.is_followed_by_user == true) {
      dispatch(
        setUser({
          ...User,
          following: User.following - 1,
        })
      );
      dispatch(
        update_user({
          ...user,
          is_followed_by_user: false,
          followers: user.followers - 1,
        })
      );
    } else {
      dispatch(
        setUser({
          ...User,
          following: User.followers + 1,
        })
      );
      dispatch(
        update_user({
          ...user,
          is_followed_by_user: true,
          followers: user.followers + 1,
        })
      );
    }
  }

  async function followOnBackend() {
    try {
      const res = await follow_user(user?._id).unwrap();
      if (res.action === "follow") {
        showToast({
          description: `You followed @${user?.username}`,
          type: "default",
          duration: 3000,
        });
      }
    } catch (err) {
      console.log(err);
      showToast({
        description: "Coundn't follow user!",
        type: "error",
        duration: 3000,
      });

      // unfollow locally ==========================
      followPageUserLocally();
    }
  }

  // follow page user on backend ======================================================  follow page user on back end

  async function followUserFunc() {
    followPageUserLocally();
    followOnBackend();
  }

  const UserRightElements = () => {
    return (
      <View style={[_styles.flex_row, { gap: 15 }]}>
        <View style={[_styles.all_center, styles.profile_header_icon_cont]}>
          <IonIcons name="search-outline" size={16} color={colors.color_2} />
        </View>
        <Pressable
          style={[_styles.all_center, styles.profile_header_icon_cont]}
          onPress={() => navigation.navigate("profile_menu")}
        >
          <IonIcons name="create-outline" size={16} color={colors.color_2} />
        </Pressable>
      </View>
    );
  };

  const Following = ({ on_follow }: { on_follow: any }) => {
    return (
      <Pressable
        onPress={followUserFunc}
        style={[
          _styles.all_center,
          styles.profile_header_icon_cont,
          { backgroundColor: colors.color_4, borderWidth: 0 },
        ]}
      >
        <IonIcons name="checkmark" size={16} color={"#fff"} />
      </Pressable>
    );
  };

  const NotFollowing = ({ on_follow }: { on_follow: any }) => {
    return (
      <Pressable
        style={[_styles.all_center, styles.profile_header_icon_cont]}
        onPress={followUserFunc}
      >
        <IonIcons name="add" size={16} color={colors.color_2} />
      </Pressable>
    );
  };

  const StrangerRightElement = ({
    user,
    on_follow,
  }: {
    user: UserProps;
    on_follow: any;
  }) => {
    return (
      <View style={[_styles.flex_row, { gap: 15 }]}>
        <View style={[_styles.all_center, styles.profile_header_icon_cont]}>
          <IonIcons name="search-outline" size={16} color={colors.color_2} />
        </View>
        {user.is_followed_by_user ? (
          <Following on_follow={on_follow} />
        ) : (
          <NotFollowing on_follow={on_follow} />
        )}
      </View>
    );
  };
  return (
    <View
      style={[
        _styles.flex_row,
        {
          marginTop: spacing.padding_top,
          paddingHorizontal: spacing.padding_horizontal,
        },
      ]}
    >
      <View style={[_styles.flex_row, { gap: 15, flex: 1 }]}>
        <StoryRing size={70}>
          <Image
            source={getImage({ uri: user?.image_url, gender: user?.gender })}
            style={styles.avatar}
          />
        </StoryRing>

        <View style={{ flex: 1 }}>
          <Text style={[_styles.font_14_bold, { color: colors.color_2 }]}>
            {getName(user?.name)}
          </Text>
          <Text style={[_styles.font_14_medium, { color: colors.color_6 }]}>
            @{user.username}
          </Text>
        </View>
      </View>
      {user._id == User._id ? (
        <UserRightElements />
      ) : (
        <StrangerRightElement user={user} on_follow={on_follow} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    height: 60,
    width: 60,
    borderRadius: 50,
  },
  profile_header_icon_cont: {
    height: 40,
    width: 40,
    borderRadius: 50,
    borderColor: "#DBDBDB",
    borderWidth: 1,
  },
  follow_btn: {
    borderRadius: 50,
    paddingHorizontal: 15,
    paddingVertical: 7,
    backgroundColor: colors.color_4,
  },
});
