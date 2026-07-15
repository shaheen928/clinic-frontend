import { useState } from "react";
import { useAdminLoginMutation } from "../../store/services/adminApi";
import { useDoctorLoginMutation } from "../../store/services/doctorApi";
import { useStaffLoginMutation } from "../../store/services/staffApi";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  setAdminToken,
  setDoctorToken,
  setStaffToken,
} from "../../store/services/authSlice";
import { toast } from "react-toastify";

const Login = () => {
  const [role, setRole] = useState("doctor");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [adminLogin, { isLoading: isAdminLoading }] = useAdminLoginMutation();
  const [doctorLogin, { isLoading: isDocLoading }] = useDoctorLoginMutation();
  const [staffLogin, { isLoading: isStaffLoading }] = useStaffLoginMutation();
  const isLoading = isAdminLoading || isDocLoading || isStaffLoading;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
    setEmail("");
    setPassword("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (role === "admin") {
        const response = await adminLogin({ email, password }).unwrap();
        if (response.success) {
          toast.success("Welcome Admin! Login successful");
          if (response.token) dispatch(setAdminToken(response.token));
          navigate("/admin/dashboard");
        }
      } else if (role === "doctor") {
        const response = await doctorLogin({ email, password }).unwrap();
        if (response.success) {
          toast.success(response.message || "Welcome Doctor!");
          if (response.token) dispatch(setDoctorToken(response.token));
          navigate("/doctor/dashboard");
        }
      } else if (role === "staff") {
        const response = await staffLogin({ email, password }).unwrap();
        if (response.success) {
          toast.success(response.message || "Welcome Staff Member!");
          if (response.token) dispatch(setStaffToken(response.token));
          navigate("/staff/dashboard");
        }
      }
    } catch (error) {
      const errorMsg = error?.data?.message || "Login failed, please try again";
      toast.error(errorMsg);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl shadow-slate-100 border border-slate-100">
        <div className="text-center">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="group inline-flex flex-col items-center justify-center cursor-pointer focus:outline-none"
            title="Go to Home Page"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-teal-600 text-2xl group-hover:scale-105 group-hover:bg-teal-200/70 transition-all duration-200">
              🏥
            </div>
            <h2 className="mt-4 text-center text-2xl font-extrabold tracking-tight text-slate-800 capitalize group-hover:text-teal-600 transition-colors duration-200">
              {role === "admin"
                ? "Admin Control Panel"
                : role === "staff"
                  ? "Nursing Staff Panel"
                  : "Doctor Portal"}
            </h2>
          </button>

          <p className="mt-2 text-sm text-slate-500">
            Login to manage your dashboard securely.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl mt-4">
          <button
            type="button"
            onClick={() => handleRoleChange("doctor")}
            className={`py-2 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
              role === "doctor"
                ? "bg-white text-teal-600 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            🩺 Doctor
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange("staff")}
            className={`py-2 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
              role === "staff"
                ? "bg-white text-teal-600 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            🧑‍⚕️ Staff
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange("admin")}
            className={`py-2 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
              role === "admin"
                ? "bg-white text-teal-600 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            🔑 Admin
          </button>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={
                  role === "admin"
                    ? "admin@hospital.com"
                    : role === "staff"
                      ? "staff@hospital.com"
                      : "doctor@hospital.com"
                }
                className="relative block w-full appearance-none rounded-lg border border-slate-200 px-3 py-2.5 text-slate-900 placeholder-slate-400 focus:z-10 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100 transition-all sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="relative block w-full appearance-none rounded-lg border border-slate-200 px-3 py-2.5 text-slate-900 placeholder-slate-400 focus:z-10 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100 transition-all sm:text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full mt-6 justify-center rounded-lg bg-teal-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-teal-100 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:bg-teal-400 transition-all cursor-pointer"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">Waiting...</span>
              ) : (
                `Sign In as ${role}`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
