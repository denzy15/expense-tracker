import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthInitialState {
  token: string | null;
  email: string | null;
}

const initialState: AuthInitialState = {
  token: null,
  email: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ token: string; email: string }>) => {
      state.token = action.payload.token;
      state.email = action.payload.email;
    },
    signOut: (state) => {
      state.token = null;
      state.email = null;
    },
  },
});

export const { login, signOut } = authSlice.actions;
export default authSlice.reducer;
