import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { PostHeader } from "./PostHeader";
import { PostMedias } from "./PostMedias";
import { PostText } from "./PostText";
import spacing from "../../utils/spacing";
import _styles from "../../utils/_styles";
import { PostActionBtns } from "./PostActionBtns";
import { useNavigation } from "@react-navigation/native";
import { getDate } from "../../functions";
import colors from "../../utils/colors";

const FeedRepostComp = ({ item }: { item: UserPostProps }) => {
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

const FeedPostComp = ({ item }: { item: UserPostProps }) => {
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
      {item.type == "repost" && item.post && <FeedRepostComp item={item} />}
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

const DetailsRepostComp = ({ item }: { item: UserPostProps }) => {
  return (
    <View style={{ gap: 10 }}>
      <PostHeader item={item} />
      {item.post_text && <PostText item={item} type="details" />}
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
      <View style={styles.separator} />
    </View>
  );
};

const DetailsPostComp = ({ item }: { item: UserPostProps }) => {
  return (
    <View
      style={{
        gap: 10,
        paddingVertical: 10,
      }}
    >
      {item.type == "repost" && item.post && <DetailsRepostComp item={item} />}
      {item.type == "post" && (
        <>
          <PostHeader item={item} />
          <View style={[, { paddingHorizontal: spacing.padding_horizontal }]}>
            <Text style={[_styles.font_12_medium, { fontSize: 10 }]}>
              {getDate(item.created_at)}
            </Text>
          </View>
          {item.post_text && <PostText item={item} type="details" />}
          {item.medias?.length > 0 && <PostMedias item={item} />}
          <PostActionBtns item={item} />
          <View style={styles.separator} />
        </>
      )}
    </View>
  );
};

export const PostView = ({
  display_type,
  item,
}: {
  item: UserPostProps;
  display_type: "feed" | "details";
}) => {
  return (
    <View>
      {display_type == "feed" && <FeedPostComp item={item} />}
      {display_type == "details" && <DetailsPostComp item={item} />}
    </View>
  );
};

const styles = StyleSheet.create({
  repost_separator: {
    height: "90%",
    width: 1.5,
    backgroundColor: "#D7D7D7",
    left: 10,
  },
  separator: {
    height: 1.5,
    width: "100%",
    backgroundColor: colors.color_7,
    marginVertical: 10,
  },
});
