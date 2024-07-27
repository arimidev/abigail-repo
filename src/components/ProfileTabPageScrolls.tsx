import { StyleSheet, Text, View } from "react-native";
import React from "react";
import spacing from "../utils/spacing";
import { UserPostsTabView } from "./UserPostsTabView";

interface Props {
  post_type: "post" | "reels" | "repost" | "products";
  user: UserProps;
  data: Array<UserPostProps>;
  error: boolean;
  loading: boolean;
  on_press_refrech: any;
}

export const PostsDataComp = ({
  post_type,
  user,
  data,
  error,
  loading,
  on_press_refrech,
}: Props) => {
  if (post_type == "post") {
    return (
      // <View
      //   style={{
      //     width: spacing.window_width,
      //     height: spacing.window_height + 50,
      //     backgroundColor: "red",
      //   }}
      // />
      <UserPostsTabView
        user={user}
        on_press_refetch={on_press_refrech}
        loading={loading}
        error={error}
        data={data}
      />
    );
  }
  if (post_type == "reels") {
    return (
      <View
        style={{
          width: spacing.window_width,
          // height: spacing.window_height - 90,
          backgroundColor: "blue",
        }}
      />
    );
  }
  if (post_type == "repost") {
    return (
      <View
        style={{
          width: spacing.window_width,
          // height: spacing.window_height - 90,
          backgroundColor: "purple",
        }}
      />
    );
  }
  return (
    <View
      style={{
        width: spacing.window_width,
        // height: spacing.window_height - 90,
        backgroundColor: "yellow",
      }}
    />
  );
};

const styles = StyleSheet.create({});
