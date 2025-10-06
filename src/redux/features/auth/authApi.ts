import { baseApi } from '../../api/baseApi';

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    loging: builder.mutation({
      query: (userInfo) => ({
        url: '/user/login',
        method: 'POST',
        body: userInfo,
      }),
    }),
    creadintialsChange: builder.mutation({
      query: (userInfo) => ({
        url: '/user/update',
        method: 'PATCH',
        body: userInfo,
      }),
    }),
    userInformation: builder.query({
      query: () => ({
        url: '/user/me',
        method: 'GET',
      }),
    }),
    resetCodeSend: builder.mutation({
      query: ({ email }) => ({
        url: `/user/get-password-reset-code`,
        method: 'GET',
        params: { email },
      }),
    }),
    resetPassword: builder.mutation({
      query: (userInfo) => ({
        url: '/user/reset-password',
        method: 'POST',
        body: userInfo,
      }),
    }),
  }),
});

export const {
  useResetCodeSendMutation,
  useUserInformationQuery,
  useCreadintialsChangeMutation,
  useLogingMutation,
} = authApi;
