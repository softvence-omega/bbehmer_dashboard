import { baseApi } from '../../api/baseApi';

// Injecting admin-specific cafe management endpoints into baseApi
const adminCoffeeManagement = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Mutation to update cafe details by ID
    adminUpdateCafe: builder.mutation({
      query: ({ data, id }) => ({
        url: `/admin/cafe/update-cafe/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['coffeeShop'], // Invalidate coffeeShop cache after update
    }),

    // ✅ Mutation to approve a pending cafe by ID
    adminCafeApproveCafe: builder.mutation({
      query: ({ id }) => ({
        url: `/admin/cafe/approve-cafe/${id}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['pendingCafe', 'coffeeShop'], // Invalidate both pending and general cafes
    }),

    // ✅ Mutation to merge duplicate cafes into a target cafe
    adminCafeMergeCafe: builder.mutation({
      query: ({ targetId, duplicateIds }) => ({
        url: `/admin/cafe/merge-cafes/${targetId}`,
        method: 'PATCH',
        body: { duplicateIds }, // Payload contains IDs of duplicates to merge
      }),
      invalidatesTags: ['duplicateCafe'],
    }),

    // ✅ Query to fetch all cafes with optional filtering params
    adminGetAllCafe: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item: any) => {
            params.append(item.name, item.value);
          });
        }
        return {
          url: '/admin/cafe/get-admin-cafes',
          method: 'GET',
          params,
        };
      },
      providesTags: ['coffeeShop'],
    }),

    // ✅ Query to fetch all flagged content with optional filters
    adminGetFlaggedContent: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item: any) => {
            params.append(item.name, item.value);
          });
        }
        return {
          url: '/admin/cafe-flagged-content',
          method: 'GET',
          params,
        };
      },
      providesTags: ['flaggedContent'],
    }),

    // ✅ Mutation to bulk import cafes via file or structured data
    adminImportCafes: builder.mutation({
      query: ({ data }) => ({
        url: '/admin/cafe/bulk-import-cafes',
        method: 'POST',
        body: data,
      }),
    }),

    // ✅ Query to export all cafes (typically returns a file)
    adminCafeExport: builder.query({
      query: () => ({
        url: '/admin/cafe/export-cafes',
        method: 'GET',
      }),
    }),

    // ✅ Mutation to delete a cafe by ID
    adminCafeDelete: builder.mutation({
      query: ({ id }) => ({
        url: `/admin/cafe/delete-cafe/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['coffeeShop'],
    }),

    // ✅ Mutation to mark a flagged content item as resolved
    adminCafeFlaggedResolve: builder.mutation({
      query: ({ id }) => ({
        url: `/admin/cafe-flagged-content/resolve/${id}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['flaggedContent'],
    }),

    // ✅ Query to fetch pending cafes with optional filters
    adminGetAllCafePending: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item: any) => {
            params.append(item.name, item.value);
          });
        }
        return {
          url: '/admin/cafe/get-pending-cafes',
          method: 'GET',
          params,
        };
      },
      providesTags: ['pendingCafe'],
    }),

    // ✅ Query to get a list of duplicate cafes based on filters
    adminDuplicateCafe: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item: any) => {
            params.append(item.name, item.value);
          });
        }
        return {
          url: '/admin/cafe/get-duplicate-cafes',
          method: 'GET',
          params,
        };
      },
      providesTags: ['duplicateCafe'],
    }),

    // ✅ Mutation to delete a flagged content item by ID
    adminFlaggedContentRemove: builder.mutation({
      query: ({ id }) => ({
        url: `/admin/cafe-flagged-content/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['flaggedContent'],
    }),

    // ✅ Mutation to reject a pending cafe by ID
    adminPendingCafeReject: builder.mutation({
      query: ({ id }) => ({
        url: `/admin/cafe/reject-cafe/${id}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['pendingCafe', 'coffeeShop'],
    }),

    // ✅ export coffee shop list
    adminExportCafe: builder.mutation<Blob, void>({
      query: () => ({
        url: '/admin/cafe/export-cafes',
        method: 'GET',
        responseHandler: (response) => response.blob(), // Important!
      }),
      // Optional: you can mark it as non-json
      extraOptions: {
        responseType: 'blob',
      },
    }),
  }),
});

// Exporting auto-generated hooks for each endpoint
export const {
  useAdminExportCafeMutation,
  useAdminPendingCafeRejectMutation,
  useAdminFlaggedContentRemoveMutation,
  useAdminDuplicateCafeQuery,
  useAdminGetAllCafePendingQuery,
  useAdminCafeFlaggedResolveMutation,
  useAdminGetFlaggedContentQuery,
  useAdminCafeDeleteMutation,
  useAdminGetAllCafeQuery,
  useAdminImportCafesMutation,
  useAdminCafeExportQuery,
  useAdminUpdateCafeMutation,
  useAdminCafeApproveCafeMutation,
  useAdminCafeMergeCafeMutation,
} = adminCoffeeManagement;
