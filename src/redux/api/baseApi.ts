import {
  BaseQueryApi,
  BaseQueryFn,
  createApi,
  DefinitionType,
  FetchArgs,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';
import { logOut, setUser } from '../features/auth/authSlice';
import { toast } from 'sonner';
import { TResponse } from '../../types/CommonTypes';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BASE_URL,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState)?.auth?.token;
    if (token) {
      headers.set('authorization', `bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithRefreshToken: BaseQueryFn<
  FetchArgs,
  BaseQueryApi,
  DefinitionType
> = async (args, api, extraOption): Promise<any> => {
  let result = (await baseQuery(args, api, extraOption)) as TResponse<object>;

  if (result?.error?.status === 404) {
    toast.error(result?.error?.data?.message);
  }

  if (result?.error?.status === 401) {
    // * send Refresh token
    const res = await fetch(
      `${import.meta.env.VITE_BASE_URL}/auth/refresh-token`,
      {
        method: 'POST',
        credentials: 'include',
      },
    );
    const data = await res.json();

    if (data?.data?.accessToken) {
      const user = (api.getState() as RootState).auth.user;

      api.dispatch(setUser({ user, token: data?.data?.accessToken }));

      result = (await baseQuery(args, api, extraOption)) as TResponse<object>;
    } else {
      api.dispatch(logOut());
    }
  }
  return result;
};

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: baseQueryWithRefreshToken,
  tagTypes: [
    'admins',
    'paywallControl',
    'PlanLimits',
    'logs',
    'notes',
    'users',
    'coffeeShop',
    'flaggedContent',
    'pendingCafe',
    'duplicateCafe',
    'announcements',
    'notifications',
    'products',
    'ip',
  ],
  endpoints: () => ({}),
});
