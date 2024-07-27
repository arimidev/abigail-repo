import { createSlice } from "@reduxjs/toolkit";

interface Props {
  posts: Array<UserPostProps>;
}

const initialState: Props = {
  posts: [],
};

const user_post_slice = createSlice({
  name: "user_post_slice",
  initialState,
  reducers: {
    add_post: (state, action) => {
      state.posts = [...state.posts, action.payload];
    },
    update_post: (state, action) => {
      const new_arr = state.posts.map((item) => {
        if (item._id === action.payload._id) {
          return { ...item, ...action.payload };
        }
        return item;
      });

      state.posts = new_arr;
    },
  },
});
