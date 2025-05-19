import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { api } from '../../services/api';
import { User } from '../../types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAdmin: boolean;
  loading: boolean;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  loading: false,
  isAdmin: false,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAdmin = false;
      state.isAuthenticated = false;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAdmin = action.payload.role === 'ADMIN';
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addMatcher(api.endpoints.login.matchPending, (state) => {
        state.loading = true;
      })
      .addMatcher(api.endpoints.login.matchFulfilled, (state, { payload }) => {
        const { accessToken, refreshToken, user } = payload.data;
        state.accessToken = accessToken;
        state.refreshToken = refreshToken;
        state.user = user;
        state.isAdmin = user.role === 'ADMIN';
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addMatcher(api.endpoints.login.matchRejected, (state) => {
        state.accessToken = null;
        state.refreshToken = null;
        state.user = null;
        state.isAdmin = false;
        state.isAuthenticated = false;
        state.loading = false;
      })

      // LOGOUT
      .addMatcher(api.endpoints.logout.matchFulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAdmin = false;
        state.isAuthenticated = false;
        state.loading = false;
      });
  },
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;
