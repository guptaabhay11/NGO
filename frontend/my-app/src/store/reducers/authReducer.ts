import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { api } from '../../services/api';

interface AuthState {
  user: any | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAdmin: boolean;
  loading: boolean;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: localStorage.getItem('token'),
  refreshToken: null,
  loading: false,
  isAdmin: false,
  isAuthenticated: false
};


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAdmin = false;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(api.endpoints.login.matchPending, (state) => {
        state.loading = true;
        return state;
      })
      .addMatcher(api.endpoints.login.matchFulfilled, (state, action) => {
        const data = action.payload.data;
        localStorage.setItem('access_token', data.accessToken);
        localStorage.setItem('refresh_token', data.refreshToken);
        state.accessToken = data.accessToken;
        state.refreshToken = data.refreshToken;
        state.isAuthenticated = true;
        state.loading = false;
        return state;
      })
      .addMatcher(api.endpoints.login.matchRejected, (state) => {
        state.accessToken = '';
        state.refreshToken = '';
        state.isAuthenticated = false;
        state.loading = false;
        return state;
      });
  
    builder.addMatcher(api.endpoints.logout.matchFulfilled, (state) => {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      state.accessToken = '';
      state.refreshToken = '';
      state.isAuthenticated = false;
      state.loading = false;
      return state;
    });
  }
  
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;