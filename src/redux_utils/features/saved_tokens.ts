import { createSlice } from "@reduxjs/toolkit";

const saved_tokens_slice = createSlice({
  name: "saved_token_slice",
  initialState: { saved_tokens: [] },
  reducers: {
    update_saved_tokens: (state, action) => {
      const existing_token = state.saved_tokens.find(
        (item) => item == action.payload
      );
      if (!existing_token) {
        state.saved_tokens = [...state.saved_tokens, action.payload];
      }
    },
    delete_saved_token: (state, action) => {
      state.saved_tokens = state.saved_tokens.filter(
        (item) => item !== action.payload
      );
    },
  },
});

export default saved_tokens_slice.reducer;
export const { update_saved_tokens, delete_saved_token } =
  saved_tokens_slice.actions;
export const select_saved_tokens = (state: any) =>
  state.saved_tokens.saved_tokens;
