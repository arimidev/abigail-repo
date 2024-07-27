import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useSave_postMutation } from "../redux_utils/api_slice";
import { showToast } from "../functions";
import { useDispatch, useSelector } from "react-redux";
import { update_post } from "../redux_utils/features/seen_posts";
import { select_user } from "../redux_utils/features/user";

const useSavePostFunction = () => {
  const [save_post] = useSave_postMutation();
  const dispatch = useDispatch();

  const savePost = async ({ post }: { post: UserPostProps }) => {
    // ================== local update
    function localUpdate() {
      if (post.is_saved_by_user == true) {
        dispatch(
          update_post({
            ...post,
            is_saved_by_user: false,
          })
        );
      } else {
        dispatch(
          update_post({
            ...post,
            is_saved_by_user: true,
          })
        );
      }
    }

    localUpdate();

    // ====================== update on backend
    try {
      const res = await save_post(post._id).unwrap();
      showToast({
        description:
          res.action == "saved"
            ? "Post added to bookmark."
            : "Post removed from bookmark.",
        type: "default",
        duration: 3000,
      });
    } catch (error) {
      localUpdate();
      console.log(error);
      showToast({
        description: "Something went wrong",
        type: "error",
        duration: 3000,
      });
    }
  };
  return { savePost };
};

export default useSavePostFunction;

const styles = StyleSheet.create({});
