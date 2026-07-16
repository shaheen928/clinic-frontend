import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../store/services/authSlice";
import { toast } from "react-toastify";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isUserAuthenticated } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    toast.info("Logged out successfully.");
    dispatch(logoutUser());
    navigate("/user-login");
    setIsOpen(false);
  };

  return (
    <header className="w-full bg-white/80 backdrop-blur-md border-b border-slate-100/80 sticky top-0 z-50 transition-all duration-300">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
        <div className="flex items-center">
          {/* <Link to="/" className="flex items-center gap-2.5 group transition-transform duration-200 active:scale-98">
            <div className="h-10 w-10 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center font-bold text-xl group-hover:bg-teal-600 group-hover:text-white transition-all duration-300 shadow-2xs">
              🏥
            </div>
            <span className="font-black text-slate-800 text-xl sm:text-2xl tracking-tight whitespace-nowrap">
              Shifa<span className="text-teal-600 group-hover:text-teal-500 transition-colors">Click</span>
            </span>
          </Link> */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group transition-transform duration-200 active:scale-98"
          >
            <div className="h-10 w-10 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-all duration-300 shadow-2xs">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path d="M19 10.5h-5.5V5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v5.5H5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5h5.5V19c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-5.5H19c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5z" />
              </svg>
            </div>
            <span className="font-black text-slate-800 text-xl sm:text-2xl tracking-tight whitespace-nowrap">
              Shifa
              <span className="text-teal-600 group-hover:text-teal-500 transition-colors">
                Click
              </span>
            </span>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-3">
          {isUserAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                to="/my-appointments"
                className="text-slate-600 hover:text-teal-600 font-bold text-sm px-4 py-2.5 rounded-xl hover:bg-teal-50/60 transition-all duration-200"
              >
                My Appointments 📅
              </Link>

              <button
                onClick={handleLogout}
                className="bg-rose-50 text-rose-600 hover:bg-rose-100 font-extrabold text-sm px-5 py-2.5 rounded-xl transition-all duration-200 active:scale-95 cursor-pointer border border-rose-100/50"
              >
                Logout 🚪
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/user-login"
                className="text-slate-600 hover:text-teal-600 font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-slate-50 transition-all duration-200 cursor-pointer"
              >
                Sign In
              </Link>
              <Link
                to="/user-register"
                className="bg-slate-900 text-white hover:bg-teal-600 font-extrabold text-sm px-6 py-2.5 rounded-xl shadow-xs hover:shadow-md transition-all duration-200 active:scale-95 cursor-pointer border border-transparent"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>

        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-slate-700 hover:text-teal-600 p-2 rounded-xl hover:bg-slate-50 transition-all duration-200 focus:outline-hidden"
          >
            {isOpen ? (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden w-full bg-white border-b border-slate-100 px-6 py-4 space-y-2 flex flex-col shadow-xl animate-fadeIn">
          {isUserAuthenticated ? (
            <>
              <Link
                to="/my-appointments"
                onClick={() => setIsOpen(false)}
                className="text-slate-600 hover:text-teal-600 font-semibold text-sm py-2.5 px-3 rounded-lg hover:bg-slate-50 block transition-colors"
              >
                My Appointments 📅
              </Link>
              <Link
                to="/user-profile"
                onClick={() => setIsOpen(false)}
                className="text-slate-600 hover:text-teal-600 font-semibold text-sm py-2.5 px-3 rounded-lg hover:bg-slate-50 block transition-colors"
              >
                Profile 👤
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left bg-rose-50 text-rose-600 font-bold text-sm px-4 py-2.5 rounded-xl mt-2 block transition-colors hover:bg-rose-100"
              >
                Logout 🚪
              </button>
            </>
          ) : (
            <div className="space-y-3 pt-1">
              <Link
                to="/user-login"
                onClick={() => setIsOpen(false)}
                className="text-slate-600 font-semibold text-sm py-2.5 px-3 rounded-lg hover:bg-slate-50 block text-center transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/user-register"
                onClick={() => setIsOpen(false)}
                className="w-full text-center bg-teal-600 text-white font-bold text-sm py-3 rounded-xl block shadow-sm hover:bg-teal-700 transition-colors"
              >
                Create Account 🚀
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
