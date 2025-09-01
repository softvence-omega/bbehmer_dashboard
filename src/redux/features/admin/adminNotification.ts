import { baseApi } from "../../api/baseApi";


export interface Notification {
  id: string
  title: string
  message: string
  fcmTokens: string[]
  startsAt?: string | null
  endsAt?: string | null
  createdAt: string
}

export interface NotificationsResponse {
  data: any;
  notifications: Notification[]
  total: number
  limit: number
  offset: number
  hasMore: boolean
}

export interface PaginationParams {
  limit?: number
  offset?: number
}

const adminNotification =  baseApi.injectEndpoints({
    endpoints: (builder) => ({
        adminSendUserNotification :builder.mutation({
            query: ({ data, id }) => ({
                url: `/notification/push/${id}`,
                method: "POST",
                body: data,
            }),
        }),
        adminAnnoucement: builder.mutation({
            query: ({ data }) => ({
                url: `/notification/announcements`,
                method: "POST",
                body: data,
            }),
            invalidatesTags:["announcements"]
        }),
        // Get all announcements with pagination
    adminGetAllAnnouncements: builder.query<any, { limit?: number; offset?: number }>({
      query: ({ limit = 10, offset = 0 } = {}) => ({
        url: "/notification/announcements",
        method: "GET",
        params: { limit, offset },
      }),
      providesTags: ["announcements"],
    }),

    // Delete announcement
    deleteAnnouncement: builder.mutation<void, string>({
      query: (id) => ({
        url: `/notification/announcements/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["announcements"],
    }),

    // Update announcement
    updateAnnouncement: builder.mutation({
      query: ({ id, data }) => ({
        url: `/notification/announcements/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["announcements"],
    }),
    // Get all Notification
    adminGetAllNotification: builder.query<any, { limit?: number; offset?: number }>({
        query: ({ limit = 10, offset = 0 } = {}) => ({
            url: '/notification/push',
            method: "GET",
            params: { limit, offset }
        }),
        providesTags:["notifications"]
    }),
    // Get all notifications with pagination
    adminGetAllNotifications: builder.query<NotificationsResponse, PaginationParams>({
      query: ({ limit = 10, offset = 0 } = {}) => ({
        url: "/notification/push",
        method: "GET",
        params: { limit, offset },
      }),
      providesTags: ["notifications"],
    }),

    // Delete notification
    deleteNotification: builder.mutation<void, string>({
      query: (id) => ({
        url: `/notification/push/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["notifications"],
    }),
    getAllNotes :builder.query<any, { limit?: number; offset?: number }>({
      query: ({ limit = 10, offset = 0 } = {}) => ({
        url: "/admin/user-note",
        method: "GET",
        params: { limit, offset },
      }),
      providesTags: ["notes"],
    }),
    setNotes :builder.mutation({
      query: ({id, data}) => ({
        url: `/admin/user-note/${id}`,
        method: "POST",
        body: data
      }),
      invalidatesTags: ["notes"],
    }),
    updateNote:builder.mutation({
      query:({id,data}) => ({
        url:`/admin/user-note/${id}`,
        method:"PATCH",
        body:{note:data}
      }),
      invalidatesTags:['notes']
    }),
    getNote:builder.query({
      query:(id)=> ({
        url:`/admin/user-note/note/${id}`,
        method:"GET",
      })
    }),
    deleteNote:builder.mutation({
      query:(id)=> ({
        url:`/admin/user-note/${id}`,
        method:"DELETE"
      }),
      invalidatesTags:["notes"]
    }),
    allPlan :builder.query<any, { skip?: number; take?: number }>({
      query: ({ skip = 0, take = 10 } = {}) => ({
        url:"/stripe/get-all-plans",
        method:"GET",
        params:{skip,take}
      })
    }),
    createPlan:builder.mutation({
      query:(data) => ({
        url:'/stripe/create-product-plan',
        method:"POST",
        body:data
      }),
      invalidatesTags:["products"]
    }),
    getAllProduct:builder.query<any, { skip?: number; take?: number }>({
      query: ({ skip = 0, take = 10 } = {}) => ({
        url:"/stripe/get-all-products",
        method:"GET",
        params:{skip,take}
      }),
      providesTags:["products"]
    }),
    getProduct :builder.query({
      query:({id})=> ({
        url:`/stripe/get-a-product/${id}`,
        method:"GET"
      })
    }),
    getAllCustomer: builder.query<any, { skip?: number; take?: number }>({
      query: ({ skip = 0, take = 10 } = {}) => ({
        url:'/stripe/get-all-customers',
        method:"GET",
        params: {skip,take}
      })
    }),
    getCustomerDetails:builder.query({
    query:(id)=>({
      url: `/stripe/get-a-customer/${id}`,
      method:"GET"
    }),
  }),
  adminGetAllIdBan:builder.query<any, { skip?: number; take?: number,ip?:string }>({
    query:({ skip = 0, take = 10,ip='' } = {})=> ({
      url:'/admin/ip-ban',
      method:"GET",
      params:{skip,take,ip}
    }),
    providesTags:["ip"]
}),
adminGetBanIpDetails:builder.query({
    query:(id)=>({
      url: `/admin/ip-ban/${id}`,
      method:"GET"
    }),
  }),
  createBanIp:builder.mutation({
    query:(data)=>({
      url:`/admin/ip-ban`,
      method:"POST",
      body:data
    }),
    invalidatesTags:["ip"]
  }),
  deleteBanIp:builder.mutation({
    query:(id)=>({
      url:`/admin/ip-ban/${id}`,
      method:"DELETE"
    }),
    invalidatesTags:["ip"]
  }),
  userBan: builder.mutation({
    query:(id)=>({
      url:`/admin/ip-ban/ban-user/${id}`,
      method:"POST"
    }),
    invalidatesTags:["users","ip"]
  }),
  userUnBan:builder.mutation({
    query:(id)=>({
      url:`/admin/ip-ban/unban/${id}`,
      method:"PATCH"
    }),
    invalidatesTags:["users","ip"]
  }),
  adminLogs:builder.query({
    query:()=>({
      url:'/admin/audit-logs',
      method:"GET"
    }),
    providesTags:["logs"]
  }),
  adminLogDelete:builder.mutation({
    query:(id)=>({
      url:`/admin/audit-logs/${id}`,
      method:"DELETE"
    }),
    invalidatesTags:["logs"]
  }),
  adminGetLog: builder.query({
    query:(id)=>({
      url:`/admin/audit-logs/${id}`,
      method:"GET"
    })
  }),
  adminpaywallControl: builder.query({
    query: () => ({
      url: '/admin/paywall',
      method: 'GET',
    }),
    providesTags: ['paywallControl'],
  }),
  adminPaywallControl: builder.mutation({
    query: (data) => ({
      url: '/admin/paywall',
      method: 'POST',
      body: data,
    }),
    invalidatesTags: ['paywallControl'],
  }),
  adminPaywallControlUpdate: builder.mutation({
    query:({id,data}) => ({
      url: `/admin/paywall/${id}`,
      method: 'PATCH',
      body: data,
    }),
    invalidatesTags: ['paywallControl'],
  }),
  adminPaywallControlDelete:builder.mutation({
    query:({id}) => ({
      url:`/admin/paywall/${id}`,
      method:"DELETE"
    }),
    invalidatesTags:['paywallControl']
  })
  })
})

export const {useAdminPaywallControlDeleteMutation,useAdminPaywallControlUpdateMutation,useAdminPaywallControlMutation,useAdminpaywallControlQuery,useAdminGetLogQuery,useAdminLogDeleteMutation,useAdminLogsQuery,useUserUnBanMutation,useUserBanMutation,useDeleteBanIpMutation,useCreateBanIpMutation,useAdminGetBanIpDetailsQuery,useAdminGetAllIdBanQuery,useGetCustomerDetailsQuery, useGetAllCustomerQuery,useGetProductQuery,useGetAllProductQuery,useCreatePlanMutation,useAllPlanQuery,useGetNoteQuery,useDeleteNoteMutation,useUpdateNoteMutation,useSetNotesMutation,useGetAllNotesQuery,useAdminGetAllNotificationsQuery,useDeleteNotificationMutation,useAdminSendUserNotificationMutation,useAdminAnnoucementMutation,useAdminGetAllAnnouncementsQuery,useDeleteAnnouncementMutation,useUpdateAnnouncementMutation,useAdminGetAllNotificationQuery} = adminNotification