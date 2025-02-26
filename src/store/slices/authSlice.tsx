import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, AuthStatus, UserInfo } from "../../types/auth";

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
  status: AuthStatus.IDLE,
};

const authSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    loginStart(state) {
      Object.assign(state, { loading: true, error: null, status: AuthStatus.LOADING });
    },
    loginSuccess(state, { payload }: PayloadAction<UserInfo>) {
      Object.assign(state, {
        isAuthenticated: true,
        user: payload,
        loading: false,
        error: null,
        status: AuthStatus.SUCCEEDED,
      });
    },
    loginFailure(state, { payload }: PayloadAction<string>) {
      Object.assign(state, {
        loading: false,
        error: payload,
        status: AuthStatus.FAILED,
        isAuthenticated: false,
        user: null,
      });
    },
    logout(state) {
      Object.assign(state, initialState);
    },
    updateUserInfo(state, { payload }: PayloadAction<Partial<UserInfo>>) {
      if (state.user) {
        Object.assign(state.user, payload);
      }
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, updateUserInfo } =
  authSlice.actions;
export default authSlice.reducer;