import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { showToast } from "../functions";
import { useDispatch, useSelector } from "react-redux";
import { update_post } from "../redux_utils/features/seen_posts";
import { useLike_commentMutation } from "../redux_utils/api_slice";

const useLikeCommentFunction = () => {
  const [like_comment] = useLike_commentMutation();
  const dispatch = useDispatch();

  const likeComment = async ({ comment }: { comment: CommentProps }) => {
    // local update
    function localUpdate() {
      try {
        if (comment.is_liked_by_user == true) {
          dispatch(
            update_post({
              ...comment,
              is_liked_by_user: false,
              likes: comment.likes - 1,
            })
          );
        } else {
          dispatch(
            update_post({
              ...comment,
              is_liked_by_user: true,
              likes: comment.likes + 1,
            })
          );
        }
      } catch (error) {
        console.log(error);
      }
    }

    localUpdate();

    // update on backend
    try {
      const res = await like_comment(comment._id).unwrap();
      dispatch(update_post(res.results));
    } catch (error) {
      // localUpdate(); // do something here
      console.log(error);
      showToast({
        description: "Something went wrong",
        type: "error",
        duration: 3000,
      });
    }
  };
  return { likeComment };
};

export default useLikeCommentFunction;

const styles = StyleSheet.create({});
