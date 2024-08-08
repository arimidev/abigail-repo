import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import colors from "../../utils/colors";
import { PostHeader } from "../../components/posts/PostHeader";
import { PostText } from "../../components/posts/PostText";
import { PostMedias } from "../../components/posts/PostMedias";
import { CommentActionBtns } from "../../components/posts/CommentActions";
import {
  useGetChildCommentsMutation,
  useGetCommentDetailsQuery,
} from "../../redux_utils/api_slice";
import {
  add_post,
  select_seen_posts,
  update_post,
} from "../../redux_utils/features/seen_posts";
import { useDispatch, useSelector } from "react-redux";
import { Loader } from "../../components/Loader";
import { CommentComp } from "../../components/posts/Comment";
import _styles from "../../utils/_styles";
import CommentInput from "../../components/posts/CommentInput";
import { getDate, showToast } from "../../functions";
import spacing from "../../utils/spacing";

export const CommentPage = ({ route }) => {
  // redux
  const seen_posts: Array<UserPostProps> = useSelector(select_seen_posts);
  const passedData: CommentProps = route.params.passedData;
  const dispatch = useDispatch();
  // state
  const [comments, setComments] = useState<Array<CommentProps>>([]);
  const [commentsPage, setPage] = useState(1);
  const [is_data_available, set_is_data_available] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // api hooks

  const {
    data: pageComment,
    isLoading: commentLoading,
    isError: commentErr,
    refetch: pageCommentRefetch,
  } = useGetCommentDetailsQuery({
    id: passedData._id,
  });

  const reduxItem = seen_posts.find(
    (seen_post_item) => seen_post_item._id === pageComment?.results?._id
  );
  const commentData: CommentProps = reduxItem ?? passedData;

  const [
    getChildComments,
    { isLoading: mutCommentsLoading, isError: mutCommentsErr },
  ] = useGetChildCommentsMutation();

  // functions

  async function getChildCommentsFunc(page: number) {
    try {
      const res = await getChildComments({
        id: passedData._id,
        page: page,
        limit: 5,
        postId: passedData.post,
        parentId: passedData._id,
      }).unwrap();
      res.results.map((item) => {
        dispatch(add_post(item));
      });
      set_is_data_available(res.results?.length > 0);

      return res.results;
    } catch (error) {
      console.log(error);
      showToast({
        description: "Error getting comments",
        type: "error",
        duration: 3000,
      });
    }
  }

  const refreshFunc = useCallback(() => {
    setRefreshing(true);
    pageCommentRefetch();
    if (pageComment) {
      dispatch(add_post(pageComment.results));
    }
    getChildCommentsFunc(1).then((data) => {
      setComments([...data, ...comments]);
    });
    setRefreshing(mutCommentsLoading);
  }, []);

  function setNextCommentPage(data) {
    setComments([...comments, ...data]);
    setPage(commentsPage + 1);
  }

  const validatedComments = (arr: Array<CommentProps>) => {
    const validated_items = arr.map((comment) => {
      const reduxItem = seen_posts.find(
        (seen_comment) => seen_comment._id === comment._id
      );
      return reduxItem ? { ...comment, ...reduxItem } : comment;
    });
    return validated_items;
  };

  const uniqueComments: Array<CommentProps> = Array.from(
    validatedComments(comments)
      .reduce((map, obj) => map.set(obj._id, obj), new Map())
      .values()
  );

  // effects

  // get child comments on mount

  useEffect(() => {
    getChildCommentsFunc(commentsPage).then(setNextCommentPage);
  }, []);

  // list header comp

  const ListHeader = () => {
    return (
      <View style={{ gap: 10, marginTop: 15 }}>
        <PostHeader item={commentData} />
        <View style={[, { paddingHorizontal: spacing.padding_horizontal }]}>
          <Text style={[_styles.font_12_medium, { fontSize: 10 }]}>
            {getDate(commentData.created_at)}
          </Text>
        </View>
        {commentData.post_text && (
          <PostText item={commentData} type="details" />
        )}
        {commentData.medias?.length > 0 && <PostMedias item={commentData} />}
        <View style={{ paddingHorizontal: 20 }}>
          <CommentActionBtns item={commentData} />
        </View>
        <View style={styles.separator} />
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.color_1 }}>
      <View style={{ flex: 1 }}>
        {commentLoading && <Loader />}
        {!commentLoading && (
          <FlatList
            refreshing={refreshing}
            onRefresh={refreshFunc}
            ListHeaderComponent={<ListHeader />}
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
              if (
                is_data_available == true &&
                !mutCommentsLoading &&
                !mutCommentsErr
              ) {
                getChildCommentsFunc(commentsPage).then(setNextCommentPage);
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
  separator: {
    height: 1.5,
    width: "100%",
    backgroundColor: colors.color_7,
    marginVertical: 10,
  },
});
