import React, { useState } from "react";
import { Outlet, useNavigate, NavLink, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutDoctor } from "../../store/services/authSlice";
import { useGetDoctorProfileQuery } from "../../store/services/doctorApi";

import {
  LuLayoutDashboard,
  LuCalendarDays,
  LuBuilding2,
  LuUser,
  LuLogOut,
  LuMenu,
  LuX,
  LuChevronLeft,
  LuChevronRight,
  LuStethoscope,
} from "react-icons/lu";

const DoctorLayout = () => {
  const { data: doctorData, isLoading } = useGetDoctorProfileQuery();
  const doctorName = doctorData?.doctorData?.name || "Doctor";

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      dispatch(logoutDoctor());
      navigate("/login");
    }
  };

  const navItems = [
    {
      path: "/doctor/dashboard",
      label: "Dashboard",
      icon: (
        <LuLayoutDashboard className="w-5 h-5 transition-transform group-hover:scale-105" />
      ),
    },
    {
      path: "/doctor/appointments",
      label: "Appointments",
      icon: (
        <LuCalendarDays className="w-5 h-5 transition-transform group-hover:scale-105" />
      ),
    },
    {
      path: "/doctor/inpatients",
      label: "In-Patients",
      icon: (
        <LuBuilding2 className="w-5 h-5 transition-transform group-hover:scale-105" />
      ),
    },
    {
      path: "/doctor/profile",
      label: "My Profile",
      icon: (
        <LuUser className="w-5 h-5 transition-transform group-hover:scale-105" />
      ),
    },
  ];

  return (
    <div
      className="flex h-screen bg-slate-50/50 font-sans text-slate-900 antialiased"
      dir="ltr"
    >
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-40 md:hidden transition-all duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed md:sticky top-0 bottom-0 left-0 bg-white border-r border-slate-200/60 p-4 flex flex-col justify-between z-50 transition-all duration-300 ease-in-out h-screen shrink-0 ${
          isSidebarOpen
            ? "w-64 translate-x-0 shadow-xl shadow-slate-100/50 md:shadow-none"
            : "-translate-x-full md:translate-x-0 md:w-22"
        }`}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between py-2.5 border-b border-slate-100 shrink-0 min-h-11 w-full px-1">
            <div className="flex items-center gap-2.5 overflow-hidden shrink-0">
              <div className="h-9 w-9 bg-teal-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-teal-600/20 shrink-0">
                <LuStethoscope className="w-5 h-5 text-white" />
              </div>
              {isSidebarOpen && (
                <span className="font-black text-slate-800 text-lg tracking-tight select-none animate-fadeIn">
                  Shifa<span className="text-teal-600">Click</span>
                  <span className="ml-1.5 text-[10px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded-md border border-teal-200/40">
                    PRO
                  </span>
                </span>
              )}
            </div>

            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200/50 transition-all cursor-pointer hidden md:flex items-center justify-center shrink-0"
              title={isSidebarOpen ? "Collapse Menu" : "Expand Menu"}
            >
              {isSidebarOpen ? (
                <LuChevronLeft className="w-4 h-4" />
              ) : (
                <LuChevronRight className="w-4 h-4" />
              )}
            </button>

            {isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer md:hidden flex items-center justify-center shrink-0"
                title="Close Menu"
              >
                <LuX className="w-5 h-5" />
              </button>
            )}
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() =>
                  window.innerWidth < 768 && setIsSidebarOpen(false)
                }
                className={({ isActive }) => `
                  group flex items-center rounded-xl text-sm font-bold transition-all duration-250 relative ${
                    isSidebarOpen
                      ? "px-4 py-3.5 gap-3.5"
                      : "p-3.5 justify-center"
                  } ${
                    isActive
                      ? "bg-linear-to-r from-teal-600 to-teal-700 text-white shadow-lg shadow-teal-600/15"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                  }
                `}
                title={!isSidebarOpen ? item.label : ""}
              >
                <span className="shrink-0">{item.icon}</span>
                {isSidebarOpen && (
                  <span className="truncate tracking-wide">{item.label}</span>
                )}

                {!isSidebarOpen && (
                  <div className="absolute left-full ml-4 px-2.5 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-xl">
                    {item.label}
                  </div>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="space-y-1.5">
          <button
            onClick={handleLogout}
            className={`group flex items-center text-sm font-bold text-rose-600 hover:bg-rose-50/70 rounded-xl transition-all w-full cursor-pointer relative ${
              isSidebarOpen
                ? "px-4 py-3.5 gap-3.5 text-left"
                : "p-3.5 justify-center"
            }`}
            title={!isSidebarOpen ? "Logout" : ""}
          >
            <span className="shrink-0">
              <LuLogOut className="w-5 h-5" />
            </span>
            {isSidebarOpen && <span className="tracking-wide">Logout</span>}

            {!isSidebarOpen && (
              <div className="absolute left-full ml-4 px-2.5 py-1.5 bg-rose-600 text-white text-xs font-bold rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-xl">
                Logout
              </div>
            )}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-full overflow-hidden transition-all duration-300">
        <header className="h-16 bg-white border-b border-slate-200/60 flex items-center justify-between px-6 md:px-8 shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-4 h-full">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 -ml-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl active:scale-95 cursor-pointer transition-all flex items-center justify-center"
              title={isSidebarOpen ? "Collapse Menu" : "Expand Menu"}
            >
              <LuMenu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest hidden sm:inline-block">
                Live Doctor Portal
              </span>
            </div>
          </div>

          <Link
            to="/doctor/profile"
            className="flex items-center gap-3 hover:opacity-90 transition-opacity cursor-pointer group"
          >
            {isLoading ? (
              <div className="text-right hidden sm:block space-y-1.5">
                <div className="h-3.5 w-24 bg-slate-200 rounded-md animate-pulse"></div>
                <div className="h-2.5 w-16 bg-slate-100 rounded-md animate-pulse"></div>
              </div>
            ) : (
              <div className="text-right hidden sm:block">
                <h4 className="text-sm font-extrabold text-slate-700 leading-none mb-1 group-hover:text-teal-600 transition-colors">
                  {doctorName}
                </h4>
                <p className="text-[10px] font-bold text-slate-400 tracking-wide">
                  Panel Verified
                </p>
              </div>
            )}

            <div className="h-9 w-9 bg-teal-50 text-teal-600 rounded-xl border border-teal-100 flex items-center justify-center font-black text-sm shadow-inner group-hover:bg-teal-600 group-hover:text-white transition-all duration-200 shrink-0">
              {isLoading ? "..." : doctorName.charAt(0).toUpperCase()}
            </div>
          </Link>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50/50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DoctorLayout;
