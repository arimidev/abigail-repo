import { createSlice } from "@reduxjs/toolkit";

interface Props {
  posts: Array<UserPostProps>;
}

const initialState: Props = {
  posts: [],
};

const seen_posts_slice = createSlice({
  name: "user_post_slice",
  initialState,
  reducers: {
    add_post: (state, action) => {
      const existingIndex = state.posts.findIndex(
        (post) => post._id === action.payload._id
      );
      if (existingIndex >= 0) {
        // Post with the same _id exists, update it
        state.posts[existingIndex] = {
          ...state.posts[existingIndex],
          ...action.payload,
        };
      } else {
        // No duplicate, add new post
        state.posts.push(action.payload);
      }
    },

    update_post: (state, action) => {
      state.posts = state.posts.map((post) =>
        post._id === action.payload._id ? { ...post, ...action.payload } : post
      );
    },
  },
});

export const { add_post, update_post } = seen_posts_slice.actions;
export default seen_posts_slice.reducer;
export const select_seen_posts = (state: any) => state.seen_posts.posts;
