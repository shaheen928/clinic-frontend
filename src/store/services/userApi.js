// import { appApi } from "./aapApi";

// export const userApi = appApi.injectEndpoints({
//   endpoints: (builder) => ({
//     fetchAllDoctors: builder.query({
//       query: () => ({
//         url: "/user/doctors",
//         method: "GET",
//       }),
//       providesTags: ["Doctors", "DoctorProfile"],
//     }),

//     registerUser: builder.mutation({
//       query: (userData) => ({
//         url: "/user/register",
//         method: "POST",
//         body: userData,
//       }),
//       invalidatesTags: ["Appointments"],
//     }),

//     loginUser: builder.mutation({
//       query: (credentials) => ({
//         url: "/user/login",
//         method: "POST",
//         body: credentials,
//       }),
//     }),

//     updateProfile: builder.mutation({
//       query: (profileData) => ({
//         url: "/user/update-profile",
//         method: "PUT",
//         body: profileData,
//       }),
//       invalidatesTags: ["DoctorProfile"],
//     }),

//     getDoctorDetails: builder.query({
//       query: (id) => `/user/doctors/${id}`,
//     }),

//     createAppointment: builder.mutation({
//       query: (appointmentData) => ({
//         url: "/user/book-appointment",
//         method: "POST",
//         body: appointmentData,
//       }),
//       invalidatesTags: ["Appointments"],
//     }),

//     verifyStripe: builder.mutation({
//       query: (data) => ({
//         url: "/user/verify-stripe",
//         method: "POST",
//         body: data,
//       }),
//     }),

//     getMyAppointments: builder.query({
//       query: () => ({
//         url: "/user/appointments",
//         method: "GET",
//       }),
//       providesTags: ["Appointments"],
//     }),

//     cancelAppointment: builder.mutation({
//       query: (data) => ({
//         url: "/user/cancel-appointment",
//         method: "PUT",
//         body: data,
//       }),
//       invalidatesTags: ["Appointments"],
//     }),

//     payWithStripe: builder.mutation({
//       query: (data) => ({
//         url: "/user/pay-appointment",
//         method: "POST",
//         body: data,
//       }),
//     }),

//     sendOTP: builder.mutation({
//       query: (data) => ({
//         url: "/user/send-otp",
//         method: "POST",
//         body: data,
//       }),
//     }),

//     resetPassword: builder.mutation({
//       query: (data) => ({
//         url: "/user/reset-password",
//         method: "POST",
//         body: data,
//       }),
//     }),

//     getUserLiveBill: builder.query({
//       query: (appointmentId) => ({
//         url: `/user/live-bill/${appointmentId}`,
//         method: "GET",
//       }),
//       providesTags: ["LiveBill"],
//     }),

//     payIndoorBill: builder.mutation({
//       query: ({ appointmentId }) => ({
//         url: "/user/pay-indoor-bill",
//         method: "POST",
//         body: { appointmentId },
//       }),
//     }),

//     verifyIndoorBill: builder.mutation({
//       query: (paymentData) => ({
//         url: "/user/verify-indoor-bill",
//         method: "POST",
//         body: paymentData,
//       }),
//       invalidatesTags: ["Appointments", "LiveBill"],
//     }),
//   }),
// });

// export const {
//   useFetchAllDoctorsQuery,
//   useRegisterUserMutation,
//   useLoginUserMutation,
//   useUpdateProfileMutation,
//   useCreateAppointmentMutation,
//   useGetDoctorDetailsQuery,
//   useVerifyStripeMutation,
//   useGetMyAppointmentsQuery,
//   useCancelAppointmentMutation,
//   usePayWithStripeMutation,
//   useSendOTPMutation,
//   useResetPasswordMutation,
//   useGetUserLiveBillQuery,
//   usePayIndoorBillMutation,
//   useVerifyIndoorBillMutation,
// } = userApi;
import { appApi } from "./aapApi";

export const userApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchAllDoctors: builder.query({
      query: () => ({
        url: "/user/doctors",
        method: "GET",
      }),
      providesTags: ["Doctors", "DoctorProfile"],
    }),

    registerUser: builder.mutation({
      query: (userData) => ({
        url: "/user/register",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["Appointments"],
    }),

    loginUser: builder.mutation({
      query: (credentials) => ({
        url: "/user/login",
        method: "POST",
        body: credentials,
      }),
    }),

    updateProfile: builder.mutation({
      query: (profileData) => ({
        url: "/user/update-profile",
        method: "PUT",
        body: profileData,
      }),
      invalidatesTags: ["DoctorProfile"],
    }),

    getDoctorDetails: builder.query({
      query: (id) => `/user/doctors/${id}`,
      providesTags: (result, error, id) => [{ type: "Doctors", id }],
    }),

    createAppointment: builder.mutation({
      query: (appointmentData) => ({
        url: "/user/book-appointment",
        method: "POST",
        body: appointmentData,
      }),
      invalidatesTags: ["Appointments", "Dashboard", "DoctorDashboard"],
    }),

    verifyStripe: builder.mutation({
      query: (data) => ({
        url: "/user/verify-stripe",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Appointments", "Dashboard", "DoctorDashboard"],
    }),

    getMyAppointments: builder.query({
      query: () => ({
        url: "/user/appointments",
        method: "GET",
      }),
      providesTags: ["Appointments"],
    }),

    cancelAppointment: builder.mutation({
      query: (data) => ({
        url: "/user/cancel-appointment",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Appointments", "Dashboard", "DoctorDashboard"],
    }),

    payWithStripe: builder.mutation({
      query: (data) => ({
        url: "/user/pay-appointment",
        method: "POST",
        body: data,
      }),
    }),

    sendOTP: builder.mutation({
      query: (data) => ({
        url: "/user/send-otp",
        method: "POST",
        body: data,
      }),
    }),

    resetPassword: builder.mutation({
      query: (data) => ({
        url: "/user/reset-password",
        method: "POST",
        body: data,
      }),
    }),

    getUserLiveBill: builder.query({
      query: (appointmentId) => ({
        url: `/user/live-bill/${appointmentId}`,
        method: "GET",
      }),
      providesTags: ["LiveBill"],
    }),

    payIndoorBill: builder.mutation({
      query: ({ appointmentId }) => ({
        url: "/user/pay-indoor-bill",
        method: "POST",
        body: { appointmentId },
      }),
    }),

    verifyIndoorBill: builder.mutation({
      query: (paymentData) => ({
        url: "/user/verify-indoor-bill",
        method: "POST",
        body: paymentData,
      }),
      invalidatesTags: ["Appointments", "LiveBill", "Admissions", "Dashboard"],
    }),
  }),
});

export const {
  useFetchAllDoctorsQuery,
  useRegisterUserMutation,
  useLoginUserMutation,
  useUpdateProfileMutation,
  useCreateAppointmentMutation,
  useGetDoctorDetailsQuery,
  useVerifyStripeMutation,
  useGetMyAppointmentsQuery,
  useCancelAppointmentMutation,
  usePayWithStripeMutation,
  useSendOTPMutation,
  useResetPasswordMutation,
  useGetUserLiveBillQuery,
  usePayIndoorBillMutation,
  useVerifyIndoorBillMutation,
} = userApi;
