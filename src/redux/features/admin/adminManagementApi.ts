import { baseApi } from '../../api/baseApi';

// Inject admin user management endpoints into the base API
const adminManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Query to fetch all users with optional filtering parameters
    getAllUser: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item: any) => {
            params.append(item.name, item.value as string);
          });
        }
        return {
          url: '/admin/user/get-users',
          method: 'GET',
          params,
        };
      },
      providesTags: ['users'], // Provides cache tag for invalidation
    }),

    // ✅ Query to fetch analytics about users (e.g., count, growth, etc.)
    getUsersAnalytics: builder.query({
      query: () => ({
        url: '/admin/user/get-user-analytics',
        method: 'GET',
      }),
      providesTags: ['users'],
    }),

    // ✅ Mutation to suspend a user by ID
    userSuspend: builder.mutation({
      query: ({ id, reason }) => ({
        url: `/user-suspend/suspend-a-user/${id}`,
        method: 'PATCH',
        body: { reason },
      }),
      invalidatesTags: ['users'], // Invalidate users cache after suspension
    }),

    // ✅ Mutation to un-suspend a user by ID
    userUnSuspend: builder.mutation({
      query: ({ id }) => ({
        url: `/user-suspend/unsuspend-a-user/${id}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['users'], // Invalidate users cache after un-suspension
    }),

    // ✅ Mutation to force logout a user by ID (usually for security or admin override)
    forceLogout: builder.mutation({
      query: ({ id }) => ({
        url: `/admin/user/force-logout/${id}`,
        method: 'GET', // Although GET is unusual for actions, used here as per backend
      }),
      invalidatesTags: ['users'],
    }),

    // ✅ Mutation to reset a user’s password (admin-initiated)
    resetPassword: builder.mutation({
      query: ({ id }) => ({
        url: `/admin/user/reset-password/${id}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['users'],
    }),

    // ✅ Query to get detailed information about a single user by ID
    getUserDetails: builder.query({
      query: ({ id }) => ({
        url: `/admin/user/get-user/${id}`,
        method: 'GET',
      }),
    }),
    getAdminManagement: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item: any) => {
            params.append(item.name, item.value as string);
          });
        }
        return {
          url: '/manage-admin',
          method: 'GET',
          params: params,
        };
      },
      providesTags: ['admins'],
    }),
    createAdmin: builder.mutation({
      query: (data) => ({
        url: '/manage-admin',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['admins'],
    }),
    getAdminDetail: builder.query({
      query: ({ id }) => ({
        url: `/manage-admin/${id}`,
        method: 'GET',
      }),
    }),
    updateAdminDetails: builder.mutation({
      query: ({ data, id }) => ({
        url: `/manage-admin/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['admins'],
    }),
    deleteAdmin: builder.mutation({
      query: ({ id }) => ({
        url: `/manage-admin/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['admins'],
    }),
  }),
});

// Export auto-generated hooks for usage in components
export const {
  useGetAllUserQuery,
  useGetUsersAnalyticsQuery,
  useUserSuspendMutation,
  useUserUnSuspendMutation,
  useForceLogoutMutation,
  useResetPasswordMutation,
  useGetUserDetailsQuery,
  useGetAdminManagementQuery,
  useCreateAdminMutation,
  useGetAdminDetailQuery,
  useUpdateAdminDetailsMutation,
  useDeleteAdminMutation,
} = adminManagementApi;
