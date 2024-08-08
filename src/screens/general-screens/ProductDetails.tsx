import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import colors from "../../utils/colors";
import { ProductView } from "../../components/posts/ProductView";
import { useDispatch, useSelector } from "react-redux";
import {
  add_post,
  select_seen_posts,
} from "../../redux_utils/features/seen_posts";
import {
  useGetPostCommentsMutation,
  useGetProductDetailsQuery,
} from "../../redux_utils/api_slice";
import { Loader } from "../../components/Loader";
import { showToast } from "../../functions";
import CommentInput from "../../components/posts/CommentInput";
import _styles from "../../utils/_styles";
import { CommentComp } from "../../components/posts/Comment";

export const ProductDetails = ({ navigation, route }) => {
  const passedData: ProductProps = route.params.passedData;
  // redux
  const seen_posts: Array<ProductProps> = useSelector(select_seen_posts);
  const dispatch = useDispatch();

  // states
  const [comments, setComments] = useState<Array<CommentProps>>([]);
  const [commentsPage, setPage] = useState(1);
  const [is_data_available, set_is_data_available] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // api hooks

  const {
    data: product,
    isLoading: productLoading,
    isError: productErr,
    refetch: productRefetch,
  } = useGetProductDetailsQuery(passedData._id);

  const reduxItem = seen_posts.find(
    (seen_post_item) => seen_post_item._id === product?.results?._id
  );

  const existingProduct = reduxItem ?? passedData;

  // comments
  const [
    getPostComments,
    { isLoading: mutCommentsLoading, isError: mutCommentErr },
  ] = useGetPostCommentsMutation();

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
    setPage(commentsPage + 1);
  }

  const refreshFunc = useCallback(() => {
    setRefreshing(true);
    productRefetch();
    if (product) {
      dispatch(add_post(product.results));
    }
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
    getComments(commentsPage).then(setNextCommentPage);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.color_1 }}>
      <View style={{ flex: 1 }}>
        {productLoading && <Loader />}
        {!productLoading && (
          <FlatList
            refreshing={refreshing}
            onRefresh={refreshFunc}
            ListHeaderComponent={
              <ProductView display_type="details" item={existingProduct} />
            }
            contentContainerStyle={{ paddingTop: 20, paddingBottom: 100 }}
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
                !mutCommentErr
              ) {
                getComments(commentsPage).then(setNextCommentPage);
              }
            }}
          />
        )}
      </View>

      <CommentInput />
    </View>
  );
};

const styles = StyleSheet.create({});
