import { createSlice } from "@reduxjs/toolkit";

const screen_slice = createSlice({
  name: "screen_slice",
  initialState: { screen: null },
  reducers: {
    setScreen: (state, action) => {
      state.screen = action.payload;
    },
  },
});

export default screen_slice.reducer;
export const { setScreen } = screen_slice.actions;
export const select_screen = (state: any) => state.screen.screen;
