import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import useLikePostFunction from "../../hooks/useLikePostFunction";
import useSavePostFunction from "../../hooks/useSavePostFunction";
import _styles from "../../utils/_styles";
import spacing from "../../utils/spacing";
import colors from "../../utils/colors";
import IonIcons from "@expo/vector-icons/Ionicons";
import { CommentBtn, LikeBtn, RepostBtn, SaveBtn } from "./ActionBtns";

export const PostActionBtns = ({ item }: { item: UserPostProps }) => {
  const { likePost } = useLikePostFunction();
  const { savePost } = useSavePostFunction();

  // functions

  async function likePostHere() {
    const result = await likePost({ post: item, type: "post" });
  }
  async function savePostHere() {
    const result = await savePost({ post: item, type: "post" });
  }

  return (
    <View
      style={[
        _styles.flex_row,
        { paddingHorizontal: spacing.padding_horizontal },
      ]}
    >
      <View style={[_styles.flex_row, { gap: 15, flex: 1 }]}>
        <LikeBtn item={item} onPress={likePostHere} />
        <CommentBtn item={item} />
        <RepostBtn item={item} onPress={null} />
      </View>
      <SaveBtn item={item} onPress={savePostHere} />
    </View>
  );
};

const styles = StyleSheet.create({});
