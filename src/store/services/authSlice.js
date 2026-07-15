import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  adminToken: localStorage.getItem("adminToken") || null,
  isAdminAuthenticated: !!localStorage.getItem("adminToken"),

  doctorToken: localStorage.getItem("doctorToken") || null,
  isDoctorAuthenticated: !!localStorage.getItem("doctorToken"),

  staffToken: localStorage.getItem("staffToken") || null,
  isStaffAuthenticated: !!localStorage.getItem("staffToken"),

  userToken: localStorage.getItem("userToken") || null,
  isUserAuthenticated: !!localStorage.getItem("userToken"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAdminToken: (state, action) => {
      state.adminToken = action.payload;
      state.isAdminAuthenticated = true;
      localStorage.setItem("adminToken", action.payload);
    },
    logoutAdmin: (state) => {
      state.adminToken = null;
      state.isAdminAuthenticated = false;
      localStorage.removeItem("adminToken");
    },

    setDoctorToken: (state, action) => {
      state.doctorToken = action.payload;
      state.isDoctorAuthenticated = true;
      localStorage.setItem("doctorToken", action.payload);
    },
    logoutDoctor: (state) => {
      state.doctorToken = null;
      state.isDoctorAuthenticated = false;
      localStorage.removeItem("doctorToken");
    },

    setStaffToken: (state, action) => {
      state.staffToken = action.payload;
      state.isStaffAuthenticated = true;
      localStorage.setItem("staffToken", action.payload);
    },
    logoutStaff: (state) => {
      state.staffToken = null;
      state.isStaffAuthenticated = false;
      localStorage.removeItem("staffToken");
    },

    setUserToken: (state, action) => {
      state.userToken = action.payload;
      state.isUserAuthenticated = true;
      localStorage.setItem("userToken", action.payload);
    },
    logoutUser: (state) => {
      state.userToken = null;
      state.isUserAuthenticated = false;
      localStorage.removeItem("userToken");
    },
  },
});

export const {
  setAdminToken,
  logoutAdmin,
  setDoctorToken,
  logoutDoctor,
  setStaffToken,
  logoutStaff,
  setUserToken,
  logoutUser,
} = authSlice.actions;

export default authSlice.reducer;
