import { createSlice } from "@reduxjs/toolkit";

const token_slice = createSlice({
  name: "token_slice",
  initialState: { user_token: null },
  reducers: {
    setToken: (state, action) => {
      state.user_token = action.payload;
    },
    deleteToken: (state, action) => {
      state.user_token = null;
    },
  },
});

export const { setToken, deleteToken } = token_slice.actions;
export default token_slice.reducer;
export const select_token = (state: any) => state.token_slice.user_token;
