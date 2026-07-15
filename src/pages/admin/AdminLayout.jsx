import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import { logoutAdmin } from "../../store/services/authSlice";

import {
  LuLayoutDashboard,
  LuStethoscope,
  LuCalendarDays,
  LuUsers,
  LuCalendarRange,
  LuBed,
  LuDoorOpen,
  LuCreditCard,
  LuWallet,
  LuChevronLeft,
  LuChevronRight,
  LuMenu,
  LuX,
  LuLogOut,
} from "react-icons/lu";

const AdminLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logoutAdmin());
    navigate("/login");
  };

  const navItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: LuLayoutDashboard },
    { path: "/admin/doctors", label: "Manage Doctors", icon: LuStethoscope },
    {
      path: "/admin/appointments",
      label: "Appointments",
      icon: LuCalendarDays,
    },
    { path: "/admin/staff", label: "Manage Staff", icon: LuUsers },
    {
      path: "/admin/duty-schedules",
      label: "Duty Schedules",
      icon: LuCalendarRange,
    },
    { path: "/admin/beds", label: "Manage Beds", icon: LuBed },
    { path: "/admin/admissions", label: "Admissions", icon: LuDoorOpen },
    {
      path: "/admin/counter-billing",
      label: "Counter Billing",
      icon: LuCreditCard,
    },
    {
      path: "/admin/finance-control-center",
      label: "Finance Control",
      icon: LuWallet,
    },
  ];

  return (
    <div
      className="flex min-h-screen bg-slate-50 font-sans antialiased"
      dir="ltr"
    >
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-40 md:hidden transition-all duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed md:sticky top-0 bottom-0 left-0 bg-white border-r border-slate-200/60 p-4 flex flex-col justify-between z-50 transition-all duration-300 ease-in-out h-screen shrink-0 shadow-xs ${
          isSidebarOpen
            ? "w-64 translate-x-0"
            : "-translate-x-full md:translate-x-0 md:w-22"
        }`}
      >
        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex items-center justify-between pb-5 border-b border-slate-100 mb-6 shrink-0 min-h-11 w-full px-1">
            <div className="flex items-center gap-2 overflow-hidden shrink-0">
              <div className="h-9 w-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-black tracking-wider shadow-sm shadow-teal-500/25 text-base shrink-0">
                SC
              </div>
              {isSidebarOpen && (
                <h2 className="text-base font-black text-slate-800 tracking-tight whitespace-nowrap animate-fadeIn">
                  ShifaClick
                </h2>
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

            <button
              onClick={() => setIsSidebarOpen(false)}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer md:hidden shrink-0"
              title="Close Menu"
            >
              <LuX className="w-4 h-4" />
            </button>
          </div>

          <nav className="space-y-1.5 flex-1 overflow-y-auto pr-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const IconComponent = item.icon;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() =>
                    window.innerWidth < 768 && setIsSidebarOpen(false)
                  }
                  className={`flex items-center gap-3.5 p-3 rounded-xl text-xs font-bold transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? "bg-teal-50 text-teal-600 shadow-3xs border border-teal-100/50"
                      : "text-slate-500 hover:bg-slate-50/80 hover:text-slate-800 border border-transparent"
                  } ${!isSidebarOpen ? "md:justify-center md:px-0" : ""}`}
                  title={!isSidebarOpen ? item.label : ""}
                >
                  <IconComponent
                    className={`w-4 h-4 shrink-0 transition-transform duration-200 ${isActive ? "scale-105" : ""}`}
                  />
                  <span
                    className={`transition-all duration-200 tracking-tight ${
                      !isSidebarOpen && "md:opacity-0 md:w-0 md:overflow-hidden"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-slate-100 mt-4 shrink-0">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3.5 p-3 rounded-xl bg-rose-50/50 border border-rose-100/30 text-rose-600 hover:bg-rose-600 hover:text-white transition-all text-xs font-black cursor-pointer active:scale-98 ${
              !isSidebarOpen ? "md:justify-center md:px-0" : "justify-center"
            }`}
            title={!isSidebarOpen ? "Logout" : ""}
          >
            <LuLogOut className="w-4 h-4 shrink-0" />
            <span
              className={`transition-all duration-200 tracking-tight ${
                !isSidebarOpen && "md:opacity-0 md:w-0 md:overflow-hidden"
              }`}
            >
              Logout
            </span>
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0 w-full flex flex-col min-h-screen transition-all duration-300">
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 p-4 px-6 md:px-8 flex justify-between items-center sticky top-0 z-30 h-16 shadow-3xs">
          <div className="flex items-center gap-3 h-full">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 -ml-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl active:scale-95 cursor-pointer transition-all flex items-center justify-center border border-transparent hover:border-slate-200/40"
              title="Toggle Menu"
            >
              <LuMenu className="w-5 h-5" />
            </button>
            <h1 className="font-extrabold text-slate-700 text-sm md:text-base tracking-tight whitespace-nowrap">
              Admin Control Portal
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200/50 px-3 py-1.5 rounded-full whitespace-nowrap">
              Super Admin
            </span>
          </div>
        </header>

        <main className="p-6 md:p-8 flex-1 w-full overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
