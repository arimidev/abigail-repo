import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import _styles from "../../utils/_styles";
import { CommentBtn, LikeBtn, SaveBtn } from "./ActionBtns";
import useLikeCommentFunction from "../../hooks/useLikeComment";
import useSaveCommentFunction from "../../hooks/useSaveComment";

export const CommentActionBtns = ({ item }: { item: CommentProps }) => {
  //   const { likePost } = useLikePostFunction();
  //   const { savePost } = useSavePostFunction();
  const { likeComment } = useLikeCommentFunction();
  const { saveComment } = useSaveCommentFunction();

  // functions

  async function likePostHere() {
    const result = await likeComment({ comment: item });
  }
  async function savePostHere() {
    const result = await saveComment({ comment: item });
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
