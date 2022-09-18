import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
};
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    reset: (state, action) => {
      state.user = action.payload
    },
  },
});

export const { reset } = userSlice.actions;

export default userSlice.reducer;
