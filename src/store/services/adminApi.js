// import { appApi } from "./aapApi";

// export const adminApi = appApi.injectEndpoints({
//   endpoints: (builder) => ({
//     adminLogin: builder.mutation({
//       query: (credentials) => ({
//         url: "/admin/login",
//         method: "POST",
//         body: credentials,
//       }),
//     }),

//     getAdminDashboard: builder.query({
//       query: () => ({
//         url: "/admin/admin-dashboard",
//         method: "GET",
//       }),
//       providesTags: ["Dashboard"],
//     }),

//     getAllDoctorsForAdmin: builder.query({
//       query: () => ({
//         url: "/admin/all-doctors",
//         method: "GET",
//       }),
//       providesTags: ["Doctors"],
//     }),

//     adminAddDoctor: builder.mutation({
//       query: (doctorData) => ({
//         url: "/admin/add-doctor",
//         method: "POST",
//         body: doctorData,
//       }),
//       invalidatesTags: ["Doctors"],
//     }),

//     changeAvailabilityByAdmin: builder.mutation({
//       query: (body) => ({
//         url: "/admin/change-availability",
//         method: "POST",
//         body: body,
//       }),
//       invalidatesTags: ["Doctors", "DoctorProfile"],
//     }),

//     getAdminAppointments: builder.query({
//       query: () => ({
//         url: "/admin/appointments",
//         method: "GET",
//       }),
//       providesTags: ["Appointments"],
//     }),

//     getDoctorInfo: builder.query({
//       query: (docId) => ({
//         url: `/admin/doctor-info/${docId}`,
//         method: "GET",
//       }),
//       providesTags: (result, error, docId) => [{ type: "Doctors", id: docId }],
//     }),

//     updateDoctorSchedule: builder.mutation({
//       query: ({ docId, weeklySchedule }) => ({
//         url: "/admin/update-schedule",
//         method: "POST",
//         body: { docId, weeklySchedule },
//       }),
//       invalidatesTags: (result, error, { docId }) => [
//         "Doctors",
//         { type: "Doctors", id: docId },
//       ],
//     }),

//     addStaff: builder.mutation({
//       query: (staffData) => ({
//         url: "/admin/add-staff",
//         method: "POST",
//         body: staffData,
//       }),
//       invalidatesTags: ["Staff"],
//     }),

//     getAllStaff: builder.query({
//       query: (params) => ({
//         url: "/admin/all-staff",
//         method: "GET",
//         params: params,
//       }),
//       providesTags: ["Staff", "StaffSalary"],
//     }),

//     changeStaffStatus: builder.mutation({
//       query: (staffId) => ({
//         url: "/admin/change-staff-status",
//         method: "POST",
//         body: { staffId },
//       }),
//       invalidatesTags: ["Staff"],
//     }),

//     adminGetAllBeds: builder.query({
//       query: () => ({
//         url: "/admin/get-beds",
//         method: "GET",
//       }),
//       providesTags: ["Beds"],
//     }),

//     adminAddBed: builder.mutation({
//       query: (newBed) => ({
//         url: "/admin/add-bed",
//         method: "POST",
//         body: newBed,
//       }),
//       invalidatesTags: ["Beds"],
//     }),

//     adminUpdateBed: builder.mutation({
//       query: ({ bedId, updatedData }) => ({
//         url: `/admin/update-bed/${bedId}`,
//         method: "PUT",
//         body: updatedData,
//       }),
//       invalidatesTags: ["Beds"],
//     }),

//     updateDoctorByAdmin: builder.mutation({
//       query: ({ docId, updatedData }) => ({
//         url: `/admin/update-doctor/${docId}`,
//         method: "PUT",
//         body: updatedData,
//       }),
//       invalidatesTags: ["Doctors"],
//     }),

//     adminUpdateStaff: builder.mutation({
//       query: ({ staffId, updatedData }) => ({
//         url: `/admin/update-staff/${staffId}`,
//         method: "PUT",
//         body: updatedData,
//       }),
//       invalidatesTags: ["Staff"],
//     }),

//     getAdminAdmissions: builder.query({
//       query: () => "/admin/admissions",
//       providesTags: ["Admissions"],
//     }),

//     adminAllocateBed: builder.mutation({
//       query: (body) => ({
//         url: "/admin/admissions/allocate-bed",
//         method: "POST",
//         body,
//       }),
//       invalidatesTags: ["Admissions", "Beds"],
//     }),

//     adminAssignStaffDuty: builder.mutation({
//       query: (body) => ({
//         url: "/admin/staff/assign-duty",
//         method: "POST",
//         body,
//       }),
//       invalidatesTags: ["Duties"],
//     }),

//     adminGetAwaitingAdmissions: builder.query({
//       query: () => "/admin/admissions/awaiting",
//       providesTags: ["Admissions"],
//     }),

//     adminUpdatePatientLocation: builder.mutation({
//       query: (body) => ({
//         url: "/admin/admissions/update-location",
//         method: "PUT",
//         body,
//       }),
//       invalidatesTags: ["Admissions"],
//     }),

//     adminPayDoctor: builder.mutation({
//       query: (payoutData) => ({
//         url: "/admin/pay-doctor",
//         method: "POST",
//         body: payoutData,
//       }),
//       invalidatesTags: ["DoctorPayout", "Doctors"],
//     }),

//     adminPayStaffSalary: builder.mutation({
//       query: (salaryData) => ({
//         url: "/admin/pay-staff",
//         method: "POST",
//         body: salaryData,
//       }),
//       invalidatesTags: ["StaffSalary", "Staff"],
//     }),

//     adminGetStaffSalariesByMonth: builder.query({
//       query: (month) => `/admin/staff-salaries?month=${month}`,
//       providesTags: ["StaffSalary"],
//     }),

//     adminAddExpense: builder.mutation({
//       query: (expenseData) => ({
//         url: "/admin/add-expense",
//         method: "POST",
//         body: expenseData,
//       }),
//       invalidatesTags: ["HospitalExpense"],
//     }),

//     adminGetAllExpenses: builder.query({
//       query: (params) => ({
//         url: "/admin/expenses",
//         method: "GET",
//         params: params,
//       }),
//       providesTags: ["HospitalExpense"],
//     }),

//     getAdminLiveBill: builder.query({
//       query: (admissionId) => ({
//         url: `/admin/live-bill/${admissionId}`,
//         method: "GET",
//       }),
//       providesTags: ["LiveBill"],
//     }),

//     adminMarkBillAsPaid: builder.mutation({
//       query: (admissionId) => ({
//         url: "/admin/mark-paid",
//         method: "POST",
//         body: { admissionId },
//       }),
//       invalidatesTags: ["LiveBill"],
//     }),

//     getAdminBillingDashboard: builder.query({
//       query: () => ({
//         url: "/admin/billing-dashboard",
//         method: "GET",
//       }),
//       providesTags: ["LiveBill"],
//     }),

//     adminMarkAppointmentAsPaid: builder.mutation({
//       query: (appointmentId) => ({
//         url: "/admin/mark-appointment-paid",
//         method: "POST",
//         body: { appointmentId },
//       }),
//       invalidatesTags: ["LiveBill"],
//     }),
//   }),
// });

// export const {
//   useAdminLoginMutation,
//   useGetAdminDashboardQuery,
//   useGetAllDoctorsForAdminQuery,
//   useAdminAddDoctorMutation,
//   useChangeAvailabilityByAdminMutation,
//   useGetAdminAppointmentsQuery,
//   useGetDoctorInfoQuery,
//   useUpdateDoctorScheduleMutation,
//   useAddStaffMutation,
//   useGetAllStaffQuery,
//   useChangeStaffStatusMutation,
//   useAdminAddBedMutation,
//   useAdminGetAllBedsQuery,
//   useAdminUpdateBedMutation,
//   useUpdateDoctorByAdminMutation,
//   useAdminUpdateStaffMutation,
//   useGetAdminAdmissionsQuery,
//   useAdminAllocateBedMutation,
//   useAdminAssignStaffDutyMutation,
//   useAdminGetAwaitingAdmissionsQuery,
//   useAdminUpdatePatientLocationMutation,
//   useAdminPayDoctorMutation,
//   useAdminPayStaffSalaryMutation,
//   useAdminGetStaffSalariesByMonthQuery,
//   useAdminAddExpenseMutation,
//   useAdminGetAllExpensesQuery,
//   useGetAdminLiveBillQuery,
//   useAdminMarkBillAsPaidMutation,
//   useGetAdminBillingDashboardQuery,
//   useAdminMarkAppointmentAsPaidMutation,
// } = adminApi;
import { appApi } from "./aapApi"; // نوٹ: آپ کی فائل کا نام یہاں 'aapApi' ہے، اس کو ایسے ہی رہنے دیا ہے

export const adminApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    adminLogin: builder.mutation({
      query: (credentials) => ({
        url: "/admin/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Dashboard"], // لاگ ان پر ڈیش بورڈ ریفریش ہو
    }),

    getAdminDashboard: builder.query({
      query: () => ({
        url: "/admin/admin-dashboard",
        method: "GET",
      }),
      providesTags: ["Dashboard"],
    }),

    getAllDoctorsForAdmin: builder.query({
      query: () => ({
        url: "/admin/all-doctors",
        method: "GET",
      }),
      providesTags: ["Doctors"],
    }),

    adminAddDoctor: builder.mutation({
      query: (doctorData) => ({
        url: "/admin/add-doctor",
        method: "POST",
        body: doctorData,
      }),
      invalidatesTags: ["Doctors", "Dashboard"], // نیا ڈاکٹر آنے پر ڈیش بورڈ بھی بدلے گا
    }),

    changeAvailabilityByAdmin: builder.mutation({
      query: (body) => ({
        url: "/admin/change-availability",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Doctors", "DoctorProfile", "Dashboard"],
    }),

    getAdminAppointments: builder.query({
      query: () => ({
        url: "/admin/appointments",
        method: "GET",
      }),
      providesTags: ["Appointments"],
    }),

    getDoctorInfo: builder.query({
      query: (docId) => ({
        url: `/admin/doctor-info/${docId}`,
        method: "GET",
      }),
      providesTags: (result, error, docId) => [{ type: "Doctors", id: docId }],
    }),

    updateDoctorSchedule: builder.mutation({
      query: ({ docId, weeklySchedule }) => ({
        url: "/admin/update-schedule",
        method: "POST",
        body: { docId, weeklySchedule },
      }),
      invalidatesTags: (result, error, { docId }) => [
        "Doctors",
        { type: "Doctors", id: docId },
      ],
    }),

    addStaff: builder.mutation({
      query: (staffData) => ({
        url: "/admin/add-staff",
        method: "POST",
        body: staffData,
      }),
      invalidatesTags: ["Staff", "Dashboard"],
    }),

    getAllStaff: builder.query({
      query: (params) => ({
        url: "/admin/all-staff",
        method: "GET",
        params: params,
      }),
      providesTags: ["Staff", "StaffSalary"],
    }),

    changeStaffStatus: builder.mutation({
      query: (staffId) => ({
        url: "/admin/change-staff-status",
        method: "POST",
        body: { staffId },
      }),
      invalidatesTags: ["Staff"],
    }),

    adminGetAllBeds: builder.query({
      query: () => ({
        url: "/admin/get-beds",
        method: "GET",
      }),
      providesTags: ["Beds"],
    }),

    adminAddBed: builder.mutation({
      query: (newBed) => ({
        url: "/admin/add-bed",
        method: "POST",
        body: newBed,
      }),
      invalidatesTags: ["Beds"],
    }),

    adminUpdateBed: builder.mutation({
      query: ({ bedId, updatedData }) => ({
        url: `/admin/update-bed/${bedId}`,
        method: "PUT",
        body: updatedData,
      }),
      invalidatesTags: ["Beds"],
    }),

    updateDoctorByAdmin: builder.mutation({
      query: ({ docId, updatedData }) => ({
        url: `/admin/update-doctor/${docId}`,
        method: "PUT",
        body: updatedData,
      }),
      invalidatesTags: ["Doctors"],
    }),

    adminUpdateStaff: builder.mutation({
      query: ({ staffId, updatedData }) => ({
        url: `/admin/update-staff/${staffId}`,
        method: "PUT",
        body: updatedData,
      }),
      invalidatesTags: ["Staff"],
    }),

    getAdminAdmissions: builder.query({
      query: () => "/admin/admissions",
      providesTags: ["Admissions"],
    }),

    adminAllocateBed: builder.mutation({
      query: (body) => ({
        url: "/admin/admissions/allocate-bed",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Admissions", "Beds", "Dashboard"], // بیڈ خالی/بک ہونے پر ڈیش بورڈ اپڈیٹ ہو
    }),

    adminAssignStaffDuty: builder.mutation({
      query: (body) => ({
        url: "/admin/staff/assign-duty",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Duties", "Staff"],
    }),

    adminGetAwaitingAdmissions: builder.query({
      query: () => "/admin/admissions/awaiting",
      providesTags: ["Admissions"],
    }),

    adminUpdatePatientLocation: builder.mutation({
      query: (body) => ({
        url: "/admin/admissions/update-location",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Admissions"],
    }),

    adminPayDoctor: builder.mutation({
      query: (payoutData) => ({
        url: "/admin/pay-doctor",
        method: "POST",
        body: payoutData,
      }),
      invalidatesTags: ["DoctorPayout", "Doctors", "Dashboard"],
    }),

    adminPayStaffSalary: builder.mutation({
      query: (salaryData) => ({
        url: "/admin/pay-staff",
        method: "POST",
        body: salaryData,
      }),
      invalidatesTags: ["StaffSalary", "Staff", "Dashboard"],
    }),

    adminGetStaffSalariesByMonth: builder.query({
      query: (month) => `/admin/staff-salaries?month=${month}`,
      providesTags: ["StaffSalary"],
    }),

    adminAddExpense: builder.mutation({
      query: (expenseData) => ({
        url: "/admin/add-expense",
        method: "POST",
        body: expenseData,
      }),
      invalidatesTags: ["HospitalExpense", "Dashboard"],
    }),

    adminGetAllExpenses: builder.query({
      query: (params) => ({
        url: "/admin/expenses",
        method: "GET",
        params: params,
      }),
      providesTags: ["HospitalExpense"],
    }),

    getAdminLiveBill: builder.query({
      query: (admissionId) => ({
        url: `/admin/live-bill/${admissionId}`,
        method: "GET",
      }),
      providesTags: ["LiveBill"],
    }),

    adminMarkBillAsPaid: builder.mutation({
      query: (admissionId) => ({
        url: "/admin/mark-paid",
        method: "POST",
        body: { admissionId },
      }),
      invalidatesTags: ["LiveBill", "Admissions", "Dashboard"], // بل پے ہونے پر بل، ایڈمیشن اور ڈیش بورڈ سب اپڈیٹ ہوں
    }),

    getAdminBillingDashboard: builder.query({
      query: () => ({
        url: "/admin/billing-dashboard",
        method: "GET",
      }),
      providesTags: ["LiveBill"],
    }),

    adminMarkAppointmentAsPaid: builder.mutation({
      query: (appointmentId) => ({
        url: "/admin/mark-appointment-paid",
        method: "POST",
        body: { appointmentId },
      }),
      invalidatesTags: ["Appointments", "LiveBill", "Dashboard"], // اپائنٹمنٹ بلنگ اپڈیٹ ہو
    }),
  }),
});

export const {
  useAdminLoginMutation,
  useGetAdminDashboardQuery,
  useGetAllDoctorsForAdminQuery,
  useAdminAddDoctorMutation,
  useChangeAvailabilityByAdminMutation,
  useGetAdminAppointmentsQuery,
  useGetDoctorInfoQuery,
  useUpdateDoctorScheduleMutation,
  useAddStaffMutation,
  useGetAllStaffQuery,
  useChangeStaffStatusMutation,
  useAdminAddBedMutation,
  useAdminGetAllBedsQuery,
  useAdminUpdateBedMutation,
  useUpdateDoctorByAdminMutation,
  useAdminUpdateStaffMutation,
  useGetAdminAdmissionsQuery,
  useAdminAllocateBedMutation,
  useAdminAssignStaffDutyMutation,
  useAdminGetAwaitingAdmissionsQuery,
  useAdminUpdatePatientLocationMutation,
  useAdminPayDoctorMutation,
  useAdminPayStaffSalaryMutation,
  useAdminGetStaffSalariesByMonthQuery,
  useAdminAddExpenseMutation,
  useAdminGetAllExpensesQuery,
  useGetAdminLiveBillQuery,
  useAdminMarkBillAsPaidMutation,
  useGetAdminBillingDashboardQuery,
  useAdminMarkAppointmentAsPaidMutation,
} = adminApi;