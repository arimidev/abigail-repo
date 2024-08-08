import { StyleSheet, Text, View } from "react-native";
import React from "react";
import {
  useLike_postMutation,
  useLike_productMutation,
} from "../redux_utils/api_slice";
import { showToast } from "../functions";
import { useDispatch, useSelector } from "react-redux";
import { update_post } from "../redux_utils/features/seen_posts";
import { select_user, setUser } from "../redux_utils/features/user";
import {
  select_seen_users,
  update_user,
} from "../redux_utils/features/seen_users";

const useLikePostFunction = () => {
  const [like_post] = useLike_postMutation();
  const [like_product] = useLike_productMutation();
  const dispatch = useDispatch();
  const User: UserProps = useSelector(select_user);
  const seen_users: Array<UserProps> = useSelector(select_seen_users);

  const likePost = async ({
    post,
    type,
  }: {
    post: UserPostProps | ProductProps;
    type: "post" | "product";
  }) => {
    const existingUser: UserProps = seen_users.find(
      (obj) => obj._id == post.owner._id
    );
    // ================== local update
    function localUpdate() {
      try {
        if (post.is_liked_by_user == true) {
          dispatch(
            update_post({
              ...post,
              is_liked_by_user: false,
              likes: post.likes - 1,
            })
          );
          if (post.owner._id == User._id) {
            dispatch(setUser({ ...User, likes: User.likes - 1 }));
          }
          if (existingUser) {
            dispatch(
              update_user({ ...post.owner, likes: existingUser.likes - 1 })
            );
          }
        } else {
          dispatch(
            update_post({
              ...post,
              is_liked_by_user: true,
              likes: post.likes + 1,
            })
          );
          if (post.owner._id == User._id) {
            dispatch(setUser({ ...User, likes: User.likes + 1 }));
          }
          if (existingUser) {
            dispatch(
              update_user({ ...post.owner, likes: existingUser.likes + 1 })
            );
          }
        }
      } catch (error) {
        console.log(error);
      }
    }

    localUpdate();

    // update on backend
    try {
      const res =
        type == "post"
          ? await like_post(post._id).unwrap()
          : await like_product(post._id).unwrap();
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
  return { likePost };
};

export default useLikePostFunction;

const styles = StyleSheet.create({});
