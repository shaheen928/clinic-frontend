import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  useLoginUserMutation,
  useSendOTPMutation,
  useResetPasswordMutation,
} from "../../store/services/userApi";
import { useDispatch } from "react-redux";
import { setUserToken } from "../../store/services/authSlice";
import { toast } from "react-toastify";

const UserLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [loginUser, { isLoading }] = useLoginUserMutation();
  const [sendOTP, { isLoading: isSendingOtp }] = useSendOTPMutation();
  const [resetPassword, { isLoading: isResetting }] =
    useResetPasswordMutation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [apiError, setApiError] = useState("");

  const [forgotModal, setForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotData, setForgotData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (apiError) setApiError("");
  };

  const handleForgotEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await sendOTP({
        email: forgotData.email,
        type: "forgot",
      }).unwrap();
      if (response.success) {
        toast.success("Verification OTP sent to your email!");
        setForgotStep(2);
      }
    } catch (err) {
      toast.error(err?.data?.message || "Failed to send OTP.");
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (forgotData.newPassword !== forgotData.confirmNewPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    try {
      const response = await resetPassword({
        email: forgotData.email,
        otp: forgotData.otp,
        newPassword: forgotData.newPassword,
      }).unwrap();
      if (response.success) {
        toast.success("Password Updated Successfully! Please login.");
        setForgotModal(false);
        setForgotStep(1);
        setForgotData({
          email: "",
          otp: "",
          newPassword: "",
          confirmNewPassword: "",
        });
      }
    } catch (err) {
      toast.error(err?.data?.message || "Reset failed. Please check OTP.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(formData).unwrap();
      dispatch(setUserToken(response.token));
      toast.success("Welcome Back! Login Successful 🌟");
      const redirectTo = location.state?.from || "/";
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const errorMsg = err?.data?.message || "Invalid email or password.";
      setApiError(errorMsg);
      toast.error(errorMsg);
    }
  };

  return (
    <div
      className="min-h-screen bg-slate-50/50 font-sans flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden"
      dir="ltr"
    >
      <div className="absolute top-0 left-0 w-96 h-96 bg-teal-100/30 rounded-full blur-3xl -z-10 -translate-x-1/4 -translate-y-1/4" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-100/20 rounded-full blur-3xl -z-10 translate-x-1/4 translate-y-1/4" />

      {forgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-md px-4">
          <div className="bg-white p-8 rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 space-y-5 transform transition-all text-center">
            <div className="h-12 w-12 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center text-xl font-bold mx-auto shadow-2xs">
              🔑
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                Reset Password
              </h3>
              <p className="text-xs text-slate-400 mt-1.5 font-medium leading-relaxed">
                {forgotStep === 1
                  ? "Enter your registered email to receive an OTP code."
                  : "Enter the OTP and your new secure password."}
              </p>
            </div>

            {forgotStep === 1 ? (
              <form
                onSubmit={handleForgotEmailSubmit}
                className="space-y-4 text-left"
              >
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={forgotData.email}
                    onChange={(e) =>
                      setForgotData({ ...forgotData, email: e.target.value })
                    }
                    className="block w-full mt-1.5 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-teal-500 focus:bg-white transition-all font-medium"
                    placeholder="name@example.com"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSendingOtp}
                  className="w-full bg-slate-900 hover:bg-teal-600 text-white font-extrabold py-3.5 rounded-xl text-sm shadow-xs transition-all duration-200 active:scale-98 flex justify-center items-center cursor-pointer"
                >
                  {isSendingOtp ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    "Send OTP Code 🚀"
                  )}
                </button>
              </form>
            ) : (
              <form
                onSubmit={handleResetSubmit}
                className="space-y-4 text-left"
              >
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    6-Digit OTP
                  </label>
                  <input
                    type="text"
                    maxLength="6"
                    required
                    value={forgotData.otp}
                    onChange={(e) =>
                      setForgotData({
                        ...forgotData,
                        otp: e.target.value.replace(/\D/g, ""),
                      })
                    }
                    className="block w-full mt-1.5 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-center font-black tracking-[6px] text-xl focus:outline-hidden focus:border-teal-500 focus:bg-white transition-all text-slate-800"
                    placeholder="123456"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={forgotData.newPassword}
                    onChange={(e) =>
                      setForgotData({
                        ...forgotData,
                        newPassword: e.target.value,
                      })
                    }
                    className="block w-full mt-1.5 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-teal-500 focus:bg-white transition-all font-medium"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={forgotData.confirmNewPassword}
                    onChange={(e) =>
                      setForgotData({
                        ...forgotData,
                        confirmNewPassword: e.target.value,
                      })
                    }
                    className="block w-full mt-1.5 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-teal-500 focus:bg-white transition-all font-medium"
                    placeholder="••••••••"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isResetting}
                  className="w-full bg-slate-900 hover:bg-teal-600 text-white font-extrabold py-3.5 rounded-xl text-sm shadow-xs transition-all duration-200 active:scale-98 flex justify-center items-center cursor-pointer"
                >
                  {isResetting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    "Update Password 🔐"
                  )}
                </button>
              </form>
            )}

            <button
              type="button"
              onClick={() => {
                setForgotModal(false);
                setForgotStep(1);
              }}
              className="text-xs font-bold text-slate-400 hover:text-rose-500 transition-colors pt-1 cursor-pointer"
            >
              Cancel & Return
            </button>
          </div>
        </div>
      )}

      <div className="mx-2 sm:mx-auto sm:w-full sm:max-w-md text-center z-10">
        <Link
          to="/"
          className="h-12 w-12 bg-white border border-slate-100 shadow-xs text-xl rounded-2xl inline-flex items-center justify-center mb-4 transition-transform active:scale-95"
        >
          🏥
        </Link>
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">
          Welcome Back to Shifa<span className="text-teal-600">Click</span>
        </h2>
        <p className="mt-2 text-sm text-slate-400 font-bold max-w-xs mx-auto leading-relaxed">
          Log in to manage your appointments and check slot availability
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="bg-white mx-4 sm:mx-0 py-8 px-6 shadow-xl border border-slate-100 rounded-3xl sm:px-10 transition-all duration-300 hover:shadow-2xl hover:shadow-slate-100/50">
          {apiError && (
            <div className="mb-5 bg-rose-50 border border-rose-100 text-rose-600 font-extrabold text-xs p-3.5 rounded-xl text-center flex items-center justify-center gap-2">
              <span>⚠️</span> {apiError}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider"
              >
                Email Address
              </label>
              <div className="mt-1.5 relative rounded-xl shadow-3xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 text-sm">
                  📧
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  disabled={isLoading}
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl focus:outline-hidden focus:border-teal-500 focus:bg-white text-sm font-semibold transition-all"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider"
              >
                Password
              </label>
              <div className="mt-1.5 relative rounded-xl shadow-3xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 text-sm">
                  🔒
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  disabled={isLoading}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl focus:outline-hidden focus:border-teal-500 focus:bg-white text-sm font-semibold transition-all"
                />
              </div>

              <div className="text-right mt-2">
                <button
                  type="button"
                  onClick={() => setForgotModal(true)}
                  className="text-xs font-extrabold text-teal-600 hover:text-teal-700 transition-colors cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center bg-teal-600 hover:bg-teal-700 text-white font-black py-3.5 px-4 rounded-xl shadow-sm hover:shadow-lg hover:shadow-teal-600/20 transition-all duration-200 active:scale-98 text-sm cursor-pointer border border-transparent"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Sign In 🚀"
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 border-t border-slate-100 pt-6 text-center">
            <p className="text-sm text-slate-400 font-bold">
              Don't have an account yet?{" "}
              <Link
                to="/user-register"
                state={{ from: location.state?.from }}
                className="font-black text-teal-600 hover:text-teal-700 underline transition-colors"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
