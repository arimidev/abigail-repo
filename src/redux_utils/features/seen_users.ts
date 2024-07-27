import { createSlice } from "@reduxjs/toolkit";

interface Props {
  users: Array<UserProps>;
}

const initialState: Props = {
  users: [],
};

const seen_users_slice = createSlice({
  name: "user_user_slice",
  initialState,
  reducers: {
    add_user: (state, action) => {
      const existingIndex = state.users.findIndex(
        (user) => user._id === action.payload._id
      );
      if (existingIndex >= 0) {
        // user with the same _id exists, update it
        state.users[existingIndex] = {
          ...state.users[existingIndex],
          ...action.payload,
        };
      } else {
        // No duplicate, add new user
        state.users.push(action.payload);
      }
    },

    update_user: (state, action) => {
      state.users = state.users.map((user) =>
        user._id === action.payload._id ? { ...user, ...action.payload } : user
      );
    },
  },
});

export const { add_user, update_user } = seen_users_slice.actions;
export default seen_users_slice.reducer;
export const select_seen_users = (state: any) => state.seen_users.users;
