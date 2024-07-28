import { Pressable, StyleSheet, View } from "react-native";
import React from "react";
import spacing from "../utils/spacing";
import _styles from "../utils/_styles";
import { useNavigation } from "@react-navigation/native";
import { PostHeader } from "./posts/PostHeader";
import { PostText } from "./posts/PostText";
import { PostMedias } from "./posts/PostMedias";
import { PostActionBtns } from "./posts/PostActionBtns";

const UserRepostComp = ({ item }: { item: UserPostProps }) => {
  return (
    <View style={{ gap: 10 }}>
      <PostHeader item={item} />
      {item.post_text && <PostText item={item} />}
      {item.medias?.length > 0 && <PostMedias item={item} />}
      <View
        style={[
          _styles.flex_row,
          { gap: 10, paddingLeft: spacing.padding_horizontal },
        ]}
      >
        <View style={styles.repost_separator} />
        <View style={{ gap: 10, flex: 1 }}>
          <PostHeader item={item.post} type="reposted" />
          {item.post.post_text && <PostText item={item.post} type="reposted" />}
          {item.post.medias?.length > 0 && (
            <PostMedias item={item.post} type="reposted" />
          )}
        </View>
      </View>
      <PostActionBtns item={item} />
    </View>
  );
};

export const UserPostComp = ({ item }: { item: UserPostProps }) => {
  const navigation = useNavigation<any>();
  return (
    <Pressable
      onPress={() => navigation.navigate("post_details", { passedData: item })}
      style={({ pressed }) => [
        {
          gap: 10,
          backgroundColor: pressed ? "rgba(0,0,0,0.04)" : "transparent",
          paddingVertical: 10,
        },
      ]}
      unstable_pressDelay={2000}
    >
      {item.type == "repost" && item.post && <UserRepostComp item={item} />}
      {item.type == "post" && (
        <>
          <PostHeader item={item} />
          {item.post_text && <PostText item={item} />}
          {item.medias?.length > 0 && <PostMedias item={item} />}
          <PostActionBtns item={item} />
        </>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  repost_separator: {
    height: "90%",
    width: 1.5,
    backgroundColor: "#D7D7D7",
    left: 10,
  },
});
