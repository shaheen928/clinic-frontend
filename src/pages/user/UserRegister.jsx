import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  useRegisterUserMutation,
  useSendOTPMutation,
} from "../../store/services/userApi";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUserToken } from "../../store/services/authSlice";

const UserRegister = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [registerUser, { isLoading: isRegistering }] =
    useRegisterUserMutation();
  const [sendOTP, { isLoading: isSendingOtp }] = useSendOTPMutation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    password: "",
    confirmPassword: "",
  });

  const [uiError, setUiError] = useState("");
  const [apiError, setApiError] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (uiError) setUiError("");
    if (apiError) setApiError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setUiError("Passwords do not match! Please check again.");
      toast.error("Passwords do not match!");
      return;
    }
    try {
      const response = await sendOTP({
        email: formData.email,
        type: "signup",
      }).unwrap();
      if (response.success) {
        toast.success("Verification code sent to your email! 📧");
        setShowOtpModal(true);
      }
    } catch (err) {
      const errorMsg =
        err?.data?.message || "Failed to send OTP. Please try again.";
      toast.error(errorMsg);
      setApiError(errorMsg);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 6) {
      toast.error("Please enter a valid 6-digit code.");
      return;
    }

    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      address: {
        line1: formData.addressLine1,
        line2: formData.addressLine2,
      },
      otp: otpCode,
    };

    try {
      const response = await registerUser(payload).unwrap();
      dispatch(setUserToken(response.token));
      toast.success("Account Created Successfully! 🚀");
      setShowOtpModal(false);
      const redirectTo = location.state?.from || "/";
      navigate(redirectTo, { replace: true });
    } catch (err) {
      toast.error(
        err?.data?.message || "Registration Failed. Please try again.",
      );
    }
  };

  return (
    <div
      className="min-h-screen bg-slate-50/50 font-sans flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden"
      dir="ltr"
    >
      <div className="absolute top-0 left-0 w-96 h-96 bg-teal-100/30 rounded-full blur-3xl -z-10 -translate-x-1/4 -translate-y-1/4" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-100/20 rounded-full blur-3xl -z-10 translate-x-1/4 translate-y-1/4" />

      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-md px-4">
          <div className="bg-white p-8 rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 text-center space-y-5 transform transition-all">
            <div className="h-12 w-12 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center text-xl font-bold mx-auto shadow-2xs">
              📧
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                Verify Your Email
              </h3>
              <p className="text-xs text-slate-400 mt-1.5 font-medium leading-relaxed">
                We've sent a 6-digit code to{" "}
                <span className="font-bold text-slate-700 block mt-0.5">
                  {formData.email}
                </span>
              </p>
            </div>

            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <input
                type="text"
                maxLength="6"
                placeholder="123456"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                disabled={isRegistering}
                className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl text-center text-xl font-black tracking-[6px] focus:outline-hidden focus:border-teal-500 focus:bg-white transition-all"
                required
              />
              <button
                type="submit"
                disabled={isRegistering}
                className="w-full bg-slate-900 hover:bg-teal-600 text-white font-extrabold py-3.5 rounded-xl text-sm shadow-xs transition-all duration-200 active:scale-98 flex justify-center items-center cursor-pointer"
              >
                {isRegistering ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Verify & Register 🚀"
                )}
              </button>
            </form>

            <button
              onClick={() => setShowOtpModal(false)}
              disabled={isRegistering}
              className="text-xs font-bold text-slate-400 hover:text-rose-500 transition-colors pt-1 cursor-pointer"
            >
              Cancel & Go Back
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
          Create Your Account
        </h2>
        <p className="mt-2 text-sm text-slate-400 font-bold max-w-xs mx-auto leading-relaxed">
          Join Shifa<span className="text-teal-600">Click</span> to book slots
          instantly
        </p>
      </div>

      <div className="mt-8 mx-4 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="bg-white py-8 px-6 shadow-xl border border-slate-100 rounded-3xl sm:px-10 transition-all duration-300 hover:shadow-2xl hover:shadow-slate-100/50">
          {uiError && (
            <div className="mb-4 bg-rose-50 border border-rose-100 text-rose-600 font-extrabold text-xs p-3.5 rounded-xl text-center flex items-center justify-center gap-2 animate-pulse">
              <span>⚠️</span> {uiError}
            </div>
          )}
          {apiError && (
            <div className="mb-4 bg-rose-50 border border-rose-100 text-rose-600 font-extrabold text-xs p-3.5 rounded-xl text-center flex items-center justify-center gap-2">
              <span>❌</span> {apiError}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="name"
                className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider"
              >
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                disabled={isSendingOtp}
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Bilal Ahmad"
                className="block w-full mt-1.5 px-4 py-3 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl focus:outline-hidden focus:border-teal-500 focus:bg-white text-sm font-semibold transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  disabled={isSendingOtp}
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="block w-full mt-1.5 px-4 py-3 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl focus:outline-hidden focus:border-teal-500 focus:bg-white text-sm font-semibold transition-all"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider"
                >
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  disabled={isSendingOtp}
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="03001234567"
                  className="block w-full mt-1.5 px-4 py-3 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl focus:outline-hidden focus:border-teal-500 focus:bg-white text-sm font-semibold transition-all"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="addressLine1"
                className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider"
              >
                Address Line 1 (Street / House No)
              </label>
              <input
                id="addressLine1"
                name="addressLine1"
                type="text"
                disabled={isSendingOtp}
                required
                value={formData.addressLine1}
                onChange={handleChange}
                placeholder="House # 12, Street # 3"
                className="block w-full mt-1.5 px-4 py-3 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl focus:outline-hidden focus:border-teal-500 focus:bg-white text-sm font-semibold transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="addressLine2"
                className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider"
              >
                Address Line 2 (City / Area)
              </label>
              <input
                id="addressLine2"
                name="addressLine2"
                type="text"
                disabled={isSendingOtp}
                required
                value={formData.addressLine2}
                onChange={handleChange}
                placeholder="Samanabad, Lahore"
                className="block w-full mt-1.5 px-4 py-3 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl focus:outline-hidden focus:border-teal-500 focus:bg-white text-sm font-semibold transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="password"
                  className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  disabled={isSendingOtp}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="block w-full mt-1.5 px-4 py-3 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl focus:outline-hidden focus:border-teal-500 focus:bg-white text-sm font-semibold transition-all"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  disabled={isSendingOtp}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="block w-full mt-1.5 px-4 py-3 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl focus:outline-hidden focus:border-teal-500 focus:bg-white text-sm font-semibold transition-all"
                />
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={isSendingOtp}
                className="w-full flex justify-center bg-teal-600 hover:bg-teal-700 text-white font-black py-3.5 px-4 rounded-xl shadow-sm hover:shadow-lg hover:shadow-teal-600/20 transition-all duration-200 active:scale-98 text-sm cursor-pointer border border-transparent"
              >
                {isSendingOtp ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Create Account 🚀"
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 border-t border-slate-100 pt-6 text-center">
            <p className="text-sm text-slate-400 font-bold">
              Already have an account?{" "}
              <Link
                to="/user-login"
                className="font-black text-teal-600 hover:text-teal-700 underline transition-colors"
              >
                Sign In instead
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRegister;
