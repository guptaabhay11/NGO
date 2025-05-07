// services/baseQuery.ts
import { fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { RootState } from '../store/store';
import setTokens from '../store/reducers/authReducer';
import logout from '../store/reducers/authReducer';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:5000/api',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) headers.set('Authorization', `Bearer ${token}`);
    return headers;
  },
  credentials: 'include', 
});

export const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
    args,
    api,
    extraOptions
  ) => {
    let result = await rawBaseQuery(args, api, extraOptions);
  
    if (result.error && result.error.status === 401) {
 
      const refreshToken = localStorage.getItem('refresh_token');
      const refreshResult = await rawBaseQuery(
        {
          url: '/refresh',
          method: 'POST',
          body: { refreshToken },
        },
        api,
        extraOptions
      );
  
      if (refreshResult.data && (refreshResult.data as any).accessToken) {
        const newAccessToken = (refreshResult.data as any).accessToken;
  
        localStorage.setItem('access_token', newAccessToken);
        //api.dispatch(setTokens({ accessToken: newAccessToken, refreshToken: refreshToken || '' }));
  
        result = await rawBaseQuery(args, api, extraOptions);
      }
    }
  
    return result;
  };
  