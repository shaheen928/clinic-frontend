// import { appApi } from "./aapApi";

// export const doctorApi = appApi.injectEndpoints({
//   endpoints: (builder) => ({
//     doctorLogin: builder.mutation({
//       query: (credentials) => ({
//         url: "/doctor/login",
//         method: "POST",
//         body: credentials,
//       }),
//     }),

//     getDoctorProfile: builder.query({
//       query: () => ({
//         url: "/doctor/get-profile",
//         method: "GET",
//       }),
//       providesTags: ["DoctorProfile"],
//     }),

//     getDoctorDashboard: builder.query({
//       query: () => ({
//         url: "/doctor/doctor-dashboard",
//         method: "GET",
//       }),
//       providesTags: ["DoctorProfile", "DoctorDashboard"],
//     }),

//     getDoctorAppointments: builder.query({
//       query: () => ({
//         url: "/doctor/appointments",
//         method: "GET",
//       }),
//       providesTags: ["DoctorAppointments"],
//     }),

//     doctorCompleteAppointment: builder.mutation({
//       query: (appointmentId) => ({
//         url: "/doctor/complete-appointment",
//         method: "POST",
//         body: { appointmentId },
//       }),
//       invalidatesTags: ["DoctorAppointments", "DoctorDashboard"],
//     }),

//     doctorCancelAppointment: builder.mutation({
//       query: (appointmentId) => ({
//         url: "/doctor/cancel-appoinrment",
//         method: "POST",
//         body: { appointmentId },
//       }),
//       invalidatesTags: ["DoctorAppointments", "DoctorDashboard"],
//     }),

//     blockDoctorSlots: builder.mutation({
//       query: (data) => ({
//         url: "/doctor/block-slots",
//         method: "POST",
//         body: data,
//       }),
//       invalidatesTags: ["DoctorProfile"],
//     }),

//     doctorUpdateSlotDuration: builder.mutation({
//       query: (data) => ({
//         url: "/doctor/update-duration",
//         method: "POST",
//         body: data,
//       }),
//       invalidatesTags: ["DoctorProfile"],
//     }),

//     doctorCreateAdmission: builder.mutation({
//       query: (admissionData) => ({
//         url: "/doctor/create-admission",
//         method: "POST",
//         body: admissionData,
//       }),
//       invalidatesTags: ["Appointments", "DoctorAppointments"],
//     }),

//     getDoctorAdmissions: builder.query({
//       query: () => ({
//         url: "/doctor/admissions-list",
//         method: "GET",
//       }),
//       providesTags: ["Admissions", "IndoorPatients"],
//     }),

//     doctorCompletePatientSurgery: builder.mutation({
//       query: (id) => ({
//         url: `/doctor/complete-surgery/${id}`,
//         method: "PUT",
//       }),
//       invalidatesTags: ["Admissions", "Appointments"],
//     }),

//     doctorDischargeInpatient: builder.mutation({
//       query: ({ id, dischargeNotes }) => ({
//         url: `/doctor/discharge-patient/${id}`,
//         method: "PUT",
//         body: { dischargeNotes },
//       }),
//       invalidatesTags: ["Admissions"],
//     }),

//     getDoctorTemplateBookedSlots: builder.query({
//       query: ({ date, theaterNo }) =>
//         `/doctor/booked-slots?date=${date}&theaterNo=${theaterNo}`,
//       providesTags: ["Appointments"],
//     }),

//     doctorMarkPatientRound: builder.mutation({
//       query: (admissionId) => ({
//         url: `/doctor/mark-round/${admissionId}`,
//         method: "POST",
//       }),
//       invalidatesTags: ["IndoorPatients", "DoctorDashboard"],
//     }),

//     DoctorAdmitPatient: builder.mutation({
//       query: (id) => ({
//         url: `/doctor/admissions/${id}/admit`,
//         method: "PATCH",
//       }),
//       invalidatesTags: ["Admissions"],
//     }),

//     doctorCancelSurgery: builder.mutation({
//       query: (admissionId) => ({
//         url: "/doctor/cancel-surgery",
//         method: "POST",
//         body: { admissionId },
//       }),
//       invalidatesTags: ["Dashboard"],
//     }),
//   }),
// });

// export const {
//   useDoctorLoginMutation,
//   useGetDoctorProfileQuery,
//   useGetDoctorDashboardQuery,
//   useGetDoctorAppointmentsQuery,
//   useDoctorCompleteAppointmentMutation,
//   useDoctorCancelAppointmentMutation,
//   useBlockDoctorSlotsMutation,
//   useDoctorUpdateSlotDurationMutation,
//   useDoctorCreateAdmissionMutation,
//   useGetDoctorAdmissionsQuery,
//   useDoctorCompletePatientSurgeryMutation,
//   useDoctorDischargeInpatientMutation,
//   useLazyGetDoctorTemplateBookedSlotsQuery,
//   useDoctorMarkPatientRoundMutation,
//   useDoctorAdmitPatientMutation,
//   useDoctorCancelSurgeryMutation,
// } = doctorApi;
import { appApi } from "./aapApi";

export const doctorApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    doctorLogin: builder.mutation({
      query: (credentials) => ({
        url: "/doctor/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["DoctorDashboard", "DoctorProfile"],
    }),

    getDoctorProfile: builder.query({
      query: () => ({
        url: "/doctor/get-profile",
        method: "GET",
      }),
      providesTags: ["DoctorProfile"],
    }),

    getDoctorDashboard: builder.query({
      query: () => ({
        url: "/doctor/doctor-dashboard",
        method: "GET",
      }),
      providesTags: ["DoctorProfile", "DoctorDashboard"],
    }),

    getDoctorAppointments: builder.query({
      query: () => ({
        url: "/doctor/appointments",
        method: "GET",
      }),
      providesTags: ["DoctorAppointments"],
    }),

    doctorCompleteAppointment: builder.mutation({
      query: (appointmentId) => ({
        url: "/doctor/complete-appointment",
        method: "POST",
        body: { appointmentId },
      }),
      invalidatesTags: ["DoctorAppointments", "DoctorDashboard", "Dashboard"],
    }),

    doctorCancelAppointment: builder.mutation({
      query: (appointmentId) => ({
        url: "/doctor/cancel-appoinrment",
        method: "POST",
        body: { appointmentId },
      }),
      invalidatesTags: ["DoctorAppointments", "DoctorDashboard", "Dashboard"],
    }),

    blockDoctorSlots: builder.mutation({
      query: (data) => ({
        url: "/doctor/block-slots",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["DoctorProfile", "DoctorDashboard"],
    }),

    doctorUpdateSlotDuration: builder.mutation({
      query: (data) => ({
        url: "/doctor/update-duration",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["DoctorProfile"],
    }),

    doctorCreateAdmission: builder.mutation({
      query: (admissionData) => ({
        url: "/doctor/create-admission",
        method: "POST",
        body: admissionData,
      }),
      invalidatesTags: [
        "Appointments",
        "DoctorAppointments",
        "Admissions",
        "DoctorDashboard",
      ],
    }),

    getDoctorAdmissions: builder.query({
      query: () => ({
        url: "/doctor/admissions-list",
        method: "GET",
      }),
      providesTags: ["Admissions", "IndoorPatients"],
    }),

    doctorCompletePatientSurgery: builder.mutation({
      query: (id) => ({
        url: `/doctor/complete-surgery/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["Admissions", "Appointments", "DoctorDashboard"],
    }),

    doctorDischargeInpatient: builder.mutation({
      query: ({ id, dischargeNotes }) => ({
        url: `/doctor/discharge-patient/${id}`,
        method: "PUT",
        body: { dischargeNotes },
      }),
      invalidatesTags: ["Admissions", "IndoorPatients", "DoctorDashboard"],
    }),

    getDoctorTemplateBookedSlots: builder.query({
      query: ({ date, theaterNo }) =>
        `/doctor/booked-slots?date=${date}&theaterNo=${theaterNo}`,
      providesTags: ["Appointments"],
    }),

    doctorMarkPatientRound: builder.mutation({
      query: (admissionId) => ({
        url: `/doctor/mark-round/${admissionId}`,
        method: "POST",
      }),
      invalidatesTags: ["IndoorPatients", "DoctorDashboard", "LiveBill"],
    }),

    DoctorAdmitPatient: builder.mutation({
      query: (id) => ({
        url: `/doctor/admissions/${id}/admit`,
        method: "PATCH",
      }),
      invalidatesTags: ["Admissions", "IndoorPatients", "DoctorDashboard"],
    }),

    doctorCancelSurgery: builder.mutation({
      query: (admissionId) => ({
        url: "/doctor/cancel-surgery",
        method: "POST",
        body: { admissionId },
      }),
      invalidatesTags: ["Dashboard", "DoctorDashboard", "Admissions"],
    }),
  }),
});

export const {
  useDoctorLoginMutation,
  useGetDoctorProfileQuery,
  useGetDoctorDashboardQuery,
  useGetDoctorAppointmentsQuery,
  useDoctorCompleteAppointmentMutation,
  useDoctorCancelAppointmentMutation,
  useBlockDoctorSlotsMutation,
  useDoctorUpdateSlotDurationMutation,
  useDoctorCreateAdmissionMutation,
  useGetDoctorAdmissionsQuery,
  useDoctorCompletePatientSurgeryMutation,
  useDoctorDischargeInpatientMutation,
  useLazyGetDoctorTemplateBookedSlotsQuery,
  useDoctorMarkPatientRoundMutation,
  useDoctorAdmitPatientMutation,
  useDoctorCancelSurgeryMutation,
} = doctorApi;
