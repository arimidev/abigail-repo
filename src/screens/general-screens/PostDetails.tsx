import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import _styles from "../../utils/_styles";
import colors from "../../utils/colors";
import {
  useGet_post_detailsQuery,
  useGetPostComments_qQuery,
  useGetPostCommentsMutation,
} from "../../redux_utils/api_slice";
import { Loader } from "../../components/Loader";
import { PostHeader } from "../../components/posts/PostHeader";
import { PostText } from "../../components/posts/PostText";
import { PostMedias } from "../../components/posts/PostMedias";
import { PostActionBtns } from "../../components/posts/PostActionBtns";
import spacing from "../../utils/spacing";
import { useDispatch, useSelector } from "react-redux";
import {
  add_post,
  select_seen_posts,
  update_post,
} from "../../redux_utils/features/seen_posts";
import CommentInput from "../../components/posts/CommentInput";
import { CommentComp } from "../../components/posts/Comment";
import { getDate, showToast } from "../../functions";

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
      <View style={styles.separator} />
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

export const PostDetails = ({ navigation, route }) => {
  // redux
  const seen_posts: Array<UserPostProps> = useSelector(select_seen_posts);
  const dispatch = useDispatch();
  // route stuff
  const passedData: UserPostProps = route.params.passedData;
  // ======= states ====
  const [comments, setComments] = useState<Array<CommentProps>>([]);
  const [page, setPage] = useState(1);
  const [is_data_available, set_is_data_available] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  // ===== api hooks  ====
  const {
    data: postData,
    isLoading: postLoading,
    isError: postErr,
    refetch: postReftch,
  } = useGet_post_detailsQuery({ id: passedData._id });

  const reduxItem = seen_posts.find(
    (seen_post_item) => seen_post_item._id === postData?.results?._id
  );

  const postDataState = reduxItem ?? passedData;

  // comments
  const [getPostComments, { isLoading: mutCommentsLoading }] =
    useGetPostCommentsMutation();

  // const {
  //   data: query_comments_data,
  //   isLoading: queryCommentsLoading,
  //   refetch: query_comments_refetch,
  // } = useGetPostComments_qQuery({
  //   postId: passedData?._id,
  //   page: 1,
  //   limit: 5,
  // });

  // functions

  async function getComments(page: number) {
    try {
      const res = await getPostComments({
        postId: passedData._id,
        page: page,
        limit: 5,
      }).unwrap();
      res.results.map((item) => {
        dispatch(add_post(item));
      });
      set_is_data_available(res.results?.length > 0);
      return res.results;
    } catch (err) {
      console.log(err);
      showToast({
        description: "Error getting comments",
        duration: 3000,
        type: "error",
      });
    }
  }

  function setNextCommentPage(data) {
    setComments([...comments, ...data]);
    setPage(page + 1);
  }

  const refreshFunc = useCallback(() => {
    setRefreshing(true);
    postReftch();
    getComments(1).then((data) => {
      setComments([...data, ...comments]);
    });
    setRefreshing(mutCommentsLoading);
  }, []);

  const validatedComments = (arr: Array<CommentProps>) => {
    const validated_items = arr.map((comment) => {
      const reduxItem = seen_posts.find(
        (seen_comment) => seen_comment._id === comment._id
      );
      return reduxItem ? { ...comment, ...reduxItem } : comment;
    });
    return validated_items;
  };

  const uniqueComments = Array.from(
    validatedComments(comments)
      .reduce((map, obj) => map.set(obj._id, obj), new Map())
      .values()
  );

  //effects

  useEffect(() => {
    if (postData) {
      dispatch(add_post(postData.results));
    }
  }, [postData]);

  useEffect(() => {
    getComments(page).then(setNextCommentPage);
  }, []);

  // useEffect(() => {
  // if (query_comments_data?.results) {
  //   setComments([...query_comments_data?.results, ...comments]);
  //   query_comments_data?.results.map((item) => {
  //     dispatch(add_post(item));
  //   });
  // }
  // }, [query_comments_data]);

  return (
    <View style={[_styles.flex_1, { backgroundColor: colors.color_1 }]}>
      <View style={{ flex: 1 }}>
        {postLoading && <Loader />}
        {!postLoading && (
          <FlatList
            refreshing={refreshing}
            onRefresh={refreshFunc}
            ListHeaderComponent={<PostComp item={postDataState} />}
            data={uniqueComments}
            keyExtractor={(item) => item._id.toString()}
            renderItem={(item) => <CommentComp {...item} />}
            ListFooterComponent={
              mutCommentsLoading ? (
                <View style={[_styles.all_center]}>
                  <ActivityIndicator size={40} color={colors.color_2} />
                </View>
              ) : (
                <View />
              )
            }
            onEndReached={() => {
              if (is_data_available == true && !mutCommentsLoading) {
                getComments(page).then(setNextCommentPage);
              }
            }}
          />
        )}
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
  separator: {
    height: 1.5,
    width: "100%",
    backgroundColor: colors.color_7,
    marginVertical: 10,
  },
});
