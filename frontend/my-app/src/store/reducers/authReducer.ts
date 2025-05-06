import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { api } from '../../services/api';
import { User } from '../../services/api'; // adjust the path if needed

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAdmin: boolean;
  loading: boolean;
  isAuthenticated: boolean;
}

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

const initialState: AuthState = {
  user: null,
  accessToken: localStorage.getItem(ACCESS_TOKEN_KEY),
  refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY),
  loading: false,
  isAdmin: false,
  isAuthenticated: !!localStorage.getItem(ACCESS_TOKEN_KEY),
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
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAdmin = action.payload.role === 'admin';
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
        state.isAdmin = user.role === 'admin';
        state.isAuthenticated = true;
        state.loading = false;

        localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
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
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
      });
  },
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;
