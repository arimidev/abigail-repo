import { createSlice } from "@reduxjs/toolkit";

const temporary_token_slice = createSlice({
  name: "token_slice",
  initialState: { user_token: null },
  reducers: {
    setTemporaryToken: (state, action) => {
      state.user_token = action.payload;
    },
  },
});

export const { setTemporaryToken } = temporary_token_slice.actions;
export default temporary_token_slice.reducer;
export const select_temporary_token = (state: any) =>
  state.temporary_token.user_token;
