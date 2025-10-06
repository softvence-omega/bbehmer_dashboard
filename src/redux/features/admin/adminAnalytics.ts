import { baseApi } from '../../api/baseApi';

const adminAnalytics = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    adminUserActivity: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item: any) => {
            params.append(item.name, item.value);
          });
        }
        return {
          url: '/admin/analytics/user/active',
          method: 'GET',
          params,
        };
      },
      providesTags: ['coffeeShop'],
    }),
    adminUserActivityTrand: builder.query({
      query: (args: { cohortDate: Date | string; retentionDay?: number }) => {
        const params = new URLSearchParams();

        if (args) {
          if (args.cohortDate) {
            const dateStr =
              typeof args.cohortDate === 'string'
                ? args.cohortDate
                : args.cohortDate.toISOString().split('T')[0]; // Convert Date to 'YYYY-MM-DD'
            params.append('cohortDate', dateStr);
          }
          if (args.retentionDay !== undefined) {
            params.append('retentionDay', String(args.retentionDay));
          }
        }

        return {
          url: '/admin/analytics/user/churn',
          method: 'GET',
          params,
        };
      },
    }),
    adminUserRetention: builder.query({
      query: (args: { cohortDate: Date | string; retentionDay?: number }) => {
        const params = new URLSearchParams();

        if (args) {
          if (args.cohortDate) {
            const dateStr =
              typeof args.cohortDate === 'string'
                ? args.cohortDate
                : args.cohortDate.toISOString().split('T')[0]; // Convert Date to 'YYYY-MM-DD'
            params.append('cohortDate', dateStr);
          }
          if (args.retentionDay !== undefined) {
            params.append('retentionDay', String(args.retentionDay));
          }
        }

        return {
          url: '/admin/analytics/user/retention',
          method: 'GET',
          params,
        };
      },
    }),
    adminUserGrowth: builder.query({
      query: () => {
        return {
          url: '/admin/analytics/user/growth',
          method: 'GET',
        };
      },
    }),
    adminPlanLimits: builder.query({
      query: () => ({
        url: '/admin/plan-limits',
        method: 'GET',
      }),
      providesTags: ['PlanLimits'],
    }),
    adminPlanDetails: builder.query({
      query: ({ id }) => ({
        url: `/admin/plan-limits?${id}`,
        method: 'GET',
      }),
    }),
    adminUpdatePlanLimit: builder.mutation({
      query: (data: {
        id: string;
        plan: string;
        maxLogsPerMonth: number;
        dataRetentionDays: number;
      }) => ({
        url: `/admin/plan-limits/update/${data.id}`,
        method: 'PATCH',
        body: {
          plan: data.plan,
          maxLogsPerMonth: data.maxLogsPerMonth,
          dataRetentionDays: data.dataRetentionDays,
        },
      }),
      invalidatesTags: ['PlanLimits'],
    }),
  }),
});

export const {
  useAdminPlanDetailsQuery,
  useAdminUpdatePlanLimitMutation,
  useAdminPlanLimitsQuery,
  useAdminUserActivityTrandQuery,
  useAdminUserGrowthQuery,
  useAdminUserActivityQuery,
  useAdminUserRetentionQuery,
} = adminAnalytics;
