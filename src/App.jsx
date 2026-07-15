import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from "react-router-dom";
import Login from "./pages/admin/Login";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminProtectedRoute from "./copmponents/adminCompontents/AdminProtectedRoute";
import ManageDoctors from "./copmponents/adminCompontents/ManageDoctors";
import AdminDashboard from "./copmponents/adminCompontents/AdminDashboard";

import DoctorLayout from "./pages/doctor/DoctorLayout";
import DoctorProtectedRoute from "./copmponents/doctorComponents/DoctorProtectedRoute";
import DoctorDashboard from "./copmponents/doctorComponents/DoctorDashboard";
import EditDoctorSchedule from "./copmponents/adminCompontents/EditDoctorSchedule";
import ManageStaff from "./copmponents/adminCompontents/ManageStaff";
import AddStaff from "./copmponents/adminCompontents/AddStaff";
import ManageBeds from "./copmponents/adminCompontents/ManageBeds";

import UserLogin from "./pages/user/UserLogin";
import UserRegister from "./pages/user/UserRegister";
import UserLayout from "./pages/user/UserLayout";
import BookAppointment from "./copmponents/userCopmponents/BookAppointment";
import UserProtectedRoute from "./copmponents/userCopmponents/UserProtectedRoute";
import VerifyStripe from "./copmponents/userCopmponents/VerifyStripe";
import MyAppointments from "./copmponents/userCopmponents/MyAppointments";
import InpatientsManager from "./copmponents/doctorComponents/InpatientsManager";
import AdminAdmissionsManager from "./copmponents/adminCompontents/AdminAdmissionsManager";
import AdminStaffScheduler from "./copmponents/adminCompontents/AdminStaffScheduler";
import FinancialDashboard from "./copmponents/adminCompontents/FinancialDashboard";
import AdminBillingDashboard from "./copmponents/adminCompontents/AdminBillingDashboard";
import StaffProtectedRoute from "./copmponents/staffCompontent/StaffProtectedRoute";
import Home from "./copmponents/userCopmponents/Home";
import DoctorDetail from "./copmponents/userCopmponents/DoctorDetail";
import DoctorAppointments from "./copmponents/doctorComponents/DoctorAppointments";
import DoctorProfile from "./copmponents/doctorComponents/DoctorProfile";
import AddDoctor from "./copmponents/adminCompontents/AddDoctor";
import AllAppointments from "./copmponents/adminCompontents/AllAppointments";
import AddBed from "./copmponents/adminCompontents/AddBed";
import VerifyIndoorStripe from "./copmponents/userCopmponents/VerifyIndoorStripe";
import StaffDashboard from "./copmponents/staffCompontent/StaffDashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <UserLayout />,
    children: [
      { path: "", element: <Home /> },
      { path: "user-login", element: <UserLogin /> },
      { path: "user-register", element: <UserRegister /> },
      { path: "doctor-detail/:id", element: <DoctorDetail /> },
      {
        path: "book-appointment/:id",
        element: (
          <UserProtectedRoute>
            <BookAppointment />
          </UserProtectedRoute>
        ),
      },
      { path: "verify-stripe", element: <VerifyStripe /> },
      {
        path: "my-appointments",
        element: (
          <UserProtectedRoute>
            <MyAppointments />
          </UserProtectedRoute>
        ),
      },
      { path: "verify-indoor-stripe", element: <VerifyIndoorStripe /> },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },

  {
    path: "/staff/dashboard",
    element: (
      <StaffProtectedRoute>
        <StaffDashboard />
      </StaffProtectedRoute>
    ),
  },

  {
    path: "/admin",
    element: (
      <AdminProtectedRoute>
        <AdminLayout />
      </AdminProtectedRoute>
    ),
    children: [
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "doctors", element: <ManageDoctors /> },
      { path: "add-doctor", element: <AddDoctor /> },
      { path: "appointments", element: <AllAppointments /> },
      { path: "edit-doctor-schedule/:docId", element: <EditDoctorSchedule /> },
      { path: "staff", element: <ManageStaff /> },
      { path: "add-staff", element: <AddStaff /> },
      { path: "beds", element: <ManageBeds /> },
      { path: "add-bed", element: <AddBed /> },
      { path: "admissions", element: <AdminAdmissionsManager /> },
      { path: "duty-schedules", element: <AdminStaffScheduler /> },
      { path: "finance-control-center", element: <FinancialDashboard /> },
      { path: "counter-billing", element: <AdminBillingDashboard /> },
    ],
  },

  {
    path: "/doctor",
    element: (
      <DoctorProtectedRoute>
        <DoctorLayout />
      </DoctorProtectedRoute>
    ),
    children: [
      { path: "dashboard", element: <DoctorDashboard /> },
      { path: "appointments", element: <DoctorAppointments /> },
      { path: "profile", element: <DoctorProfile /> },
      { path: "inpatients", element: <InpatientsManager /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
