import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const appApi = createApi({
  reducerPath: "appApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState, endpoint }) => {
      const adminToken = getState().auth?.adminToken;
      const doctorToken = getState().auth?.doctorToken;
      const staffToken = getState().auth?.staffToken;
      const userToken = getState().auth?.userToken;

      const endpoints = endpoint.toLocaleLowerCase();

      if (endpoints.includes("admin") && adminToken) {
        headers.set("Authorization", `Bearer ${adminToken}`);
      } else if (endpoints.includes("doctor") && doctorToken) {
        headers.set("Authorization", `Bearer ${doctorToken}`);
      } else if (endpoints.includes("staff") && staffToken) {
        headers.set("Authorization", `Bearer ${staffToken}`);
      } else if (userToken) {
        headers.set("Authorization", `Bearer ${userToken}`);
      }

      return headers;
    },
  }),
  tagTypes: [
    "Doctors",
    "Appointments",
    "Dashboard",
    "DoctorProfile",
    "DoctorDashboard",
    "DoctorAppointments",
    "Staff",
    "Beds",
    "IndoorPatients",
    "LiveBill",
    "Admissions",
    "Duties",
    "StaffSalary",
    "HospitalExpense",
    "DoctorPayout",
  ],
  endpoints: () => ({}),
});
