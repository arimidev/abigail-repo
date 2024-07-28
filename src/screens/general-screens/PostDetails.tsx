import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import _styles from "../../utils/_styles";
import colors from "../../utils/colors";
import { useGet_post_detailsQuery } from "../../redux_utils/api_slice";
import { Loader } from "../../components/Loader";
import { PostHeader } from "../../components/posts/PostHeader";
import { PostText } from "../../components/posts/PostText";
import { PostMedias } from "../../components/posts/PostMedias";
import { PostActionBtns } from "../../components/posts/PostActionBtns";
import spacing from "../../utils/spacing";
import { useSelector } from "react-redux";
import { select_seen_posts } from "../../redux_utils/features/seen_posts";
import CommentInput from "../../components/posts/CommentInput";

const UserRepostComp = ({ item }: { item: UserPostProps }) => {
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
    </View>
  );
};

const PostComp = ({ item }: { item: UserPostProps }) => {
  return (
    <View
      style={{
        gap: 10,
        paddingVertical: 10,
      }}
    >
      {item.type == "repost" && item.post && <UserRepostComp item={item} />}
      {item.type == "post" && (
        <>
          <PostHeader item={item} />
          {item.post_text && <PostText item={item} type="details" />}
          {item.medias?.length > 0 && <PostMedias item={item} />}
          <PostActionBtns item={item} />
        </>
      )}
    </View>
  );
};

export const PostDetails = ({ navigation, route }) => {
  // redux
  const seen_posts: Array<UserPostProps> = useSelector(select_seen_posts);
  // route stuff
  const passedData: UserPostProps = route.params.passedData;
  // ======= states ====
  const [postDataState, setPostData] = useState(passedData);
  const [] = useState();
  // ===== api hooks  ====
  const {
    data: postData,
    isLoading: postLoading,
    isError: postErr,
  } = useGet_post_detailsQuery({ id: passedData._id });

  //effects

  useEffect(() => {
    if (postData) {
      const reduxItem = seen_posts.find(
        (seen_post_item) => seen_post_item._id === postData?.results?._id
      );
      setPostData(reduxItem);
    }
  }, [postData, seen_posts]);

  return (
    <View
      style={[
        _styles.flex_1,
        { backgroundColor: colors.color_1, paddingTop: 20 },
      ]}
    >
      <View style={{ flex: 1 }}>
        {postLoading && <Loader />}
        {postData && <PostComp item={postDataState} />}
      </View>

      <CommentInput />
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
});
