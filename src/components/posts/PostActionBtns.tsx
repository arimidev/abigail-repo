import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import useLikePostFunction from "../../hooks/useLikePostFunction";
import useSavePostFunction from "../../hooks/useSavePostFunction";
import _styles from "../../utils/_styles";
import spacing from "../../utils/spacing";
import colors from "../../utils/colors";
import IonIcons from "@expo/vector-icons/Ionicons";

export const PostActionBtns = ({ item }: { item: UserPostProps }) => {
  const { likePost } = useLikePostFunction();
  const { savePost } = useSavePostFunction();

  // functions

  async function likePostHere() {
    const result = await likePost({ post: item });
  }
  async function savePostHere() {
    const result = await savePost({ post: item });
  }

  return (
    <View
      style={[
        _styles.flex_row,
        { paddingHorizontal: spacing.padding_horizontal },
      ]}
    >
      <View style={[_styles.flex_row, { gap: 15, flex: 1 }]}>
        <Pressable
          onPress={() => {
            likePostHere();
          }}
        >
          <IonIcons
            name={item.is_liked_by_user == true ? "heart" : "heart-outline"}
            size={18}
            color={item.is_liked_by_user == true ? "#FF6E6E" : colors.color_5}
          />
        </Pressable>
        <Text style={[_styles.font_12_semi_bold, { color: colors.color_2 }]}>
          {item.likes}
        </Text>
        <Pressable>
          <IonIcons name="chatbox-outline" size={18} color={colors.color_5} />
        </Pressable>
        <Text style={[_styles.font_12_semi_bold, { color: colors.color_2 }]}>
          {item.comments}
        </Text>
        <Pressable>
          <IonIcons
            name="repeat"
            size={22}
            color={item.is_reposted_by_user ? "#87B66A" : colors.color_5}
          />
        </Pressable>
        <Text style={[_styles.font_12_semi_bold, { color: colors.color_2 }]}>
          {item.reposts}
        </Text>
      </View>
      <View style={[_styles.flex_row, { gap: 15 }]}>
        <Pressable onPress={savePostHere}>
          <IonIcons
            name={item.is_saved_by_user ? "bookmark" : "bookmark-outline"}
            size={18}
            color={item.is_saved_by_user ? "#171717" : colors.color_5}
          />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});
