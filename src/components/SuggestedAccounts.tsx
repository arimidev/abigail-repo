import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import spacing from "../utils/spacing";
import colors from "../utils/colors";
import { Image } from "expo-image";
import { getImage, getName, showToast } from "../functions";
import { StoryRing } from "./StoryRing";
import _styles from "../utils/_styles";
import IonIcons from "@expo/vector-icons/Ionicons";
import { CustomButton } from "./CustomButton";
import { useDispatch, useSelector } from "react-redux";
import { select_user, setUser } from "../redux_utils/features/user";
import { useNavigation } from "@react-navigation/native";
import { update_user } from "../redux_utils/features/seen_users";
import { useFollow_userMutation } from "../redux_utils/api_slice";

interface Props {
  data: Array<UserProps>;
  user: UserProps;
  loading: boolean;
  error: boolean;
  on_follow: (val: UserProps) => void;
}

export const SuggestedAccount = ({
  item,
  on_follow,
}: {
  item: UserProps;
  on_follow: (val: UserProps) => void;
}) => {
  // hooks
  const navigation = useNavigation<any>();

  // redux
  const User: UserProps = useSelector(select_user);
  const dispatch = useDispatch();

  // api hooks
  const [follow_user] = useFollow_userMutation();

  // functions

  // follow user suggested ========================================================== follow suggested

  function followLocally() {
    if (item.is_followed_by_user == true) {
      dispatch(
        setUser({
          ...User,
          following: User.following - 1,
        })
      );
      dispatch(
        update_user({
          ...item,
          is_followed_by_user: false,
          followers: item.followers - 1,
        })
      );
    } else {
      dispatch(
        setUser({
          ...User,
          following: User.following + 1,
        })
      );
      dispatch(
        update_user({
          ...item,
          is_followed_by_user: true,
          followers: item.followers + 1,
        })
      );
    }
  }

  // follow on backend function

  async function followOnBackend() {
    try {
      const res = await follow_user(item?._id).unwrap();
      if (res.action === "follow") {
        showToast({
          description: `You followed @${item?.username}`,
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
      // followLocally();
    }
  }

  // follow suggested on backend ============================================ follow suggested on back end

  async function followUserFunc() {
    followLocally();
    followOnBackend();
  }
  return (
    <View style={styles.account_cont}>
      <StoryRing size={70} user={item}>
        <Pressable
          onPress={() => navigation.push("user_profile", { passedData: item })}
        >
          <Image
            source={getImage({ uri: item.image_url, gender: null })}
            style={{ height: 60, width: 60, borderRadius: 100 }}
          />
        </Pressable>
      </StoryRing>
      <View style={{ marginTop: 10, alignItems: "center" }}>
        <Text
          style={[_styles.font_14_bold, { color: colors.color_2 }]}
          numberOfLines={1}
        >
          {getName(item.name)}
        </Text>
        <Text
          style={[_styles.font_12_medium, { color: colors.color_5 }]}
          numberOfLines={1}
        >
          @{item.username}
        </Text>
      </View>
      <Pressable
        style={{ position: "absolute", top: 10, right: 10 }}
        onPress={null}
      >
        <IonIcons name="close" size={20} color={colors.color_5} />
      </Pressable>
      <View>
        <CustomButton
          text={item.is_followed_by_user ? "Following" : "Follow"}
          background_color={colors.color_4}
          text_color="#fff"
          on_press={followUserFunc}
          button_style={{ height: "auto", paddingVertical: 7, marginTop: 10 }}
        />
      </View>
    </View>
  );
};

export const SuggestedAccounts = ({
  data,
  user,
  loading,
  error,
  on_follow,
}: Props) => {
  // redux
  const User: UserProps = useSelector(select_user);
  const dispatch = useDispatch();

  if (error || (data?.length < 1 && !loading)) {
    return <View />;
  }
  return (
    <View style={{ marginTop: 20, gap: 10 }}>
      <View>
        <Text
          style={[
            _styles.font_14_bold,
            {
              color: colors.color_2,
              paddingHorizontal: spacing.padding_horizontal,
            },
          ]}
        >
          Suggested Accounts
        </Text>
      </View>
      {loading ? (
        <FlatList
          data={[...Array(4)]}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.flatlist_cont}
          renderItem={({ _, index }) => (
            <View key={index} style={styles.placeholder} />
          )}
        />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item._id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.flatlist_cont}
          renderItem={(item) => (
            <SuggestedAccount {...item} on_follow={on_follow} />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  account_cont: {
    width: 170,
    height: 200,
    backgroundColor: colors.color_1,
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  flatlist_cont: {
    paddingHorizontal: spacing.padding_horizontal,
    gap: 15,

    paddingVertical: 5,
  },
  placeholder: {
    width: 170,
    height: 200,
    backgroundColor: "#ECECEC",
    borderRadius: 10,
  },
});
