// import { appApi } from "./aapApi";

// export const staffApi = appApi.injectEndpoints({
//   endpoints: (builder) => ({
//     staffLogin: builder.mutation({
//       query: (credentials) => ({
//         url: "/staff/login",
//         method: "POST",
//         body: credentials,
//       }),
//       invalidatesTags: ["IndoorPatients"],
//     }),

//     staffLogout: builder.mutation({
//       query: () => ({
//         url: "/staff/logout",
//         method: "POST",
//       }),
//     }),

//     getStaffDashboard: builder.query({
//       query: () => "/staff/dashboard",
//       providesTags: ["IndoorPatients"],
//     }),
//   }),
// });

// export const {
//   useStaffLoginMutation,
//   useGetStaffDashboardQuery,
//   useStaffLogoutMutation,
// } = staffApi;
import { appApi } from "./aapApi";

export const staffApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    staffLogin: builder.mutation({
      query: (credentials) => ({
        url: "/staff/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["IndoorPatients"],
    }),

    staffLogout: builder.mutation({
      query: () => ({
        url: "/staff/logout",
        method: "POST",
      }),
    }),

    getStaffDashboard: builder.query({
      query: () => "/staff/dashboard",
      providesTags: ["IndoorPatients"],
    }),
  }),
});

export const {
  useStaffLoginMutation,
  useGetStaffDashboardQuery,
  useStaffLogoutMutation,
} = staffApi;
