import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import _styles from "../../utils/_styles";
import { CommentBtn, LikeBtn, SaveBtn } from "./ActionBtns";

export const ProductActionBtns = ({ item }: { item: CommentProps }) => {
  //   const { likePost } = useLikePostFunction();
  //   const { savePost } = useSavePostFunction();

  // functions

  async function likePostHere() {
    // const result = await likePost({ post: item });
  }
  async function savePostHere() {
    // const result = await savePost({ post: item });
  }

  return (
    <View style={[_styles.flex_row]}>
      <View style={[_styles.flex_row, { gap: 15, flex: 1 }]}>
        <LikeBtn item={item} onPress={likePostHere} />
        <CommentBtn item={item} />
      </View>
      <SaveBtn item={item} onPress={savePostHere} />
    </View>
  );
};

const styles = StyleSheet.create({});
