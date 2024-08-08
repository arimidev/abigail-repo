import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useSave_commentMutation } from "../redux_utils/api_slice";
import { showToast } from "../functions";
import { useDispatch } from "react-redux";
import { update_post } from "../redux_utils/features/seen_posts";

const useSaveCommentFunction = () => {
  const [save_comment] = useSave_commentMutation();
  const dispatch = useDispatch();

  const saveComment = async ({ comment }: { comment: CommentProps }) => {
    // ================== local update
    function localUpdate() {
      if (comment.is_saved_by_user == true) {
        dispatch(
          update_post({
            ...comment,
            is_saved_by_user: false,
          })
        );
      } else {
        dispatch(
          update_post({
            ...comment,
            is_saved_by_user: true,
          })
        );
      }
    }

    localUpdate();

    //  update on backend
    try {
      const res = await save_comment(comment._id).unwrap();
      dispatch(update_post(res.results));
      showToast({
        description:
          res.action == "saved"
            ? `Comment added to bookmark.`
            : `Comment removed from bookmark.`,
        type: "default",
        duration: 3000,
      });
    } catch (error) {
      // localUpdate();
      console.log(error);
      showToast({
        description: "Something went wrong",
        type: "error",
        duration: 3000,
      });
    }
  };
  return { saveComment };
};

export default useSaveCommentFunction;

const styles = StyleSheet.create({});
