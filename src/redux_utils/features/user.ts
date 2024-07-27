import { createSlice } from "@reduxjs/toolkit";

const initialState: UserProps = null;

const user_slice = createSlice({
  name: "user_slice",
  initialState: { user: null },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export default user_slice.reducer;
export const { setUser } = user_slice.actions;
export const select_user = (state: any) => state.user.user;
